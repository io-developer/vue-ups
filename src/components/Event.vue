<script>
    import DurationComponent from "./Duration";
    import TimestampComponent from "./Timestamp";

    import EventType from '../model/schema/EventType';
    import SignalType from '../model/schema/SignalType';

    const eventMap = {
		[EventType.COMMLOST]: "Нет сигнала",
		[EventType.COMMLOST_END]: "Сигнал ОК",
		[EventType.ONBATT]: "-> Батарея",
		[EventType.ONBATT_END]: "<- Батарея",
		[EventType.OFFLINE]: "Нет сети",
		[EventType.ONLINE]: "В сети",
		[EventType.LINE_OK]: "Сеть ОК",
		[EventType.TRIM]: "Высок напр",
		[EventType.BOOST]: "Низк напр",
		[EventType.OVERLOAD]: "Перегрузка",
		[EventType.OVERLOAD_END]: "Нагрузка ОК",
		[EventType.NOBATT]: "Нет батареи",
		[EventType.NOBATT_END]: "Батарея ОК",
		[EventType.TURNED_ON]: "Включен",
		[EventType.TURNED_OFF]: "Выключен",
	};
	
	const signalMap = {
		[SignalType.POWEROUT]: 'Сбой в сети',
		[SignalType.MAINSBACK]: 'В сети',
		[SignalType.STARTSELFTEST]: 'Тест',
		[SignalType.ENDSELFTEST]: 'Тест пройден',
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
            "Duration": DurationComponent,
            "Timestamp": TimestampComponent,
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
                return this.event.Type == EventType.SIGNAL;
            },
            isOnbatt: function() {
                return this.event.Type == EventType.ONBATT;
            },
            isOnbattEnd: function() {
                return this.event.Type == EventType.ONBATT_END;
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
        <Timestamp class="ups__event-date" :ts="event.Ts"/>

        <div v-if="isSignal()" class="ups__event-content">

            <span>{{ getSignalText() }}</span>

        </div>
        <div v-else class="ups__event-content">

            <span>{{ getEventText() }}</span>

            <em v-if="isOnbatt()">
                {{ getOnbattReason() }}
            </em>
            <em v-else-if="isOnbattEnd()">
                <Duration :seconds="getOnbattEndDuration()"/>
            </em>

        </div>
    </div>

</template>