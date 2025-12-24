import {GoogleGenAI} from "@google/genai";
import {ParsedMessage} from "@app/models/parsed-message";
import {STRUCTURED_OUTPUT} from "@app/ai/structured-output";
import {SYSTEM_PROMPT} from "@app/ai/system-prompt";
import {Category} from "@app/models/category";
import {config as environmentConfig} from "@app/config";

export async function parseMessageUsingLLM(message: string, allCategories: Category[], defaultCategory: string): Promise<ParsedMessage> {
    const ai = new GoogleGenAI({
        apiKey: environmentConfig.GEMINI_API_KEY
    });

    const config = {
        thinkingConfig: {
            thinkingBudget: 0,
        },
        responseMimeType: 'application/json',
        responseSchema: STRUCTURED_OUTPUT,
        systemInstruction: [
            {
                text: SYSTEM_PROMPT(JSON.stringify(allCategories), defaultCategory),
            }
        ],
    };
    const model = 'gemini-flash-lite-latest';
    const contents = [
        {
            role: 'user',
            parts: [
                {
                    text: message,
                },
            ],
        },
    ];

    const response = await ai.models.generateContent({
        model,
        config,
        contents,
    });

    if (!response.text) {
        throw new Error('No response from LLM');
    }

    const responseBody = JSON.parse(response.text);

    return {
        paidBy: responseBody.paidBy,
        descriptionOfPurchase: responseBody.purchaseDescription,
        amount: responseBody.purchaseAmount,
        category: responseBody.category,
    };
}