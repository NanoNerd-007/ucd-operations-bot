import { Client, GatewayIntentBits } from "discord.js";
import fs from "fs";
import path from "path";
import "dotenv/config";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
  ],
});

// ===== EVENT LOADER =====
const eventsPath = path.join(__dirname, "discord", "events");
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith(".ts"));

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath).default;

  if (!event?.name || !event?.execute) {
    console.error(`❌ Event file ${file} is missing name or execute`);
    continue;
  }

  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

// ===== LOGIN =====
client.login(process.env.DISCORD_TOKEN);
