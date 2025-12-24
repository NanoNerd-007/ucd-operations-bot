import {bold, codeBlock, ModalSubmitInteraction} from "discord.js";
import {CustomId} from "@app/discord/enums/custom-id";
import {purchasesSheet} from "@app/spreadsheet/purchases/purchases-sheet";

export async function handleEditPurchaseModalSubmit(interaction: ModalSubmitInteraction) {
    if (!interaction.message) {
        await interaction.reply({
            content: "This purchase cannot be edited.",
            ephemeral: true
        });
        return;
    }

    const purchase = await purchasesSheet.getById(interaction.message.id);

    if (!purchase) {
        await interaction.reply({
            content: "Purchase not found.",
            ephemeral: true
        });
        return;
    }

    const date = interaction.fields.getTextInputValue(CustomId.EDIT_MODAL_DATE);
    const description = interaction.fields.getTextInputValue(CustomId.EDIT_MODAL_DESCRIPTION);
    const amount = parseFloat(interaction.fields.getTextInputValue(CustomId.EDIT_MODAL_AMOUNT));

    await purchasesSheet.update(interaction.message.id, {
        date: new Date(date),
        description,
        amount
    });

    await interaction.message.edit(`${bold(purchase.paidBy)} spent ${bold(amount.toFixed(2))} in ${bold(purchase.category)} on the following: ${codeBlock(description)}`);

    await interaction.reply({
        content: "Purchase updated successfully.",
        ephemeral: true
    });
}