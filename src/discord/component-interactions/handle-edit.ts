import {ButtonInteraction} from "discord.js";
import {purchasesSheet} from "@app/spreadsheet/purchases/purchases-sheet";
import {editPurchaseModal} from "@app/discord/component-interactions/edit-purchase-modal";

export async function handleEdit(interaction: ButtonInteraction) {

    const purchase = await purchasesSheet.getById(interaction.message.id);

    if (!purchase) {
        await interaction.message.delete();
        await interaction.reply({
            content: "Purchase not found.",
            ephemeral: true
        });
        return;
    }

    const modal = editPurchaseModal(purchase);
    await interaction.showModal(modal);
}

