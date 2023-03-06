const WebSocket = require("ws");
const { EmbedBuilder } = require("./EmbedBuilder.js");

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

      // reply
      if (data.t === "MESSAGE_CREATE") {
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
  async sendEmbed(guildId, channelId, embedData) {
    //
    const response = await fetch(
      `https://discord.com/api/v9/channels/${channelId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bot ${this.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          embed: embedData,
        }),
      }
    );

    const data = await response.json();

    return data;
  }

  async sendMessage(guildId, channelId, message) {
    const response = await fetch(
      `https://discord.com/api/v9/channels/${channelId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bot ${this.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: message,
        }),
      }
    );

    const data = await response.json();

    return data;
  }

  // Delete a Message
  async deleteMessage(guildId, channelId, messageId) {
    const response = await fetch(
      `https://discord.com/api/v9/channels/${channelId}/messages/${messageId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bot ${this.token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    return data;
  }
}

module.exports = {
  DiscordBot,
  EmbedBuilder,
};
