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
            getIntPart: function() {
				let s = Number(this.value).toFixed(0);
				let [intPart, floatPart] = s.split('.');
				return intPart;
            },
            getFloatPart: function() {
				let s = Number(this.value).toFixed(this.decimal);
                let [intPart, floatPart] = s.split('.');
				return floatPart ? floatPart.replace(/0+$/, '') : '';
			},
        },
    };
</script>

<template>
    <span>{{ getIntPart() }}<small v-if="getFloatPart()">.{{ getFloatPart() }}</small></span>
</template>