class StatusFlag {
    /* jshint ignore:start */
    static COMLOST = "comlost"
    /* jshint ignore:end */

    constructor(flag, title = '', tags = []) {
        this.flag = flag;
        this.title = title ? title : flag;
        this.tags = tags;
    }
}


export default StatusFlag;