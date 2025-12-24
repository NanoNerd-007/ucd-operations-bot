import {ParsedMessage} from "@app/models/parsed-message";
import {Person} from "@app/models/person";
import {Category} from "@app/models/category";
import {extractName} from "@app/extraction/extract-name";
import {extractAmount} from "@app/extraction/extract-amount";
import {extractCategory} from "@app/extraction/extract-category";
import {extractDescription} from "@app/extraction/extract-description";

export function parseMessage(message: string, people: Person[], categories: Category[]): ParsedMessage {
    return {
        paidBy: extractName(message, people),
        descriptionOfPurchase: extractDescription(message, people, categories),
        amount: extractAmount(message),
        category: extractCategory(message, categories),
    };
}