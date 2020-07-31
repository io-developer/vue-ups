export default class Connection {
	constructor(options) {
		this.opts = Object.assign({
			uri: 'ws://',
			reconnect: false,
			reconnectInterval: 3600 * 1000,
		}, options);

		this.onOpen = null;
		this.onMessage = null;
		this.onData = null;
		this.onError = null;
		this.onClose = null;
		this.onDiconnect = null;

		/** @type {WebSocket} */
		this.ws = null;
		this.isConnected = false;
		this.isConnecting = false;
		this.isClosed = true;
	}

	connect() {
		this.isClosed = false;
		if (!this.isConnecting) {
			this.isConnecting = true;
			this.ws = new WebSocket(this.opts.uri);
			this.ws.onopen = this.wsOnOpen.bind(this);
			this.ws.onmessage = this.wsOnMessage.bind(this);
			this.ws.onerror = this.wsOnError.bind(this);
			this.ws.onclose = this.wsOnClose.bind(this);
		}
	}

	close() {
		this.isClosed = true;
		this.ws.close();
	}

	send(msg) {
		if (this.ws) {
			this.ws.send(msg);
		}
	}

	wsOnOpen(e) {
		this.isConnected = true;
		this.isConnecting = false;
		if (this.onOpen) {
			this.onOpen(e);
		}
	}

	wsOnMessage(e) {
		this.isConnected = true;
		if (this.onMessage) {
			this.onMessage(e);
		}
		if (this.onData && e.data) {
			let data = JSON.parse(e.data) || null;
			if (data != null) {
				this.onData(data);
			}
		}
	}

	wsOnError(e) {
		if (this.onError) {
			this.onError(e);
		}
		this.wsOnDisconnect();
	}

	wsOnClose(e) {
		if (this.onClose) {
			this.onClose(e);
		}
		this.wsOnDisconnect();
	}

	wsOnDisconnect() {
		this.isConnected = false;
		this.isConnecting = false;
		
		this.ws.onopen = null;
		this.ws.onmessage = null;
		this.ws.onclose = null;
		this.ws.onerror = null;
		this.ws = null;
		
		if (!this.isClosed && this.opts.reconnect) {
			setTimeout(this.connect.bind(this), this.opts.reconnectInterval);
		}

		if (this.onDiconnect) {
			this.onDiconnect();
		}
	}
}