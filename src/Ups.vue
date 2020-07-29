<style lang="css" src="./Ups.css"></style>

<script>
	import Model from "./model/Model";
	import TestModel from "./model/TestModel";
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
			locale: {
				default: 'en_US',
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
			model = this.mode == 'test'
				? new TestModel(this.modelOptions)
				: new Model(this.modelOptions)
			;
			return model.getData();
		},
		methods: {},
	};
</script>

<template>

	<div class="ups" :class="staticClass" title="Питание" >
		<div class="ups-layout">
			<div class="ups-layout__left">

				<div class="ups__status">
					<StatusFlag v-for="(flag, index) in statusFlags" :key="index"
						:title="flag.type"
						:tags="flag.tags"
					/>
				</div>

				<div class="ups__events">
					<Event v-for="(event, index) in events" :key="index" :event="event"/>
				</div>
				
			</div>
			<div class="ups-layout__right ups__indicators">

				<div class="ups__indicator ups__indicator--battery-charge">
					<i class="ups__indicator-icon"></i>
					<div class="ups__indicator-value-group">
						<p class="ups__indicator-value">
							<Decimal :value="state.BatteryCharge"/>
						</p>
						<p class="ups__indicator-value ups__indicator-value--small">
							<Duration :seconds="state.UpsTimeleftSeconds" :showSeconds="false"/>
						</p>
					</div>
				</div>

				<div class="ups__indicator ups__indicator--input-voltage">
					<i class="ups__indicator-icon"></i>
					<p class="ups__indicator-value">
						<Decimal :value="state.InputVoltage"/>
					</p>
				</div>

				<div class="ups__indicator ups__indicator--output-load">
					<i class="ups__indicator-icon"></i>
					<p class="ups__indicator-value">
						<Decimal :value="state.OutputLoad"/>
					</p>
				</div>

				<div class="ups__indicator ups__indicator--temp">
					<i class="ups__indicator-icon"></i>
					<p class="ups__indicator-value">
						<Decimal :value="state.UpsTempInternal"/>
					</p>
				</div>

			</div>
		</div>
	</div>

</template>