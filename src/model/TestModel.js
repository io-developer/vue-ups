import StatusFlag from './StatusFlag';

class TestModel {
    constructor(options = {}) {
    }

    destroy() {
    }

    getData() {
        return {
            state: {
                UpsStatus: {
                    Flag: 0xFFFFFFFF,
                },
                BatteryCharge: 97.3,
                UpsTimeleftSeconds: 123456,
                InputVoltage: 227.123,
                InputVoltageMin: 221.456,
                InputVoltageMax: 231.789,
                OutputVoltage: 227.147,
                OutputLoad: 7.753,
                UpsTempInternal: 27.84,
                UpsTransferOnBatteryDate: (new Date("2020-07-30T13:49:37")).getTime() * 0.001,
                UpsTransferOnBatteryReason: 2,
                UpsOnBatterySeconds: 456,
            },
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
                new StatusFlag(StatusFlag.ONLINE, ["online"]),
                new StatusFlag(StatusFlag.OVERLOAD, ["overload", "alert"]),
                new StatusFlag("selftest", ["warn"]),
            ],
        };
    }
}


export default TestModel;