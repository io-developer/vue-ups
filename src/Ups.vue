<style lang="css" src="./Ups.css"></style>

<script>
	import Model from "./model/Model";
	import TestModel from "./model/TestModel";
	import EventComponent from "./components/Event";
	import StatusFlagComponent from "./components/StatusFlag";

	let model = null;

	export default {
		name: "Ups",
		components: {
			'Event': EventComponent,
			'StatusFlag': StatusFlagComponent,
		},
		props: {
			staticClass: {
				default: '',
			},
			mode: {
				default: null,
			},
			websocketUri: {
				default: 'ws://localhost:8001/ws',
			},
			websocketReconnect: {
				default: true,
			},
			websocketReconnectInterval: {
				default: 10000,
			},
			reinitInterval: {
				default: 60000,
			},
			eventLimit: {
				default: 7,
			},
			locale: {
				default: 'en_US',
			},
		},
		data: function() {
			if (model) {
				model.destroy();
			}
			model = this.mode == 'test' ? new TestModel() : new WsModel(this);
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
					<StatusFlag v-for="(flag, index) in statusFlags" :key="index" :flag="flag"/>
				</div>

				<div class="ups__events">
					<Event v-for="(event, index) in events" :key="index" :event="event"/>
				</div>
				
			</div>
			<div class="ups-layout__right ups__indicators">

				<div class="ups__indicator ups__indicator--battery-charge">
					<i class="ups__indicator-icon"></i>
					<div class="ups__indicator-value-group">
						<p class="ups__indicator-value js-ups-battery-charge">N/A</p>
						<p class="ups__indicator-value ups__indicator-value--small js-ups-battery-timeleft"
						>N/A</p>
					</div>
				</div>

				<div class="ups__indicator ups__indicator--input-voltage">
					<i class="ups__indicator-icon"></i>
					<p class="ups__indicator-value js-ups-input-voltage">N/A</p>
				</div>

				<div class="ups__indicator ups__indicator--output-load">
					<i class="ups__indicator-icon"></i>
					<p class="ups__indicator-value js-ups-output-load">N/A</p>
				</div>

				<div class="ups__indicator ups__indicator--temp">
					<i class="ups__indicator-icon"></i>
					<p class="ups__indicator-value js-ups-temp">N/A</p>
				</div>

			</div>
		</div>
	</div>

</template>