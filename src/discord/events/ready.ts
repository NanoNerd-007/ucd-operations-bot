import { Events } from "discord.js";
import type { Client } from "discord.js";

export default {
  name: Events.ClientReady,
  once: true,
  async execute(client: Client) {
    console.log(`Logged in as ${client.user?.tag}`);

    // Use the correct env variable names
    const GUILD_ID = process.env.DISCORD_GUILD_ID!;
    const CHANNEL_ID = process.env.DISCORD_CHANNEL_ID!;

    try {
      // Fetch the guild instead of relying on cache
      const guild = await client.guilds.fetch(GUILD_ID);

      if (!guild) {
        console.error("❌ Guild not found. Check Server ID and bot membership.");
        return;
      }

      // Fetch the channel as well
      const channel = await guild.channels.fetch(CHANNEL_ID);

      if (!channel) {
        console.error("❌ Channel not found. Check Channel ID.");
        return;
      }

      console.log(`✅ Connected to guild: ${guild.name}`);
      console.log(`✅ Channel found: ${channel.id}`);
    } catch (err) {
      console.error("❌ Error fetching guild or channel:", err);
    }
  },
};
