import Connection from './Connection';

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
    }

    updateStatus(flags) {
    }

    updateEvents(events = [], resetEvents = false, forceUpdate = false) {
    }

    handleSignal(type) {
    }
}

export default Model;