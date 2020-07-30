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

            // @see github.com/io-developer/prom-apcupsd-exporter/model/Event.go
            events: [],

            /** @type {StatusFlag[]} */
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
        this.data.statusFlags = StatusFlag.typesFromStatus(flags).map(
            type => new StatusFlag(type, [type])
        );
    }

    updateEvents(events = [], resetEvents = false, forceUpdate = false) {
    }

    handleSignal(type) {
    }
}

export default Model;