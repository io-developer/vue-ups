import StateSchema from './State';
import EventSchema from './Event';

export default class WsMsgInit {
    
    /* jshint ignore:start */
    static TYPE = "init"
    /* jshint ignore:end */

    constructor() {
        this.message = "";
        
        /** @type {StateSchema} */
        this.model_state = null;
        
        /** @type {EventSchema[]} */
        this.model_events = [];
    }
}