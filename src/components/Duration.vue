<script>
    export default {
        name: "Duration",
        data: () => ({}),
        props: {
            seconds: 0,
        },
        methods: {
            getDuration() {
                let seconds = 1.0 * this.seconds;

                let days = Math.floor(seconds / 86400);
                seconds -= days * 86400;

                let hours = Math.floor(seconds / 3600);
                seconds -= hours * 3600;

                let minutes = Math.floor(seconds / 60);
                seconds -= minutes * 60;
                seconds = Math.floor(seconds);

                return {days, hours, minutes, seconds};
            },
            getValues() {
                let empty;
                const filter = ([val, ...unused], index) => {
                    empty = index == 0 || empty;
                    empty = empty && !val;
                    return !empty;
                };
                let d = this.getDuration();
                return [
                        [d.days, "days"],
                        [d.hours, "hours"],
                        [d.minutes, "minutes", 2],
                        [d.seconds, "seconds", 2],
                    ]
                    // trim zeros from start and end
                    .filter(filter)
                    .reverse()
                    .filter(filter)
                    .reverse()
                    // format
                    .map(([val, label, len]) => {
                        val = len > 0 ? ('00' + val).slice(-len) : val;
                        return [val, label];
                    })
                ;
            }
        },
    };
</script>

<template>
    <span class="ups__duration">
        <span class="ups__duration-value" v-for="([val, type], index) in getValues()" :key="index"
        >{{ val }}<em class="ups__duration-label">{{ $t(`Ups.Duration.${type}`) }}</em></span>
    </span>
</template>