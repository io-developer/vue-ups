<script>
    export default {
        name: "StatusFlag",
        data: () => ({}),
        props: {
            type: {
                default: "",
            },
            tags: {
                default: [],
            },
        },
        methods: {
            isSignal() {
                return !!("" + this.type).match(/^signal_/);
            },
            getSignalType() {
                return ("" + this.type).replace(/^signal_/, "");
            },
            getTagClasses() {
                let classMap = {};
                (this.tags || []).forEach(tag => {
                    classMap["ups__status-flag--" + tag] = true;
                });
                return classMap;
            },
        },
    };
</script>

<template>
    <span class="ups__status-flag" :class="getTagClasses()">{{
        isSignal() ? $t(`Ups.Signal.${getSignalType()}`) : $t(`Ups.StatusFlag.${type}`)
    }}</span>
</template>