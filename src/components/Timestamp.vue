<script>
    export default {
        name: "Timestamp",
        data: () => ({}),
        props: {
            value: 0,
        },
        methods: {
            getUnixSeconds(ts = null) {
                ts = ts || this.value;
                if (typeof ts == "string") {
                    ts = new Date(ts);
                }
                if (ts instanceof Date) {
                    return 0.001 * ts.getTime();
                }
                return Number(ts);
            },
			getDate() {
				let d = new Date(this.getUnixSeconds() * 1000);
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