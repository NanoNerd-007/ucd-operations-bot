import {IReadableSheet} from "@app/spreadsheet/IReadableSheet";
import {createAsyncCache} from "@app/spreadsheet/caching/create-cache-async";
import {Preference} from "@app/models/preference";
import {googleSheetsClient} from "@app/google-sheets/google-sheets-client";
import {config} from "@app/config";

const PREFERENCES_CACHE_DURATION_MS = 60 * 60 * 1000; // 1 Hour

export const preferenceSheet: IReadableSheet<Preference> = {
    async getAll(): Promise<Preference[]> {
        return await getPreferencesCached();
    },
    async getById(id: string): Promise<Preference | null> {
        const preferences = await getPreferencesCached();
        return preferences.find(preference => preference.id === id) || null;
    },
}

const getPreferencesCached = createAsyncCache(async () => {
    const sheet = googleSheetsClient.sheetsByTitle[config.PREFERENCES_SHEET_NAME];
    await sheet.loadCells();
    const data = await sheet.getRows();
    return data.map(row => {
        return {
            id: row.get(config.PREFERENCES_COL_NAME) as string,
            value: row.get(config.PREFERENCES_COL_VALUE) as string,
            description: row.get(config.PREFERENCES_COL_DESCRIPTION) as string,
        } as Preference;
    });
}, PREFERENCES_CACHE_DURATION_MS, 'allPreferences');
