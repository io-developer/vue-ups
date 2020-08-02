<script>
    export default {
        name: "Decimal",
        data: () => ({}),
        props: {
            value: {
                default: 0,
            },
            decimal: {
                default: 1,
            },
        },
        methods: {
            getPart(part = null) {
                let [intPart, floatPart] = Number(this.value).toFixed(this.decimal).split('.');
                floatPart = floatPart ? floatPart.replace(/0+$/, '') : '';
                let parts = {
                    "int": intPart,
                    "float": floatPart,
                };
                return part ? parts[part] : parts;
            },
        },
    };
</script>

<template>
    <span>{{ getPart('int') }}<small v-if="getPart('float')">.{{ getPart('float') }}</small></span>
</template>