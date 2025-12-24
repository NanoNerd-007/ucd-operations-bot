import {
    ActionRowBuilder,
    ModalActionRowComponentBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle
} from "discord.js";
import {CustomId} from "@app/discord/enums/custom-id";
import {Purchase} from "@app/models/purchase";

export function editPurchaseModal(purchase: Purchase) {

    const modal = new ModalBuilder()
        .setCustomId(CustomId.EDIT_MODAL)
        .setTitle('Edit Purchase');

    const dateInput = new TextInputBuilder()
        .setCustomId(CustomId.EDIT_MODAL_DATE)
        .setLabel("Date")
        .setValue(purchase.date.toISOString().split("T")[0] || "")
        .setStyle(TextInputStyle.Short);

    const descriptionInput = new TextInputBuilder()
        .setCustomId(CustomId.EDIT_MODAL_DESCRIPTION)
        .setLabel("Description")
        .setValue(purchase.description)
        .setStyle(TextInputStyle.Paragraph);

    const amountInput = new TextInputBuilder()
        .setCustomId(CustomId.EDIT_MODAL_AMOUNT)
        .setLabel("Amount")
        .setValue(purchase.amount.toString())
        .setStyle(TextInputStyle.Short);

    const actionRows = [
        new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(dateInput),
        new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(amountInput),
        new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(descriptionInput),
    ];

    modal.addComponents(...actionRows);
    return modal;
}