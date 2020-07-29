import Connection from './Connection';
import StatusFlag from './StatusFlag';

const onbattReasonMap = {
    '1': '—',
    '2': 'Самодиагностика',
    '3': 'Команда от ПО',
    '4': 'Низкое напр.',
    '5': 'Высокое напр.',
    '6': 'Напряжение',
    '7': 'Скачки напряжения',
    '8': 'Частота',
    '9': 'Неизвестно',
};

const eventMap = {
    "commlost": "Нет сигнала",
    "commlost_end": "Сигнал ОК",
    "onbatt": "-> Батарея",
    "onbatt_end": "<- Батарея",
    "offline": "Нет сети",
    "online": "В сети",
    "line_ok": "Сеть ОК",
    "trim": "Высок напр",
    "boost": "Низк напр",
    "overload": "Перегрузка",
    "overload_end": "Нагрузка ОК",
    "nobatt": "Нет батареи",
    "nobatt_end": "Батарея ОК",
    "turned_on": "Включен",
    "turned_off": "Выключен",
};

const signalMap = {
    'powerout': 'Сбой в сети',
    'mainsback': 'В сети',
    'startselftest': 'Тест',
    'endselftest': 'Тест пройден',
};

const flagSignals = {
    'powerout': 1,
    'startselftest': 1,
};

const eventSignals = {
    'powerout': 1,
    'startselftest': 1,
    'endselftest': 1,
};

const Status = {
	// bit values for APC UPS Status Byte (ups->Status)
	"calibration": 0x00000001,
	"trim":        0x00000002,
	"boost":       0x00000004,
	"online":      0x00000008,
	"onbatt":      0x00000010,
	"overload":    0x00000020,
	"battlow":     0x00000040,
	"replacebatt": 0x00000080,

	// Extended bit values added by apcupsd
	"commlost":    0x00000100, // Communications with UPS lost
	"shutdown":    0x00000200, // Shutdown in progress
	"slave":       0x00000400, // Set if this is a slave
	"slavedown":   0x00000800, // Slave not responding
	"onbatt_msg":  0x00020000, // Set when UPS_ONBATT message is sent
	"fastpoll":    0x00040000, // Set on power failure to poll faster
	"shut_load":   0x00080000, // Set when BatLoad <= percent
	"shut_btime":  0x00100000, // Set when time on batts > maxtime
	"shut_ltime":  0x00200000, // Set when TimeLeft <= runtime
	"shut_emerg":  0x00400000, // Set when battery power has failed
	"shut_remote": 0x00800000, // Set when remote shutdown
	"plugged":     0x01000000, // Set if computer is plugged into UPS
	"battpresent": 0x04000000, // Indicates if battery is connected
};

const flagOptions = {
    comlost: {
        title: "Нет сигнала",
        tags: ["comlost", "alert"],
    },
    online: {
        title: "Сеть",
        tags: ["online"],
        containerTags: ["online"],
    },
    onbatt: {
        title: "На батарее",
        tags: ["onbatt", "warn"],
        containerTags: ["onbatt", "alert"],
    },
    off: {
        title: "Выключен",
        tags: ["off", "warn"],
    },
    calibration: {
        title: "Калибровка",
        tags: ["calibration"],
    },
    trim: {
        title: "Повышенное напр.",
        tags: ["trim", "warn"],
    },
    boost: {
        title: "Пониженное напр.",
        tags: ["boost", "warn"],
    },
    overload: {
        title: "Перегрузка",
        tags: ["overload", "alert"],
    },
    battlow: {
        title: "Низкий заряд",
        tags: ["battlow", "lowbatt", "alert"],
    },
    replacebatt: {
        title: "Замените батарею",
        tags: ["replacebatt", "warn"],
    },
    nobatt: {
        title: "Батарея отключена",
        tags: ["nobatt", "alert"],
    },
    shutdown: {
        title: "Отключение…",
        tags: ["shutdown", "alert"],
    },
};

class Model {
    constructor(options = {}) {
        this.opts = Object.assign({
            websocketUri: 'ws://localhost:8001/ws',
            reinitInterval: 60 * 1000,
            eventLimit: 7,
        }, options);

        this.data = {

            // @see github.com/io-developer/prom-apcupsd-exporter/model/State.go
            state: {},

            events: [],
            statusFlags: [],
        };

        this.conn = new Connection({
            uri: this.opts.websocketUri,
            reconnect: this.opts.websocketReconnect,
            reconnectInterval: this.opts.websocketReconnectInterval,
        });
        this.conn.onConnect = this.onConnect.bind(this);
        this.conn.onDiconnect = this.onDiconnect.bind(this);
        this.conn.onData = this.onConnData.bind(this);
        this.conn.connect();

        setInterval(this.resetData.bind(this), this.opts.reinitInterval);
    }

    destroy() {

    }

    getData() {
        return this.data;
    }

    onConnect(e) {
    //  $cont.removeClass(opts.cssClasses.containerUpsDiconnected);
    }

    onDiconnect() {
        this.handleSignal("disconnect");
    }

    onConnData(data = {}) {
        let state = {};
        let events = [];

        switch (data.type) {
            case 'init': 
                state = data.model_state || {};
                events = data.model_events || [];
                this.updateState(state);
                this.updateEvents(events, true);
                break;

            case 'change': 
                let diff = data.model_state_diff || {};
                for (let k in diff) {
                    state[k] = diff[k][1];
                }
                events = data.model_events_new || [];
                this.updateState(state);
                this.updateEvents(events);
                break;

            case 'signal': 
                this.handleSignal(data.signal);
                this.updateEvents([], false, false);
                break;

            default: break;
        }
    }

    resetData() {
        this.conn.send("init");
    }

    updateState(state) {
        this.data.state = Object.assign({}, this.data.state, state);
        if (state.UpsStatus) {
            if (state.UpsStatus.Flag != null) {
                this.updateStatus(state.UpsStatus.Flag);
            }
        }
    }

    updateStatus(flags) {
        let flagOpts = flagOptions;

        let statusFlags = [];
        let rootTags = [];

        StatusFlag.typesFromStatus(flags).forEach(type => {
            let flagOpt = type in flagOpts ? flagOpts[type] : {};
            statusFlags.push(new StatusFlag(type, flagOpt.tags));
            rootTags = rootTags.concat((flagOpt.rootTags || []).filter(tag => !!tag));
        });

        this.data.statusFlags = statusFlags;
    }

    updateEvents(events = [], resetEvents = false, forceUpdate = false) {
    }

    handleSignal(type) {
    }
}

export default Model;