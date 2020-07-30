import EventSchema from './Event';

export default class WsMsgChange {

    /* jshint ignore:start */
    static TYPE = "change"
    /* jshint ignore:end */

    constructor() {
        this.model_state_diff = [];

        /** @type {EventSchema[]} */
		this.model_events_new = [];
    }
}