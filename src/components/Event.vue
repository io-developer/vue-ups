<script>
    import DurationComponent from "./Duration";
    import TimestampComponent from "./Timestamp";

    import EventType from '../model/schema/EventType';
    import SignalType from '../model/schema/SignalType';
    
    export default {
        name: "Event",
        components: {
            "Duration": DurationComponent,
            "Timestamp": TimestampComponent,
        },
        data: () => ({}),
        props: {
            timestamp: 0,
            type: "",
            data: {},
        },
        methods: {
            isSignal: function() {
                return this.type == EventType.SIGNAL;
            },
            isOnbatt: function() {
                return this.type == EventType.ONBATT;
            },
            isOnbattEnd: function() {
                return this.type == EventType.ONBATT_END;
            },
            getActiveClass: function() {
                let deltaSec = this.getNowDeltaSeconds();
                return {
                    'ups__event--new': deltaSec < 3600,
                    'ups__event--old': deltaSec > 24 * 3600,
                };
            },
            getUnixSeconds: function(ts = null) {
                ts = ts || this.timestamp;
                if (typeof ts == "string") {
                    ts = new Date(ts);
                }
                if (ts instanceof Date) {
                    return 0.001 * ts.getTime();
                }
                return Number(ts);
            },
            getNowDeltaSeconds: function() {
                return this.getUnixSeconds(new Date()) - this.getUnixSeconds();
            },
            getSignalType: function() {
                return (this.data || {}).signal;
            },
            getOnbattReasonType: function() {
                return (this.data || {}).reason_type;
            },
            getOnbattEndDuration: function() {
                let data = this.data || {};
                let ts_start = this.getUnixSeconds(data.ts_start);
                let ts_end = this.getUnixSeconds(data.ts_end);
                let seconds = data.seconds ? data.seconds : ts_end - ts_start;
                return seconds;
            },
        },
    };
</script>

<template>
    
    <div class="ups__event" :class="getActiveClass()">
        <Timestamp class="ups__event-date" :value="timestamp"/>

        <div v-if="isSignal()" class="ups__event-content">

            <span>{{ $t(`Ups.Signal.${getSignalType()}`) }}</span>

        </div>
        <div v-else class="ups__event-content">

            <span>{{ $t(`Ups.Event.${type}`) }}</span>

            <em v-if="isOnbatt()">
                {{ $t(`Ups.TransferOnbatteryReason.${getOnbattReasonType()}`) }}
            </em>
            <em v-else-if="isOnbattEnd()">
                <Duration :seconds="getOnbattEndDuration()"/>
            </em>

        </div>
    </div>

</template>