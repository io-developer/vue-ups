import Flag from './ApcupsdStatus';

class StatusFlag {
    /* jshint ignore:start */
    static COMLOST = "comlost"
    static ONLINE = "online"
    static ONBATT = "onbatt"
    static OFF = "off"
    static CALIBRATION = "calibration"
    static TRIM = "trim"
    static BOOST = "boost"
    static OVERLOAD = "overload"
    static LOWBATT = "lowbatt"
    static REPLACEBATT = "replacebatt"
    static NOBATT = "nobatt"
    static SHUTDOWN = "shutdown"
    /* jshint ignore:end */

    static typesFromStatus(flags) {
        if (flags & Flag.COMMLOST) {
            return [this.COMLOST];
        }
        return [
            [this.ONLINE, flags & Flag.ONLINE],
            [this.ONBATT, flags & Flag.ONBATT],
            [this.OFF, (flags & Flag.PLUGGED) && (flags & Flag.ONLINE) == 0 && (flags & Flag.ONBATT) == 0],
            [this.CALIBRATION, flags & Flag.CALIBRATION],
            [this.TRIM, flags & Flag.TRIM],
            [this.BOOST, flags & Flag.BOOST],
            [this.OVERLOAD, flags & Flag.OVERLOAD],
            [this.LOWBATT, flags & Flag.BATTLOW],
            [this.REPLACEBATT, flags & Flag.REPLACEBATT],
            [this.NOBATT, (flags & Flag.BATTPRESENT) == 0],
            [this.SHUTDOWN, flags & Flag.SHUTDOWN],
        ].filter(([flag, ok]) => !!ok).map(([flag, ok]) => flag);
    }

    constructor(type, tags = []) {
        this.type = type;
        this.tags = tags;
    }
}


export default StatusFlag;