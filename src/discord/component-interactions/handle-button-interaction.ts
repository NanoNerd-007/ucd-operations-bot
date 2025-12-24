import {ButtonInteraction} from "discord.js";
import {CustomId} from "@app/discord/enums/custom-id";
import {handleEdit} from "@app/discord/component-interactions/handle-edit";
import {handleDelete} from "@app/discord/component-interactions/handle-delete";

export async function handleButtonInteraction(interaction: ButtonInteraction) {
    switch (interaction.customId) {
        case CustomId.EDIT_BUTTON:
            await handleEdit(interaction);
            break;
        case CustomId.DELETE_BUTTON:
            await handleDelete(interaction);
            break;
    }
}