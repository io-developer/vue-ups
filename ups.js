window.moduleUps = window.moduleUps || (function() {
	const module = {};
	
	const defaultOpts = {
		jQuery: window.jQuery,
		moduleWs: window.moduleWs,
		locale: 'ru',

		websocketUri: 'ws://localhost:8001/ws',
		websocketReconnect: true,
		websocketReconnectInterval: 10000,
		
		reInitInterval: 60000,
		eventLimit: 7,

		flagSignals: {
			'powerout': 1,
			'startselftest': 1,
		},

		eventSignals: {
			'powerout': 1,
			'startselftest': 1,
			'endselftest': 1,
		},

		selectors: {
			
		},

		cssClasses: {
			container: 'ups',
			containerUpsDiconnected: 'ups--disconnected',
		},

		flagOptions: {
			comlost: {
				title: "Нет сигнала",
				tags: ["comlost", "alert"],
			},
			online: {
				title: "Сеть",
				tags: ["online"],
				containerTags: ["online"],
			},
			onbatt: {
				title: "На батарее",
				tags: ["onbatt", "warn"],
				containerTags: ["onbatt", "alert"],
			},
			off: {
				title: "Выключен",
				tags: ["off", "warn"],
			},
			calibration: {
				title: "Калибровка",
				tags: ["calibration"],
			},
			trim: {
				title: "Повышенное напр.",
				tags: ["trim", "warn"],
			},
			boost: {
				title: "Пониженное напр.",
				tags: ["boost", "warn"],
			},
			overload: {
				title: "Перегрузка",
				tags: ["overload", "alert"],
			},
			battlow: {
				title: "Низкий заряд",
				tags: ["battlow", "lowbatt", "alert"],
			},
			replacebatt: {
				title: "Замените батарею",
				tags: ["replacebatt", "warn"],
			},
			nobatt: {
				title: "Батарея отключена",
				tags: ["nobatt", "alert"],
			},
			shutdown: {
				title: "Отключение…",
				tags: ["shutdown", "alert"],
			},
		},

		render: {
			event: (ts, text) => {
				let now = new Date();
				let d = new Date(ts);
				let deltaSec = 0.001 * (now.getTime() - d.getTime());
				let extraClass = '';
				if (deltaSec < 3600) {
					extraClass = 'ups__event--new';
				} else if (deltaSec > 24 * 3600) {
					extraClass = 'ups__event--old';
				}
				return `
					<div class="ups__event ${extraClass}">
						<span class="ups__event-date">${defaultOpts.render.unixtime(ts)}</span>
						<div class="ups__event-content">${text.replace("\n", "<br/>")}</div>
					</div>
				`;
			},
			statusFlag: (title, tags = []) => {
				let cl = (tags || []).map(tag => "ups__status-flag--" + tag).join(" ");
				return `<span class="ups__status-flag ${cl}">${title}</span>`;
			},
			decimal: (num) => {
				let s = (10 * num).toFixed(0);
				if (s == "0") {
					return s;
				}
				let intPart = s.slice(0, -1);
				let decimalPart = s.slice(-1);
				if (decimalPart == "0") {
					return intPart;
				}
				return intPart + "<small>" + "." + decimalPart + "</small>";
			},
			seconds: (sec) => {
				let d = new Date(sec * 1000);
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
			},
			unixtime: (ts) => {
				let d = new Date(ts);
				if (d.getTime() < 7 * 24 * 3600 * 1000) {
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
				//return `${d.getDate()} ${months[d.getMonth()]} ${hh}:${mm}:${ss}`;
			},
		},
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

	const flagSignals = {
		'powerout': 1,
		'startselftest': 1,
	};

	const eventSignals = {
		'powerout': 1,
		'startselftest': 1,
		'endselftest': 1,
	};

	const flagCalibration = 0x00000001;
	const flagTrim = 0x00000002;
	const flagBoost = 0x00000004;
	const flagOnline = 0x00000008;
	const flagOnbatt = 0x00000010;
	const flagOverload = 0x00000020;
	const flagBattlow = 0x00000040;
	const flagReplacebatt = 0x00000080;

	// Extended bit values added by apcupsd
	const flagCommlost = 0x00000100; // Communications with UPS lost
	const flagPlugged = 0x01000000; // Set if computer is plugged into UPS
	const flagBattpresent = 0x04000000; // Indicates if battery is connected

	const flagShutdown = 0x00000200;


	function extendOptsWith(customOpts) {
		var opts = Object.assign({}, defaultOpts, customOpts);
		opts.render = Object.assign({}, defaultOpts.render, customOpts.render || {});
		return opts;
	};
	
	
	module.initWidget = function(elem, customOpts) {
		const widget = {};

		var opts = defaultOpts; // hack: VSCode props hinting
		opts = extendOptsWith(customOpts);
		
		const $ = opts.jQuery;
		const $cont = $(elem);
		const render = opts.render;

		var currentWs = null;
		var actualEvents = [];

		widget.initWebsocket = function() {
			if (currentWs) {
				currentWs.close();
			}
			opts.moduleWs.listenWebsocket({
				uri: opts.websocketUri,
				reconnect: opts.websocketReconnect,
				reconnectInterval: opts.websocketReconnectInterval,
				onConnect: function(ws) {
					console.log('onConnect', ws);

					currentWs = ws;
					$cont.removeClass(opts.cssClasses.containerUpsDiconnected);
				},
				onDiconnect: function() {
					console.log('onDiconnect');

					currentWs = null;
					widget.handleSignal("disconnect");
				},
				onData: function(jsonStr) {
					console.log("onData", jsonStr);

					let data = JSON.parse(jsonStr) || {};
					let state = {};
					let events = [];

					switch (data.type) {
						case 'init': 
							state = data.model_state || {};
							events = data.model_events || [];
							widget.updateState(state);
							widget.updateEvents(events, true);
							break;

						case 'change': 
							let diff = data.model_state_diff || {};
							for (k in diff) {
								state[k] = diff[k][1];
							}
							events = data.model_events_new || [];
							widget.updateState(state);
							widget.updateEvents(events);
							break;
						
						case 'signal': 
							widget.handleSignal(data.signal);
							widget.updateEvents([], false, false);
							break;
						
						default: break;
					}
				},
			});

			setInterval(function() {
				if (currentWs) {
					currentWs.send("init");
				}
			}, opts.reInitInterval);
		}

		widget.updateState = function(state) {
			console.log('updateState', state);
			
			if (state.UpsStatus) {
				if (state.UpsStatus.Flag != null) {
					widget.updateStatus(state.UpsStatus.Flag);
				}
			}
			if (state.BatteryCharge != null) {
				$cont.find('.js-ups-battery-charge').text(render.decimal(state.BatteryCharge));
			}
			if (state.UpsTimeleftSeconds != null) {
				$cont.find('.js-ups-battery-timeleft').text(render.seconds(state.UpsTimeleftSeconds));
			}
			if (state.InputVoltage != null) {
				$cont.find('.js-ups-input-voltage').html(render.decimal(state.InputVoltage));
			}
			if (state.InputVoltageMin != null) {
				$cont.find('.js-ups-input-voltage-min').html(Math.round(state.InputVoltageMin));
			}
			if (state.InputVoltageMax != null) {
				$cont.find('.js-ups-input-voltage-max').html(Math.round(state.InputVoltageMax));
			}
			if (state.OutputVoltage != null) {
				$cont.find('.js-ups-output-voltage').html(render.decimal(state.OutputVoltage));
			}
			if (state.OutputLoad != null) {
				$cont.find('.js-ups-output-load').html(render.decimal(state.OutputLoad));
			}
			if (state.UpsTempInternal != null) {
				$cont.find('.js-ups-temp').html(render.decimal(state.UpsTempInternal));
			}
			if (state.UpsTransferOnBatteryDate) {
				$cont.find('.js-ups-onbattery-date').text(render.unixtime(state.UpsTransferOnBatteryDate));
			}
			if (state.UpsTransferOnBatteryReason) {
				$cont.find('.js-ups-onbattery-reason').text(
					onbattReasonMap[state.UpsTransferOnBatteryReason.Type] || state.UpsTransferOnBatteryReason.Text
				);
			}
			if (state.UpsOnBatterySeconds != null) {
				if (state.UpsOnBatterySeconds > 0) {
					$cont.find('.js-ups-onbattery-time').text(render.seconds(state.UpsOnBatterySeconds));
				} else {
					$cont.find('.js-ups-onbattery-time').text("—");
				}
			}
		};
	
		widget.updateStatus = function(flags) {			
			let flagOptions = opts.flagOptions;
			let $flags = $cont.find('.ups__status');
			$flags.empty();

			const contTagToClass = tag => opts.cssClasses.container + "--" + tag;

			const appendFlags = (flags) => {
				flags.filter(([flag, ok]) => !!ok).forEach(([flag, ok]) => {
					let flagOpt = flag in flagOptions ? flagOptions[flag] : {};
					$flags.append(render.statusFlag(flagOpt.title || flag, flagOpt.tags));

					if (flagOpt.containerTags) {
						flagOpt.containerTags.filter(contTag => !!contTag).forEach(contTag => {
							$cont.addClass(contTagToClass(contTag));
						});
					}
				});
			};

			// remove old flag tags from container
			for (flag in flagOptions) {
				let flagOpt = flagOptions[flag];
				let contTags = flagOpt.containerTags || [];
				contTags.forEach(contTag => {
					$cont.removeClass(contTagToClass(contTag));
				});
			}

			if (flags & flagCommlost) {
				appendFlags([ ["comlost", true] ]);
				return;
			}

			appendFlags([
				["online", flags & flagOnline],
				["onbatt", flags & flagOnbatt],
				["off", (flags & flagPlugged) && (flags & flagOnline) == 0 && (flags & flagOnbatt) == 0],
				["calibration", flags & flagCalibration],
				["trim", flags & flagTrim],
				["boost", flags & flagBoost],
				["overload", flags & flagOverload],
				["battlow", flags & flagBattlow],
				["replacebatt", flags & flagReplacebatt],
				["nobatt", (flags & flagBattpresent) == 0],
				["shutdown", flags & flagShutdown],
			]);
		};
		
		widget.updateEvents = function(events = [], resetEvents = false, forceUpdate = false) {
			console.log('Events', events);
	
			if (events.length == 0 && !resetEvents && !forceUpdate) {
				if (Math.random() > 0.1) {
					return;
				}
			}
	
			const $events = $cont.find('.ups__events');
			$events.empty();
	
			actualEvents = resetEvents ? [] : actualEvents;
			actualEvents = actualEvents.concat(events).filter(event => {
				if (event.Type == "signal") {
					let data = event.Data || {};
					return data.signal in eventSignals;
				}
				return true;
			}).slice(-opts.eventLimit);
	
			actualEvents.forEach(event => {
				let text = event.Type in eventMap ? eventMap[event.Type] : event.Type;
				let data = event.Data || {};
	
				switch (event.Type) {
					case "signal":
						text = data.signal in signalMap ? signalMap[data.signal] : data.signal;
						break;
	
					case "onbatt":
						let reason = data.reason_type;
						reason = reason in onbattReasonMap ? onbattReasonMap[reason] : reason;
						text += (': ' + reason).toLocaleLowerCase();
						break;
	
					case "onbatt_end":
						let ts_start = data.ts_start;
						let ts_end = data.ts_end;
						let seconds = data.seconds ? data.seconds : ts_end - ts_start;
						text += ': ' + render.seconds(seconds);
						break;
	
					default:
						break;
				}
	
				$events.append(render.event(event.Ts, text));
			});
		};

		widget.handleSignal = function(type) {
			console.log('handleSignal', type);
	
			let $flags = $cont.find('.ups__status');
		
			switch (type) {
				case 'disconnect':
					if (!$cont.hasClass(opts.cssClasses.containerUpsDiconnected)) {
						$cont.addClass(opts.cssClasses.containerUpsDiconnected);
						$flags.append(render.statusFlag("Подключение…", ["warn"]));
					}
					break;
	
				case 'powerout':
				case 'onbattery':
					$cont.addClass("ups--alert");
					break;
			}
	
			if (type in flagSignals) {
				$flags.append(render.statusFlag(signalMap[type], ["warn"]));
			}
		};

		widget.initWebsocket();

		return widget;
	};

	return module;
})();
