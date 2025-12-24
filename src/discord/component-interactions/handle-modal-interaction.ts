import {ModalSubmitInteraction} from "discord.js";
import {CustomId} from "@app/discord/enums/custom-id";
import {handleEditPurchaseModalSubmit} from "@app/discord/component-interactions/handle-edit-purchase-modal-submit";

export async function handleModalInteraction(interaction: ModalSubmitInteraction) {
    switch (interaction.customId) {
        case CustomId.EDIT_MODAL:
            await handleEditPurchaseModalSubmit(interaction);
            break;
    }
}