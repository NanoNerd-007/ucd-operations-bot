import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import {peopleSheet} from "@app/spreadsheet/people/people-sheet";
import {computationSheet} from "@app/spreadsheet/computations/computation-sheet";
import {Computations} from "@app/spreadsheet/enums/computations";

export const data = new SlashCommandBuilder()
    .setName("balance")
    .setDescription("Displays the current balance");

export async function execute(interaction: CommandInteraction) {
    try {
        await interaction.deferReply();

        const [person, balanceAmountComputation, balancePayeeComputation] = await Promise.all([
            await peopleSheet.getById(interaction.user.id),
            await computationSheet.getById(Computations.OUTSTANDING_BALANCE_AMOUNT),
            await computationSheet.getById(Computations.OUTSTANDING_BALANCE_PAYEE)
        ]);

        if (!person) {
            return await interaction.editReply("Invalid Discord ID, make sure your ID is in the `People` sheet.");
        }

        if (!balanceAmountComputation || !balancePayeeComputation) {
            return interaction.editReply("No outstanding balance found.");
        }

        if (balancePayeeComputation.value !== person.name) {
            return interaction.editReply( "No outstanding balance found for you.");
        }

        return interaction.editReply(`Your current balance is $${balanceAmountComputation.value}.`);
    } catch (error) {
        console.error("Error executing balance command:", error);
        return interaction.editReply("An error occurred while fetching your balance.");
    }
}
