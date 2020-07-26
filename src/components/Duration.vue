<script>
    export default {
        name: "Duration",
        data: () => ({}),
        props: {
            seconds: 0,
        },
        methods: {
            getText: function() {
                let d = new Date(this.seconds * 1000);

                console.log("this.seconds", this.seconds);
                console.log("d", d);
                
                if (isNaN(d.valueOf())) {
					return "—";
				}
				let h = d.getUTCHours();
				let m = d.getUTCMinutes();
				let s = d.getUTCSeconds();
				let parts = [];
				if (h > 0) {
					parts.push(h + ' ч');
				}
				if (m > 0 || s == 0) {
					parts.push(('00' + m).slice(-2) + ' мин');
				}
				if (s > 0) {
					parts.push(('00' + s).slice(-2) + ' сек');
				}
				return parts.join(' ');
            }
        },
    };
</script>

<template>
    <span>{{ getText() }}</span>
</template>