import StatusFlag from './StatusFlag';
import EventSchema from './schema/Event';
import EventType from './schema/EventType';
import StateSchema from './schema/State';
import SignalType from './schema/SignalType';

export default class ModelDemo {
    constructor(options = {}) {
    }

    destroy() {
    }

    getData() {
        return {
            
            /** @type {StateSchema} */
            state: {
                UpsStatus: {
                    Flag: 0xFFFFFFFF,
                },
                BatteryCharge: 3.0,
                UpsTimeleftSeconds: 1 * 3600 + 7 * 60,
                InputVoltage: 227.5,
                InputVoltageMin: 221.456,
                InputVoltageMax: 231.789,
                OutputVoltage: 227.9,
                OutputLoad: 93.753,
                UpsTempInternal: 31.6,
                UpsTransferOnBatteryReason: 2,
                UpsOnBatterySeconds: 456,
            },

            /** @type {EventSchema[]} */
            events: [
                {
                    Ts: "2020-07-25T00:00:00",
                    Type: EventType.COMMLOST_END,
                },
                {
                    Ts: "2020-07-25T00:00:00",
                    Type: "signal",
                    Data: {
                        signal: SignalType.POWEROUT,
                    },
                },
                {
                    Ts: "2020-07-25T00:00:01",
                    Type: EventType.ONBATT,
                    Data: {
                        reason_type: 7,
                    },
                },
                {
                    Ts: new Date((new Date()).getTime() - 3*3600*1000 - 10),
                    Type: EventType.ONBATT_END,
                    Data: {
                        ts_start: "2020-07-25T00:00:01",
                        ts_end: new Date((new Date()).getTime() - 3*3600*1000 - 10),
                    },
                },
                {
                    Ts: new Date((new Date()).getTime() - 3*3600*1000),
                    Type: "turned_off",
                },
                {
                    Ts: new Date((new Date()).getTime() - 300*1000),
                    Type: "turned_on",
                },
                {
                    Ts: new Date(),
                    Type: "line_ok",
                },
            ],

            /** @type {StatusFlag[]} */
            statusFlags: [
                new StatusFlag(StatusFlag.ONLINE, [StatusFlag.ONLINE]),
                new StatusFlag("__demomode__"),
                new StatusFlag(StatusFlag.OVERLOAD, [StatusFlag.OVERLOAD]),
                new StatusFlag(StatusFlag.LOWBATT, [StatusFlag.LOWBATT]),
            ],
        };
    }
}