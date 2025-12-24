import {onMessageCreate} from "@app/discord/events/message-create";
import {onGuildCreate} from "@app/discord/events/guild-create";
import {discordClient} from "@app/discord/discord-client";
import {onReady} from "@app/discord/events/ready";
import {onInteractionCreate} from "@app/discord/events/interaction-create";
import {config} from "@app/config";
import {Events} from "discord.js";

discordClient.on(Events.ClientReady, onReady);
discordClient.on(Events.GuildCreate, onGuildCreate);
discordClient.on(Events.InteractionCreate, onInteractionCreate);
discordClient.on(Events.MessageCreate, onMessageCreate);

discordClient.login(config.DISCORD_TOKEN).then(() => {
    console.log("Successfully logged in");
});