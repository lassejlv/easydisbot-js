require("dotenv").config();
const { DiscordBot } = require("easydisbot.js");

const bot = new DiscordBot(process.env.TOKEN);

bot.on("READY", (client) => {
  console.log(
    `Logged in as ${client.user.username}#${client.user.discriminator}!`
  );
});

bot.on("MESSAGE_CREATE", async (message) => {
  // Extract the channel ID and message content from the message object
  const { channel_id, content } = message;

  console.log(`Message received in ${channel_id}: ${content}`);
});

bot.connect();
