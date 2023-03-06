require("dotenv").config();
const { DiscordBot, EmbedBuilder } = require("./Client.js");

const bot = new DiscordBot(process.env.TOKEN);

bot.on("READY", (client) => {
  console.log(
    `Logged in as ${client.user.username}#${client.user.discriminator}!`
  );
});

bot.on("MESSAGE_CREATE", async (message) => {
  // Extract the channel ID and message content from the message object
  const embed = new EmbedBuilder()
    .setTitle()
    .setAuthor(message.author.username + "here is your embed")
    .setDescription(message.content)
    .setThumbnail(
      `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png?size=128`
    )
    .setColor(0x00ff00)
    .setURL("https://google.com");

  if (message.content === "embed") {
    // Getting the channel ID and guild ID from the message object
    const channelId = message.channel_id;
    const guildId = message.guild_id;

    // Sending the embed with await or bcz it's async
    await bot.sendEmbed(guildId, channelId, embed.build());
  } else if (message.content === "deletemymessage") {
    const guildId = message.guild_id;
    const channelId = message.channel_id;
    const messageId = message.id;

    const deleteMessageEmbed = new EmbedBuilder().setDescription(
      "I deleted your message: **" + message.content + "**"
    );

    await bot.sendEmbed(guildId, channelId, deleteMessageEmbed.build());

    try {
      await bot.deleteMessage(message.guild_id, channelId, messageId);
    } catch (error) {
      return;
    }
  } else if (message.content === "reply") {
    const guildId = message.guild_id;
    const channelId = message.channel_id;
    const messageId = message.id;

    await bot.sendMessage(guildId, channelId, `Hi <@${message.author.id}>!`);
  }
});

bot.connect();
