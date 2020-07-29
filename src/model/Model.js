import ws from './ws';

export default class {
    constructor(props = {}) {
        this.data = {
            state: {},
            events: [],
            statusFlags: [],
        };
    }

    destroy() {

    }

    getData() {
        return this.data;
    }
}