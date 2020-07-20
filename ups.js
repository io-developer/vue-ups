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
			containerUpsDiconnected: 'ups--disconnected',
		},
	};

	var actualEvents = [];

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
	const flagShut_load = 0x00080000;
	const flagShut_btime = 0x00100000;
	const flagShut_ltime = 0x00200000;
	const flagShut_emerg = 0x00400000;
	
	module.initWidget = function(elem, customOpts) {
		var opts = defaultOpts;
		opts = Object.assign({}, defaultOpts, customOpts);
		
		const $ = opts.jQuery;
		const $cont = $(elem);
		var currentWs = null;

		initWebsocket();

		function initWebsocket() {
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
					handleSignal("disconnect");
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
							updateState(state);
							updateEvents(events, true);
							break;

						case 'change': 
							let diff = data.model_state_diff || {};
							for (k in diff) {
								state[k] = diff[k][1];
							}
							events = data.model_events_new || [];
							updateState(state);
							updateEvents(events);
							break;
						
						case 'signal': 
							handleSignal(data.signal);
							updateEvents([], false, false);
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

		function updateState(state) {
			console.log('updateState', state);
			
			if (state.UpsStatus) {
				if (state.UpsStatus.Flag != null) {
					updateStatusFlags(state.UpsStatus.Flag);
				}
			}
			if (state.BatteryCharge != null) {
				$cont.find('.js-ups-battery-charge').text(state.BatteryCharge);
			}
			if (state.UpsTimeleftSeconds != null) {
				$cont.find('.js-ups-battery-timeleft').text(formatSeconds(state.UpsTimeleftSeconds, false));
			}
			if (state.InputVoltage != null) {
				$cont.find('.js-ups-input-voltage').html(getHtmlDecimal(state.InputVoltage));
			}
			if (state.InputVoltageMin != null) {
				$cont.find('.js-ups-input-voltage-min').html(Math.round(state.InputVoltageMin));
			}
			if (state.InputVoltageMax != null) {
				$cont.find('.js-ups-input-voltage-max').html(Math.round(state.InputVoltageMax));
			}
			if (state.OutputVoltage != null) {
				$cont.find('.js-ups-output-voltage').html(getHtmlDecimal(state.OutputVoltage));
			}
			if (state.OutputLoad != null) {
				$cont.find('.js-ups-output-load').html(getHtmlDecimal(state.OutputLoad));
			}
			if (state.UpsTempInternal != null) {
				$cont.find('.js-ups-temp').html(getHtmlDecimal(state.UpsTempInternal));
			}
			if (state.UpsTransferOnBatteryDate) {
				$cont.find('.js-ups-onbattery-date').text(formatTsHuman(state.UpsTransferOnBatteryDate, false));
			}
			if (state.UpsTransferOnBatteryReason) {
				$cont.find('.js-ups-onbattery-reason').text(
					onbattReasonMap[state.UpsTransferOnBatteryReason.Type] || state.UpsTransferOnBatteryReason.Text
				);
			}
			if (state.UpsOnBatterySeconds != null) {
				if (state.UpsOnBatterySeconds > 0) {
					$cont.find('.js-ups-onbattery-time').text(formatSeconds(state.UpsOnBatterySeconds, true));
				} else {
					$cont.find('.js-ups-onbattery-time').text("—");
				}
			}
		}
	
		function updateEvents(events = [], resetEvents = false, forceUpdate = false) {
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
						text += ': ' + formatSeconds(seconds, true);
						break;
	
					default:
						break;
				}
	
				$events.append(getHtmlevent(event.Ts, text));
			});
		}
	
		function updateStatusFlags(flags) {
			let $flags = $cont.find('.ups__status');
			$flags.empty();
			
			$cont.removeClass("ups--online");
			$cont.removeClass("ups--warn");
			$cont.removeClass("ups--alert");
	
			if (flags & flagCommlost) {
				$flags.append(getHtmlStatusFlag("Нет сигнала", {
					"tags": ["comlost", "alert"],
				}));
				return;
			}
			if (flags & flagOnline) {
				$cont.addClass("ups--online");
				$flags.append(getHtmlStatusFlag("Сеть", {
					"tags": ["online"],
				}));
			}
			if (flags & flagOnbatt) {
				$cont.addClass("ups--alert");
				$flags.append(getHtmlStatusFlag("На батарее", {
					"tags": ["onbatt", "warn"],
				}));
			}
			if ((flags & flagPlugged) && (flags & flagOnline) == 0 && (flags & flagOnbatt) == 0) {
				$flags.append(getHtmlStatusFlag("Выключен", {
					"tags": ["off", "warn"],
				}));
			}
			if (flags & flagCalibration) {
				$flags.append(getHtmlStatusFlag("Калибровка", {
					"tags": ["cal"],
				}));
			}
			if (flags & flagTrim) {
				$flags.append(getHtmlStatusFlag("Высокое напряжение", {
					"tags": ["trim", "warn"],
				}));
			}
			if (flags & flagBoost) {
				$flags.append(getHtmlStatusFlag("Низкое напряжение", {
					"tags": ["boost", "warn"],
				}));
			}
			if (flags & flagOverload) {
				$flags.append(getHtmlStatusFlag("Перегрузка", {
					"tags": ["overload", "alert"],
				}));
			}
			if (flags & flagBattlow) {
				$flags.append(getHtmlStatusFlag("Батарея разряжена", {
					"tags": ["lowbatt", "alert"],
				}));
			}
			if (flags & flagReplacebatt) {
				$flags.append(getHtmlStatusFlag("Замените батарею", {
					"tags": ["replacebatt", "warn"],
				}));
			}
			if ((flags & flagBattpresent) == 0) {
				$flags.append(getHtmlStatusFlag("Батарея отключена", {
					"tags": ["nobatt", "alert"],
				}));
			}
	
			if (flags & flagShutdown) {
				$flags.append(getHtmlStatusFlag("shutdown"));
			}
			if (flags & flagShut_load) {
				$flags.append(getHtmlStatusFlag("shut_load"));
			}
			if (flags & flagShut_btime) {
				$flags.append(getHtmlStatusFlag("shut_btime"));
			}
			if (flags & flagShut_ltime) {
				$flags.append(getHtmlStatusFlag("shut_ltime"));
			}
			if (flags & flagShut_emerg) {
				$flags.append(getHtmlStatusFlag("shut_emerg"));
			}
		}
		
		function handleSignal(type) {
			console.log('handleSignal', type);
	
			let $flags = $cont.find('.ups__status');
		
			switch (type) {
				case 'disconnect':
					if (!$cont.hasClass(opts.cssClasses.containerUpsDiconnected)) {
						$cont.addClass(opts.cssClasses.containerUpsDiconnected);
						$flags.append(getHtmlStatusFlag("Подключение…", {
							"tags": ["warn"],
						}));
					}
					break;
	
				case 'powerout':
				case 'onbattery':
					$cont.addClass("ups--alert");
					break;
			}
	
			if (type in flagSignals) {
				$flags.append(getHtmlStatusFlag(signalMap[type], {
					"tags": ["warn"],
				}));
			}
		}
	};

	function getHtmlevent(ts, text) {
		let extraClass = '';
		let now = new Date();
		let d = new Date(ts);
		let deltaSec = 0.001 * (now.getTime() - d.getTime());
		if (deltaSec < 3600) {
			extraClass += ' ups__event--new';
		} else if (deltaSec > 24 * 3600) {
			extraClass += ' ups__event--old';
		}
		text = text.replace("\n", "<br/>");
		return `
			<div class="ups__event ${extraClass}">
				<span class="ups__event-date">${formatTsHuman(ts, false)}</span>
				<div class="ups__event-content">${text}</div>
			</div>
		`;
	}

	function getHtmlStatusFlag(title, opts = {}) {
		let cl = [""]
			.concat(opts.tags ? opts.tags : [])
			.map(tag => tag ? "ups__status-flag--" + tag : "ups__status-flag")
			.join(" ")
		;
		return ""
			+ "<span class='" + cl + "'>"
			+ 	title
			+ "</span>"
		;	
	}

	function getHtmlDecimal(val) {
		let s = (10 * val).toFixed(0);
		if (s == "0") {
			return s;
		}
		let intPart = s.slice(0, -1);
		let decimalPart = s.slice(-1);
		if (decimalPart == "0") {
			return intPart;
		}
		return intPart + "<small>" + "." + decimalPart + "</small>";
	}
	
	function formatSeconds(sec, seconds = false) {
		let d = new Date(sec * 1000);
		let h = d.getUTCHours();
		let m = d.getUTCMinutes();
		let s = d.getUTCSeconds();
		let parts = [];
		if (h > 0) {
			parts.push(h + ' ч');
		}
		if (m > 0 || !seconds) {
			parts.push(('00' + m).slice(-2) + ' мин');
		}
		if (seconds) {
			parts.push(('00' + s).slice(-2) + ' сек');
		}
		return parts.join(' ');
	}

	function formatTsHuman(ts, seconds = false) {
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
		if (!seconds) {
			return `${d.getDate()} ${months[d.getMonth()]} ${hh}:${mm}`;
		}
		return `${d.getDate()} ${months[d.getMonth()]} ${hh}:${mm}:${ss}`;
	}

	return module;
})();
