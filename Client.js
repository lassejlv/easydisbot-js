const WebSocket = require("ws");

class DiscordBot {
  constructor(token) {
    this.token = token;
    this.websocket = null;
    this.listeners = {};
  }

  on(event, listener) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }

    this.listeners[event].push(listener);
  }

  emit(event, ...args) {
    if (this.listeners[event]) {
      this.listeners[event].forEach((listener) => {
        listener(...args);
      });
    }
  }

  connect() {
    this.websocket = new WebSocket(
      "wss://gateway.discord.gg/?v=9&encoding=json"
    );

    this.websocket.on("open", () => {
      console.log("WebSocket connection established");

      this.websocket.send(
        JSON.stringify({
          op: 2,
          d: {
            token: this.token,
            intents: 513,
            properties: {
              $os: "linux",
              $browser: "node.js",
              $device: "node.js",
            },
          },
        })
      );
    });

    this.websocket.on("message", (message) => {
      const data = JSON.parse(message);

      switch (data.op) {
        case 0:
          this.emit(data.t, data.d);
          break;
        case 10:
          const { heartbeat_interval } = data.d;
          setInterval(() => {
            this.websocket.send(
              JSON.stringify({
                op: 1,
                d: null,
              })
            );
          }, heartbeat_interval);
          break;
        default:
          console.log("Unhandled operation:", data.op);
      }
    });

    this.websocket.on("close", (code, reason) => {
      console.log(`WebSocket connection closed: ${code} ${reason}`);
      // Reconnect in 5 seconds
      setTimeout(() => this.connect(), 5000);
    });

    this.websocket.on("error", (error) => {
      console.error("WebSocket error:", error);
      // Reconnect in 5 seconds
      setTimeout(() => this.connect(), 5000);
    });
  }

  // Reply to a message
  replyToMessage(channelId, content) {
    this.websocket.send(
      JSON.stringify({
        op: 0,
        d: {
          type: 1,
          data: {
            content,
            tts: false,
          },
          channel_id: channelId,
        },
      })
    );
  }
}

module.exports = {
  DiscordBot,
};
