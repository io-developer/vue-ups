<script>
    export default {
        name: "StatusFlag",
        data: () => ({}),
        props: {
            flag: {
                title: "N/A",
                tags: [],
            },
        },
        methods: {
            getTagClasses: function() {
                let classMap = {};
                (this.flag.tags || []).forEach(tag => {
                    classMap["ups__status-flag--" + tag] = true;
                });
                return classMap;
            },
        },
    };
</script>

<template>
    <span class="ups__status-flag" :class="getTagClasses()">{{ flag.title }}</span>
</template>