<script>
    import DurationComponent from "./Duration.vue";
    import TimeComponent from "./Time.vue";

    const eventMap = {
		"commlost": "Нет сигнала",
		"commlost_end": "Сигнал ОК",
		"onbatt": "-> Батарея",
		"onbatt_end": "<- Батарея",
		"offline": "Нет сети",
		"online": "В сети",
		"line_ok": "Сеть ОК",
		"trim": "Высок напр",
		"boost": "Низк напр",
		"overload": "Перегрузка",
		"overload_end": "Нагрузка ОК",
		"nobatt": "Нет батареи",
		"nobatt_end": "Батарея ОК",
		"turned_on": "Включен",
		"turned_off": "Выключен",
	};
	
	const signalMap = {
		'powerout': 'Сбой в сети',
		'mainsback': 'В сети',
		'startselftest': 'Тест',
		'endselftest': 'Тест пройден',
    };

    const onbattReasonMap = {
		'1': '—',
		'2': 'Самодиагностика',
		'3': 'Команда от ПО',
		'4': 'Низкое напр.',
		'5': 'Высокое напр.',
		'6': 'Напряжение',
		'7': 'Скачки напряжения',
		'8': 'Частота',
		'9': 'Неизвестно',
	};
    
    export default {
        name: "Event",
        components: {
            "DurationComponent": DurationComponent,
            "TimeComponent": TimeComponent,
        },
        data: () => ({}),
        props: {
            event: {
                Ts: 0,
                Type: "",
                Data: {},
            },
        },
        methods: {
            isSignal: function() {
                return this.event.Type == "signal";
            },
            getEventText: function() {
                let event = this.event;
                return event.Type in eventMap ? eventMap[event.Type] : event.Type;
            },
            getSignalText: function() {
                let data = this.event.Data || {};
                return data.signal in signalMap ? signalMap[data.signal] : data.signal;
            },
            getOnbattReason: function() {
                let data = this.event.Data || {};
                let reason = data.reason_type;
                reason = reason in onbattReasonMap ? onbattReasonMap[reason] : reason;
                return ('' + reason).toLocaleLowerCase();
            },
            getOnbattEndDuration: function() {
                let data = this.event.Data || {};
                const toUnixSeconds = (ts) => {
                    if (typeof ts == "string") {
                        let d = new Date(ts);
                        return 0.001 * d.getTime();
                    }
                    return Number(ts);
                };
                let ts_start = toUnixSeconds(data.ts_start);
                let ts_end = toUnixSeconds(data.ts_end);
                let seconds = data.seconds ? data.seconds : ts_end - ts_start;
                return seconds;
            },
        },
    };
</script>

<template>
    
    <div class="ups__event">
        <TimeComponent class="ups__event-date" :ts="event.Ts"/>

        <div v-if="isSignal()" class="ups__event-content">

            <span>{{ getSignalText() }}</span>

        </div>
        <div v-else class="ups__event-content">

            <span>{{ getEventText() }}</span>

            <em v-if="event.Type == 'onbatt'">
                {{ getOnbattReason() }}
            </em>
            <em v-else-if="event.Type == 'onbatt_end'">
                <DurationComponent :seconds="getOnbattEndDuration()"/>
            </em>

        </div>
    </div>

</template>