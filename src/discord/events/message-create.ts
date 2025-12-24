import {ActionRowBuilder, bold, ButtonBuilder, ButtonStyle, codeBlock, Message} from "discord.js";
import {purchasesSheet} from "@app/spreadsheet/purchases/purchases-sheet";
import {CustomId} from "@app/discord/enums/custom-id";
import {config} from "@app/config";
import {computationSheet} from "@app/spreadsheet/computations/computation-sheet";
import {Computations} from "@app/spreadsheet/enums/computations";
import {categorySheet} from "@app/spreadsheet/categories/category-sheet";
import {peopleSheet} from "@app/spreadsheet/people/people-sheet";
import {parseMessage} from "@app/extraction/parse-message";
import {ParsedMessage} from "@app/models/parsed-message";
import {parseMessageUsingLLM} from "@app/ai/parse-message-using-llm";

export async function onMessageCreate(message: Message) {
    if (message.author.bot) return;

    try {
        if (message.channelId !== config.DISCORD_CHANNEL_ID) return;

        const allCategoriesPromise = categorySheet.getAll();
        const allPeoplePromise = peopleSheet.getAll();
        const fallbackCategoryPromise = computationSheet.getById(Computations.DEFAULT_CATEGORY);
        const processingMessagePromise = message.reply("Processing your request...");

        const [allCategories, allPeople, fallbackCategory, processingMessage] = await Promise.all([
            await allCategoriesPromise,
            await allPeoplePromise,
            await fallbackCategoryPromise,
            await processingMessagePromise,
        ]);

        let response: ParsedMessage;

        if (config.GEMINI_API_KEY) {
            response = await parseMessageUsingLLM(message.content, allCategories, fallbackCategory?.value || "");
        } else {
            response = parseMessage(message.content, allPeople, allCategories);
        }

        const {descriptionOfPurchase, amount, category, paidBy} = response;

        const payee = paidBy || allPeople.find(person => person.discordId === message.author.id)?.name || "";
        const actualCategory = category || fallbackCategory?.value || "";

        if (!payee || !descriptionOfPurchase || !amount || !actualCategory) {
            console.log(payee, descriptionOfPurchase, amount, actualCategory);
            throw new Error("Invalid input. Please provide a name, description, amount, and category.");
        }

        await purchasesSheet.insert({
            date: new Date(),
            description: descriptionOfPurchase,
            amount: amount,
            category: actualCategory,
            paidBy: payee,
            splitMethod: config.SPLIT_TYPE_HALF,
            transactionId: processingMessage.id
        });

        const editButton = new ButtonBuilder()
            .setCustomId(CustomId.EDIT_BUTTON)
            .setLabel('Edit')
            .setStyle(ButtonStyle.Secondary);

        const rows = [
            new ActionRowBuilder<ButtonBuilder>().addComponents(editButton),
        ]

        await processingMessage.edit({
            content: `${bold(payee)} spent ${bold(amount.toFixed(2))} in ${bold(actualCategory)} on the following: ${codeBlock(descriptionOfPurchase)}`,
            components: [...rows],
        });
        await processingMessage.react('✅');
    } catch (error) {
        await message.reply("An error occurred while processing your request. Please try again later.");
        console.error(error);
    }

}