import {deployCommands} from "../commands/deploy-commands";
import {Guild} from "discord.js";

export async function onGuildCreate(guild: Guild) {
    console.log(`Joined guild: ${guild.name}`);
    await deployCommands({ guildId: guild.id });
}