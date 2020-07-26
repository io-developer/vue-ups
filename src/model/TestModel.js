export default class {
    constructor() {
    }

    destroy() {
    }

    getData() {
        return {
            events: [
                {
                    Ts: "2020-07-25T00:00:00",
                    Type: "signal",
                    Data: {
                        signal: this.staticClass,
                    },
                },
                {
                    Ts: "2020-07-25T00:00:00",
                    Type: "signal",
                    Data: {
                        signal: "powerout",
                    },
                },
                {
                    Ts: "2020-07-25T00:00:01",
                    Type: "onbatt",
                    Data: {
                        reason_type: 7,
                    },
                },
                {
                    Ts: "2020-07-25T00:23:37",
                    Type: "onbatt_end",
                    Data: {
                        ts_start: "2020-07-25T00:00:01",
                        ts_end: "2020-07-25T00:23:37",
                    },
                },
                {
                    Ts: "2020-07-25T00:23:38",
                    Type: "turned_off",
                },
                {
                    Ts: "2020-07-25T01:17:32",
                    Type: "turned_on",
                },
                {
                    Ts: "2020-07-27T13:51:43",
                    Type: "line_ok",
                },
            ],
            statusFlags: [
                { title: "online", tags: ["online"] },
                { title: "startselftest", tags: ["warn"] },
            ],
        };
    }
};