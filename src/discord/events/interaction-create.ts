import {commands} from "../commands";
import {CommandInteraction, Interaction} from "discord.js";
import {handleButtonInteraction} from "@app/discord/component-interactions/handle-button-interaction";
import {handleModalInteraction} from "@app/discord/component-interactions/handle-modal-interaction";

export async function onInteractionCreate(interaction: Interaction) {
    if (interaction.isCommand()) {
        await handleCommand(interaction);
        return;
    }

    if (interaction.isButton()) {
        await handleButtonInteraction(interaction);
        return;
    }

    if (interaction.isModalSubmit()) {
        await handleModalInteraction(interaction);
        return;
    }

    console.warn(`Unhandled interaction type: ${interaction.type}`);
}

async function handleCommand(interaction: CommandInteraction) {
    const { commandName } = interaction;
    if (commands[commandName as keyof typeof commands]) {
        await commands[commandName as keyof typeof commands].execute(interaction);
    } else {
        console.warn(`Command ${commandName} not found.`);
    }
}