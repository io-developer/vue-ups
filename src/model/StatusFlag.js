import ApcFlag from './schema/ApcupsdStatusFlag';

export default class StatusFlag {

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
        if (flags & ApcFlag.COMMLOST) {
            return [this.COMLOST];
        }
        return [
            [this.ONLINE, flags & ApcFlag.ONLINE],
            [this.ONBATT, flags & ApcFlag.ONBATT],
            [this.OFF, (flags & ApcFlag.PLUGGED) && (flags & ApcFlag.ONLINE) == 0 && (flags & ApcFlag.ONBATT) == 0],
            [this.CALIBRATION, flags & ApcFlag.CALIBRATION],
            [this.TRIM, flags & ApcFlag.TRIM],
            [this.BOOST, flags & ApcFlag.BOOST],
            [this.OVERLOAD, flags & ApcFlag.OVERLOAD],
            [this.LOWBATT, flags & ApcFlag.BATTLOW],
            [this.REPLACEBATT, flags & ApcFlag.REPLACEBATT],
            [this.NOBATT, (flags & ApcFlag.BATTPRESENT) == 0],
            [this.SHUTDOWN, flags & ApcFlag.SHUTDOWN],
        ].filter(([flag, ok]) => !!ok).map(([flag, ok]) => flag);
    }

    constructor(type, tags = []) {
        this.type = type;
        this.tags = tags;
    }
}