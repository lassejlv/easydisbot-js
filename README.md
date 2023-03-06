# easydisbot.js

Simple and flexible discord bot framework for node.js

### Install

```bash
npm install easy-discord-bot.js
```

### Example

```js
const { DiscordBot } = require("easy-disbot.js");

const bot = new DiscordBot(process.env.TOKEN);

bot.on("READY", (client) => {
  console.log(
    `Logged in as ${client.user.username}#${client.user.discriminator}!`
  );
});

bot.on("MESSAGE_CREATE", async (message) => {
  // Extract the channel ID and message content from the message object
  const { guild_id, channel_id } = message;

  // Reply to the message with the same content
  await bot.sendMessage(guild_id, channel_id, "Hello World!");

  // Send Embed
  // Import the EmbedBuilder class from the easydisbot.js
  const { EmbedBuilder } = require("easydisbot.js");

  const embed = new EmbedBuilder()
    .setTitle("Hello World!")
    .setDescription("This is a description");

  await bot.sendMessage(guild_id, channel_id, embed.build());

  // Delete the message (only works if the bot has the MANAGE_MESSAGES permission)
  // We recommed to put it in a try catch, because there is a chance that the bot throws an error
  try {
    await bot.deleteMessage(guild_id, channel_id, message.id);
  } catch (error) {
    console.log(error);
  }
});

bot.connect();
```
