import { Client, Message } from "discord.js";

export default {
  name: "messageCreate",
  once: false,
  execute(message: Message, client: Client) {
    if (message.author.bot) return; // ignore bots

    console.log(`Message received in ${message.guild?.name}: ${message.content}`);

    // Example: simple bot response
    if (message.content.toLowerCase() === "ping") {
      message.channel.send("Pong!");
    }
  },
};
