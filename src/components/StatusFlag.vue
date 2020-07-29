<script>
    export default {
        name: "StatusFlag",
        data: () => ({}),
        props: {
            title: {
                default: "N/A",
            },
            tags: {
                default: [],
            },
        },
        methods: {
            getTagClasses: function() {
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
    <span class="ups__status-flag" :class="getTagClasses()">{{ title }}</span>
</template>