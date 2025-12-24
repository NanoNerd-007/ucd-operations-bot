import {Type} from "@google/genai";

export const STRUCTURED_OUTPUT = {
    type: Type.OBJECT,
    required: ["paidBy", "purchaseDescription", "purchaseAmount", "category"],
    properties: {
        paidBy: {
            type: Type.STRING,
        },
        purchaseDescription: {
            type: Type.STRING,
        },
        purchaseAmount: {
            type: Type.NUMBER,
        },
        category: {
            type: Type.STRING,
        },
    },
};