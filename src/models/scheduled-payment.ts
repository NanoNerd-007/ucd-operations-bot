import {SplitType} from "@app/enums/split-type";

export type ScheduledPayment = {
    enabled: boolean;
    purchase: string;
    amount: number;
    category: string;
    paidBy: string;
    frequency: string;
    splitType: SplitType;
    lastPaid?: Date;
}