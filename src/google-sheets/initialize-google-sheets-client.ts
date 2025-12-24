import {googleSheetsClient} from "@app/google-sheets/google-sheets-client";

export const initializeGoogleSheetsClient = async () => await googleSheetsClient.loadInfo();