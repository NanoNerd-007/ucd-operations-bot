import {ButtonInteraction} from "discord.js";
import {purchasesSheet} from "@app/spreadsheet/purchases/purchases-sheet";

export async function handleDelete(interaction: ButtonInteraction) {
    await purchasesSheet.delete(interaction.message.id);
    await interaction.reply({
        content: "Purchase deleted successfully.",
        ephemeral: true
    });
    await interaction.message.delete();
}