import Connection from './Connection';
import StatusFlag from './StatusFlag';

import EventSchema from './schema/Event';
import StateSchema from './schema/State';
import WsMsgInitSchema from './schema/WsMsgInit';
import WsMsgChangeSchema from './schema/WsMsgChange';
import WsMsgSignalSchema from './schema/WsMsgSignal';

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

export default class Model {
    constructor(options = {}) {
        this.opts = Object.assign({
            websocketUri: 'ws://localhost:8001/ws',
            reinitInterval: 60 * 1000,
            eventLimit: 7,
        }, options);

        this.data = {

            /** @type {StateSchema} */
            state: {},

            /** @type {EventSchema[]} */
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

    onConnData(msgData = {}) {
        if (msgData.type == WsMsgInitSchema.TYPE) {
            /** @type {WsMsgInitSchema} */
            let data = msgData;

            this.updateState(data.model_state || {});
            this.updateEvents(data.model_events || [], true);

        } else if (msgData.type == WsMsgChangeSchema.TYPE) {
            /** @type {WsMsgChangeSchema} */
            let data = msgData;

            let state = {};
            let diff = data.model_state_diff || {};
            for (let k in diff) {
                state[k] = diff[k][1];
            }
            this.updateState(state);
            this.updateEvents(data.model_events_new || []);

        } else if (msgData.type == WsMsgSignalSchema.TYPE) {
            /** @type {WsMsgSignalSchema} */
            let data = msgData;

            this.handleSignal(data.signal);
            this.updateEvents([], false, false);
        }
    }

    resetData() {
        this.conn.send("init");
    }

    /**
     * @param {StateSchema} diff
     */
    updateState(diff) {
        this.data.state = Object.assign({}, this.data.state, diff);
        if (diff.UpsStatus && diff.UpsStatus.Flag != null) {
            this.updateStatus(diff.UpsStatus.Flag);
        }
    }

    /**
     * @param {Number} flag
     */
    updateStatus(flag) {
        this.data.statusFlags = StatusFlag.typesFromStatus(flag).map(
            type => new StatusFlag(type, [type])
        );
    }

    /**
     * @param {EventSchema[]} events
     * @param {Boolean} resetEvents
     * @param {Boolean} forceUpdate
     */
    updateEvents(events = [], resetEvents = false, forceUpdate = false) {
    }

    handleSignal(type) {
    }
}