import {IReadableSheet} from "@app/spreadsheet/IReadableSheet";
import {Computation} from "@app/models/computation";
import {googleSheetsClient} from "@app/google-sheets/google-sheets-client";
import {config} from "@app/config";

export const computationSheet: IReadableSheet<Computation> = {
    async getAll(): Promise<Computation[]> {
        const sheet = googleSheetsClient.sheetsByTitle[config.COMPUTATIONS_SHEET_NAME];
        await sheet.loadCells();

        const data = await sheet.getRows();
        return data.map(row => {
            return {
                id: row.get(config.COMPUTATIONS_COL_NAME) as string,
                description: row.get(config.COMPUTATIONS_COL_DESCRIPTION) as string,
                value: row.get(config.COMPUTATIONS_COL_VALUE) as string,
            }
        });
    },

    async getById(id: string): Promise<Computation | null> {
        const computations = await this.getAll();
        return computations.find(computation => computation.id === id) || null;
    }
}