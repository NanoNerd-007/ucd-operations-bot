import {googleSheetsClient} from "@app/google-sheets/google-sheets-client";
import {Purchase} from "@app/models/purchase";
import {config} from "@app/config";

export const purchasesSheet = {
    async getAll(): Promise<Purchase[]> {
        const sheet = googleSheetsClient.sheetsByTitle[config.PURCHASES_SHEET_NAME];
        await sheet.loadCells();

        const data = await sheet.getRows();
        return data.map(row => {

            const rawAmount = row.get(config.PURCHASES_COL_AMOUNT) as string;
            const amount = rawAmount ? parseFloat(rawAmount.replace(/[^0-9.-]+/g, "")) : 0;

            return {
                date: new Date(row.get(config.PURCHASES_COL_DATE) as string),
                description: row.get(config.PURCHASES_COL_DESCRIPTION) as string,
                amount: amount,
                category: row.get(config.PURCHASES_COL_CATEGORY) as string,
                paidBy: row.get(config.PURCHASES_COL_PAID_BY) as string,
                splitMethod: row.get(config.PURCHASES_COL_SPLIT_TYPE) as string,
                transactionId: row.get(config.PURCHASES_COL_ID) as string,
            };
        });
    },

    async getById(transactionId: string): Promise<Purchase | null> {
        const purchases = await this.getAll();
        return purchases.find(purchase => purchase.transactionId === transactionId) || null;
    },

    async insert(purchase: Purchase): Promise<void> {
        const sheet = googleSheetsClient.sheetsByTitle[config.PURCHASES_SHEET_NAME];
        await sheet.loadCells();

        await sheet.addRow({
            [config.PURCHASES_COL_DATE]: purchase.date.toISOString().split("T")[0],
            [config.PURCHASES_COL_DESCRIPTION]: purchase.description,
            [config.PURCHASES_COL_AMOUNT]: purchase.amount,
            [config.PURCHASES_COL_CATEGORY]: purchase.category,
            [config.PURCHASES_COL_PAID_BY]: purchase.paidBy,
            [config.PURCHASES_COL_SPLIT_TYPE]: purchase.splitMethod,
            [config.PURCHASES_COL_ID]: purchase.transactionId
        }, {
            raw: true
        });
    },

    async update(transactionId: string, updatedPurchase: Partial<Purchase>): Promise<void> {
        const sheet = googleSheetsClient.sheetsByTitle[config.PURCHASES_SHEET_NAME];
        await sheet.loadCells();

        const rows = await sheet.getRows();
        const rowToUpdate = rows.find(row => row.get(config.PURCHASES_COL_ID) === transactionId);

        if (rowToUpdate) {
            if (updatedPurchase.date) rowToUpdate.set(config.PURCHASES_COL_DATE, updatedPurchase.date.toISOString().split("T")[0]);
            if (updatedPurchase.description) rowToUpdate.set(config.PURCHASES_COL_DESCRIPTION, updatedPurchase.description);
            if (updatedPurchase.amount !== undefined) rowToUpdate.set(config.PURCHASES_COL_AMOUNT, updatedPurchase.amount.toString());
            if (updatedPurchase.category) rowToUpdate.set(config.PURCHASES_COL_CATEGORY, updatedPurchase.category);
            if (updatedPurchase.paidBy) rowToUpdate.set(config.PURCHASES_COL_PAID_BY, updatedPurchase.paidBy);
            if (updatedPurchase.splitMethod) rowToUpdate.set(config.PURCHASES_COL_SPLIT_TYPE, updatedPurchase.splitMethod);

            await rowToUpdate.save();
        } else {
            console.warn(`Transaction with ID ${transactionId} not found.`);
        }
    },

    async delete(transactionId: string): Promise<void> {
        const sheet = googleSheetsClient.sheetsByTitle[config.PURCHASES_SHEET_NAME];
        await sheet.loadCells();

        const rows = await sheet.getRows();
        const rowToDelete = rows.find(row => row.get("Transaction ID") === transactionId);

        if (rowToDelete) {
            await rowToDelete.delete();
        } else {
            console.warn(`Transaction with ID ${transactionId} not found.`);
        }
    }
}