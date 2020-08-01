<script>
    export default {
        name: "Timestamp",
        data: () => ({}),
        props: {
            value: 0,
        },
        methods: {
			getDate: function() {
				let d = new Date(this.value);
				if (isNaN(d.valueOf()) || d.getTime() < 7 * 24 * 3600 * 1000) {
					return null;
				}
				return d;
			},
		},
    };
</script>


<template>
    <span>{{ getDate() | dateFormat('D MMM HH::mm') }}</span>
</template>