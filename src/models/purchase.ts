export type Purchase = {
    date: Date;
    description: string;
    amount: number;
    category: string;
    paidBy: string;
    splitMethod: string;
    transactionId: string;
}