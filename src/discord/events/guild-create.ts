import { Client, Guild } from "discord.js";

export default {
  name: "guildCreate",
  once: false,
  execute(guild: Guild, client: Client) {
    console.log(`Joined new guild: ${guild.name} (ID: ${guild.id})`);
  },
};
