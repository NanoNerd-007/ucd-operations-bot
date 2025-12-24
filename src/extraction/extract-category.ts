import {Category} from "@app/models/category";

export function extractCategory(message: string, categories: Category[]): string | null {
    const messageAsLower = message.toLowerCase();
    return categories.find(category =>
        category.name.toLowerCase() === messageAsLower ||
        category.keywords.some(keyword => messageAsLower.includes(keyword.toLowerCase()))
    )?.name ?? null;
}