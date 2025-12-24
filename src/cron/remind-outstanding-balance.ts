import {CronJob} from "cron";
import {discordClient} from "@app/discord/discord-client";
import {config} from "@app/config";
import {bold, heading, HeadingLevel, inlineCode} from "discord.js";
import {computationSheet} from "@app/spreadsheet/computations/computation-sheet";
import {Computations} from "@app/spreadsheet/enums/computations";
import {peopleSheet} from "@app/spreadsheet/people/people-sheet";

export const remindOutstandingBalance = CronJob.from({
    cronTime: `0 ${config.OUTSTANDING_BALANCE_REMINDER_HOUR_TO_EXECUTE} 1 * *`,
    utcOffset: Number(config.TIMEZONE_OFFSET),
    onTick: async function () {
        const people = await peopleSheet.getAll();
        const outstandingBalanceAmount = await computationSheet.getById(Computations.OUTSTANDING_BALANCE_AMOUNT);
        const outstandingBalancePayee = await computationSheet.getById(Computations.OUTSTANDING_BALANCE_PAYEE);


        if (!outstandingBalanceAmount || !outstandingBalancePayee) {
            return;
        }

        const payeeDiscordId = people.find(person => person.name === outstandingBalancePayee.value)?.discordId;
        if (!payeeDiscordId) {
            return;
        }

        const messageHeading = heading(`Outstanding balance reminder\n`, HeadingLevel.Three);
        const messageBody = `<@${payeeDiscordId}>, you have an outstanding balance of $${bold(outstandingBalanceAmount.value)}\nPlease pay this using the ${inlineCode("/pay")} command`;

        const message = `${messageHeading}\n${messageBody}`;

        const textChannel = discordClient.channels.cache.get(config.DISCORD_CHANNEL_ID!)
        if (!!textChannel && textChannel.isTextBased()) {
            textChannel.send(message);
        }
    },
    start: false,
});