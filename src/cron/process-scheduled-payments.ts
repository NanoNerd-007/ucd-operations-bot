import {CronJob} from "cron";
import {scheduledPaymentsSheet} from "@app/spreadsheet/scheduled-payments/scheduled-payments-sheet";
import {discordClient} from "@app/discord/discord-client";
import {purchasesSheet} from "@app/spreadsheet/purchases/purchases-sheet";
import {config} from "@app/config";
import {ScheduledPaymentFrequency} from "@app/spreadsheet/enums/scheduled-payment-frequency";
import {
    differenceInDays,
    differenceInMonths,
    differenceInQuarters,
    differenceInWeeks,
    differenceInYears
} from "date-fns";
import {ScheduledPayment} from "@app/models/scheduled-payment";
import {heading, HeadingLevel} from "discord.js";
import {preferenceSheet} from "@app/spreadsheet/preferences/preference-sheet";
import {Preferences} from "@app/spreadsheet/enums/preferences";
import {peopleSheet} from "@app/spreadsheet/people/people-sheet";
import {SplitType} from "@app/enums/split-type";

export const processScheduledPayments = CronJob.from({
    cronTime: `0 ${config.SCHEDULED_PAYMENTS_HOUR_TO_EXECUTE} * * *`,
    utcOffset: Number(config.TIMEZONE_OFFSET),
    onTick: async function () {
        console.log('Processing scheduled payments...');
        const scheduledPayments = await scheduledPaymentsSheet.getAll();
        const people = await peopleSheet.getAll();

        if (scheduledPayments.length === 0) {
            console.log('No scheduled payments to process...');
            return;
        }

        const successfulPaymentsMade: ScheduledPayment[] = [];

        for (const scheduledPaymentRaw of scheduledPayments) {
            if (!scheduledPaymentRaw.get(config.SCHEDULED_PAYMENTS_COL_DESCRIPTION)) {
                continue;
            }

            const scheduledPayment = scheduledPaymentsSheet.toScheduledPayment(scheduledPaymentRaw);
            if (!scheduledPayment.enabled) {
                console.log(`Skipping disabled scheduled payment: ${scheduledPayment.purchase}`);
                continue;
            }

            let isDue = false;
            if (scheduledPayment.lastPaid) {
                if (scheduledPayment.frequency === ScheduledPaymentFrequency.DAILY) {
                    const delta = differenceInDays(new Date(), scheduledPayment.lastPaid);
                    isDue = delta >= 1;
                }
                if (scheduledPayment.frequency === ScheduledPaymentFrequency.WEEKLY) {
                    const delta = differenceInWeeks(new Date(), scheduledPayment.lastPaid);
                    isDue = delta >= 1;
                }
                if (scheduledPayment.frequency === ScheduledPaymentFrequency.BIWEEKLY) {
                    const delta = differenceInWeeks(new Date(), scheduledPayment.lastPaid);
                    isDue = delta >= 2;
                }
                if (scheduledPayment.frequency === ScheduledPaymentFrequency.MONTHLY) {
                    const delta = differenceInMonths(new Date(), scheduledPayment.lastPaid);
                    isDue = delta >= 1;
                }
                if (scheduledPayment.frequency === ScheduledPaymentFrequency.QUARTERLY) {
                    const delta = differenceInQuarters(new Date(), scheduledPayment.lastPaid);
                    isDue = delta >= 1;
                }
                if (scheduledPayment.frequency === ScheduledPaymentFrequency.SEMIANNUALLY) {
                    const delta = differenceInMonths(new Date(), scheduledPayment.lastPaid);
                    isDue = delta >= 6;
                }
                if (scheduledPayment.frequency === ScheduledPaymentFrequency.ANNUALLY) {
                    const delta = differenceInYears(scheduledPayment.lastPaid, new Date());
                    isDue = delta >= 1;
                }
            }

            if (!scheduledPayment.lastPaid || isDue) {
                console.log(`Processing payment for: ${scheduledPayment.purchase}`);
                await purchasesSheet.insert({
                    date: new Date(),
                    description: `#RECURRING# ${scheduledPayment.purchase}`,
                    amount: scheduledPayment.amount,
                    category: scheduledPayment.category,
                    paidBy: scheduledPayment.paidBy,
                    splitMethod: scheduledPayment.splitType,
                    transactionId: ""
                });
                successfulPaymentsMade.push(scheduledPayment);
                scheduledPaymentRaw.set(config.SCHEDULED_PAYMENTS_COL_LAST_PAID, new Date().toISOString());
                await scheduledPaymentRaw.save();
            }
        }

        if (successfulPaymentsMade.length === 0) {
            console.log('No scheduled payments were due.');
            return;
        }

        const shouldSendMessage = await preferenceSheet.getById(Preferences.SCHEDULED_PAYMENTS_NOTIFY);
        if (shouldSendMessage?.value === 'NO') {
            return
        }

        const messageHeading = heading(`The following scheduled payments were made: \n`, HeadingLevel.Three);
        const messageBody = successfulPaymentsMade.map((s) => {
            const baseMessage = `* A ${s.frequency} \$${s.amount} purchase for ${s.purchase} under ${s.category}, made by ${s.paidBy},`;
            if (s.splitType === SplitType.HALF) {
                return `${baseMessage} to be split 50/50.`;
            }

            // TODO This has the potential to return the wrong person if both people use duplicate names, should be addressed in the future by potentially using Discord IDs instead.
            const otherPerson = people.find(p => p.name !== s.paidBy);

            if (!otherPerson) {
                return `${baseMessage} to be paid entirely by the other person.`;
            }

            return `${baseMessage} to be paid entirely by ${otherPerson.name}.`;
        }).join("\n");

        const message = `${messageHeading}\n${messageBody}`;

        const textChannel = discordClient.channels.cache.get(config.DISCORD_CHANNEL_ID!)
        if (!!textChannel && textChannel.isTextBased()) {
            textChannel.send(message);
        }
    },
    start: false,
});