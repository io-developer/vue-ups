/**
 * @see https://github.com/io-developer/prom-apcupsd-exporter/blob/master/model/event.go
 */
export default class Event {
    constructor() {
        this.Ts = 0;
        this.Type = "";
        this.Data = {};
    }
}