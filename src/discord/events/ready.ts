import {deployCommands} from "../commands/deploy-commands";
import {Client} from "discord.js";
import {initializeGoogleSheetsClient} from "@app/google-sheets/initialize-google-sheets-client";
import {processScheduledPayments} from "@app/cron/process-scheduled-payments";
import {remindOutstandingBalance} from "@app/cron/remind-outstanding-balance";
import {config} from "@app/config";

export async function onReady(client: Client) {
    if (!client.user) return;

    try {
        if (!config.DISCORD_GUILD_ID) {
            throw new Error("DISCORD_GUILD_ID is not set in the environment variables");
        }

        if (!config.DISCORD_CHANNEL_ID) {
            throw new Error("DISCORD_CHANNEL_ID is not set in the environment variables");
        }

        const guild = client.guilds.cache.get(config.DISCORD_GUILD_ID);
        const channel = client.channels.cache.get(config.DISCORD_CHANNEL_ID);

        if (!guild) {
            throw new Error(`The guild with the ID ${config.DISCORD_GUILD_ID} could not be found`);
        }

        if (!channel) {
            throw new Error(`The channel with the ID ${config.DISCORD_CHANNEL_ID} could not be found`);
        }

        if (!channel.isTextBased()) {
            throw new Error(`The channel with the ID ${config.DISCORD_CHANNEL_ID} is not a text channel`);
        }

        await initializeGoogleSheetsClient();
        processScheduledPayments.start();
        remindOutstandingBalance.start();

        if (guild) {
            await deployCommands({guildId: guild.id});
        }
    } catch (error) {
        console.error("An error occurred during initialization", error);
    }
}