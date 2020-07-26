<style lang="css" src="./ups.css"></style>
<script lang="javascript" src="./ups.js"></script>

<template>

	<div class="ups" :class="staticClass" title="Питание" >
		<div class="ups-layout">
			<div class="ups-layout__left">

				<div class="ups__status">
					<!--
					<span class="ups__status-flag">N/A</span>
					-->
				</div>

				<div class="ups__events">
					<event v-for="(event, index) in events" :key="index" :event="event"/>
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