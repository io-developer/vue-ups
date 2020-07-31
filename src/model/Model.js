import Connection from './Connection';
import StatusFlag from './StatusFlag';
import SignalType from './schema/SignalType';

import StateSchema from './schema/State';
import EventSchema from './schema/Event';
import EventType from './schema/EventType';
import WsMsgInitSchema from './schema/WsMsgInit';
import WsMsgChangeSchema from './schema/WsMsgChange';
import WsMsgSignalSchema from './schema/WsMsgSignal';

export default class Model {
    constructor(options = {}) {
        this.opts = Object.assign({
            websocketUri: 'ws://localhost:8001/ws',
            reinitInterval: 60 * 1000,
            eventLimit: 7,
            eventSignalsEnabled: {
                [SignalType.POWEROUT]: 1,
                [SignalType.STARTSELFTEST]: 1,
                [SignalType.ENDSELFTEST]: 1,
            },
            signalsEnabled: {
                [SignalType.POWEROUT]: {},
                [SignalType.MAINSBACK]: {hidden: true},
                [SignalType.STARTSELFTEST]: {},
                [SignalType.ENDSELFTEST]: {hidden: true},
                [SignalType.DISCONNECT]: {},
            },
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
        this.handleSignal(SignalType.CONNECT);
    }

    onDiconnect() {
        this.handleSignal(SignalType.DISCONNECT);
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
        if (diff.UpsStatus) {
            this.updateStatus();
        }
    }

    /**
     * @param {Number|null} flag
     */
    updateStatus(flag = null) {
        if (flag == null) {
            flag = (this.data.state.UpsStatus || {}).Flag;
        }
        if (flag == null) {
            return;
        }
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
        if (events.length == 0 && !resetEvents && !forceUpdate) {
            return;
        }
        this.data.events = (resetEvents ? [] : this.data.events)
            .concat(events)
            .filter(event => {
                if (event.Type == EventType.SIGNAL) {
                    let data = event.Data || {};
                    return data.signal in this.opts.eventSignalsEnabled;
                }
                return true;
            })
            .slice(-this.opts.eventLimit)
        ;
    }

    handleSignal(type) {
        this.updateStatus();

        if (type in this.opts.signalsEnabled) {
            let flagType = `signal_${type}`;
            let flag = new StatusFlag(flagType, [flagType]);

            let props = this.opts.signalsEnabled[type];
            props = (typeof props == "object") ? props || {} : {};
            Object.assign(flag, props);

            this.data.statusFlags.push(flag);
        }
    }
}