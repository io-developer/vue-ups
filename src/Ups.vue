<style lang="css" src="./Ups.css"></style>

<script>
	import Model from "./model/Model";
	import ModelDemo from "./model/ModelDemo";
	import StatusFlag from "./model/StatusFlag";
	import EventComponent from "./components/Event";
	import StatusFlagComponent from "./components/StatusFlag";
	import DecimalComponent from "./components/Decimal";
	import DurationComponent from "./components/Duration";
	import TimestampComponent from "./components/Timestamp";

	let model = null;

	export default {
		name: "Ups",
		components: {
			'Event': EventComponent,
			'StatusFlag': StatusFlagComponent,
			'Decimal': DecimalComponent,
			'Duration': DurationComponent,
			'Timestamp': TimestampComponent,
		},
		props: {
			staticClass: {
				default: '',
			},
			title: {
				default: '',
			},
			mode: {
				default: null,
			},
			modelOptions: {
				default: {},
			},
		},
		data: function() {
			if (model) {
				model.destroy();
			}
			model = this.mode == 'demo'
				? new ModelDemo(this.modelOptions)
				: new Model(this.modelOptions)
			;
			return model.getData();
		},
		methods: {
			getRootClass: function() {
				let map = {};
				map[this.staticClass] = true;

				for (let k in this.statusFlags) {
					this.statusFlags[k].tags.forEach(tag => {
						map[`ups--status-${tag}`] = true;
					});
				}
				
				return map;
			},
		},
	};
</script>

<template>

	<div class="ups" :class="getRootClass()" :title="title" >
		<div class="ups-layout">
			<div class="ups-layout__left">

				<div class="ups__status">
					<StatusFlag v-for="(flag, index) in statusFlags.filter(flag => !flag.hidden)" :key="index"
						:type="flag.type"
						:tags="flag.tags"
					/>
				</div>

				<div class="ups__events">
					<Event v-for="(event, index) in events" :key="index"
						:timestamp="event.Ts"
						:type="event.Type"
						:data="event.Data"
					/>
				</div>
				
			</div>
			<div class="ups-layout__right ups__indicators">

				<div class="ups__indicator ups__indicator--battery-charge">
					<i class="ups__indicator-icon"></i>
					<div class="ups__indicator-value-group">
						<p class="ups__indicator-value">
							<Decimal
								:value="state.BatteryCharge"
							/><span class="ups__indicator-value-unit">%</span>
						</p>
						<p class="ups__indicator-value ups__indicator-value--small">
							<Duration :seconds="state.UpsTimeleftSeconds" :showSeconds="false"/>
						</p>
					</div>
				</div>

				<div class="ups__indicator ups__indicator--input-voltage">
					<i class="ups__indicator-icon"></i>
					<p class="ups__indicator-value">
						<Decimal
							:value="state.InputVoltage"
						/><span class="ups__indicator-value-unit">{{ $t(`Ups.Unit.Volt`) }}</span>
					</p>
				</div>

				<div class="ups__indicator ups__indicator--output-load">
					<i class="ups__indicator-icon"></i>
					<p class="ups__indicator-value">
						<Decimal
							:value="state.OutputLoad"
						/><span class="ups__indicator-value-unit">%</span>
					</p>
				</div>

				<div class="ups__indicator ups__indicator--temp">
					<i class="ups__indicator-icon"></i>
					<p class="ups__indicator-value">
						<Decimal
							:value="state.UpsTempInternal"
						/><span class="ups__indicator-value-unit">{{ $t(`Ups.Unit.Celsius`) }}</span>
					</p>
				</div>

			</div>
		</div>
	</div>

</template>