<script>
    export default {
        name: "Timestamp",
        data: () => ({}),
        props: {
            value: 0,
        },
        methods: {
            getText: function() {
                let d = new Date(this.value);
				if (isNaN(d.valueOf()) || d.getTime() < 7 * 24 * 3600 * 1000) {
					return "—";
				}
				let hh = ('00' + d.getHours()).slice(-2);
				let mm = ('00' + d.getMinutes()).slice(-2);
				let ss = ('00' + d.getSeconds()).slice(-2);
				const months = {
					0: "янв",
					1: "фев",
					2: "мар",
					3: "апр",
					4: "май",
					5: "июн",
					6: "июл",
					7: "авг",
					8: "сен",
					9: "окт",
					10: "ноя",
					11: "дек",
				};
                return `${d.getDate()} ${months[d.getMonth()]} ${hh}:${mm}`;
            }
        },
    };
</script>

<template>
    <span>{{ getText() }}</span>
</template>