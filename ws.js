window.moduleWs = window.moduleWs || (function() {
	const module = {};

	module.listenWebsocket = function(opts) {
		opts = Object.assign({
			uri: '',
			reconnect: false,
			onConnect: null,
			onDiconnect: null,
			onData: null,
		}, opts);
		
		var ws = null;
		var isConnected = false;
		var isConnecting = false;
		
		var onOpen = function(e) {
			isConnected = true;
			isConnecting = false;
			if (opts.onConnect) {
				opts.onConnect(ws);
			}
		};
	
		var onMessage = function(e) {
			isConnected = true;
			if (opts.onData) {
				opts.onData(e.data);
			}
		};
	
		var onClose = function(e) {
			disconnectWs();
		};
	
		var onError = function(error) {
			disconnectWs();
		};
		
		var connectWs = function() {
			if (!isConnecting) {
				isConnecting = true;
				ws = new WebSocket(opts.uri);
				ws.onopen = onOpen;
				ws.onmessage = onMessage;
				ws.onclose = onClose;
				ws.onerror = onError;
			}
		};
		
		var disconnectWs = function() {
			isConnected = false;
			isConnecting = false;
			
			ws.onopen = null;
			ws.onmessage = null;
			ws.onclose = null;
			ws.onerror = null;
			ws = null;
			
			if (opts.reconnect) {
				setTimeout(function() {
					connectWs();
				}, opts.reconnectInterval);
			}
			if (opts.onDiconnect) {
				opts.onDiconnect();
			}
		};
		
		connectWs();
	};

	return module;
})();