import {CommandInteraction, SlashCommandBuilder} from "discord.js";
import {computationSheet} from "@app/spreadsheet/computations/computation-sheet";
import {Computations} from "@app/spreadsheet/enums/computations";
import {peopleSheet} from "@app/spreadsheet/people/people-sheet";
import {purchasesSheet} from "@app/spreadsheet/purchases/purchases-sheet";
import {SplitType} from "@app/enums/split-type";

export const data = new SlashCommandBuilder()
    .setName("pay")
    .setDescription("Pay off any outstanding balances");

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

        await purchasesSheet.insert({
            date: new Date(),
            description: "#PAYMENT#",
            amount: parseFloat(balanceAmountComputation.value),
            category: "Payment",
            paidBy: person.name,
            splitMethod: SplitType.FULL,
            transactionId: ""
        });

        return interaction.editReply(
            `${person.name} has paid off their balance of \$${balanceAmountComputation.value} `
        );
    } catch (error) {
        console.error("Error executing pay command:", error);
        return interaction.editReply( "An error occurred while processing your request.");
    }
}
