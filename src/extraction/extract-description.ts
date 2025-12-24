import {Person} from "@app/models/person";
import {Category} from "@app/models/category";
import {extractName} from "@app/extraction/extract-name";
import {extractCategory} from "@app/extraction/extract-category";
import {extractAmount} from "@app/extraction/extract-amount";

export function extractDescription(message: string, people: Person[], categories: Category[]): string | null {
    const fillerWords = [
        'spent',
        'paid',
        'on',
        'for',
        'at',
        'with',
    ]

    const person = extractName(message, people);
    if (person) {
        const personRegex = new RegExp(`\\b${person}\\b`, 'gi');
        message = message.replace(personRegex, '');
    }

    const category = extractCategory(message, categories);
    if (category) {
        const categoryRegex = new RegExp(`\\b${category}\\b`, 'gi');
        message = message.replace(categoryRegex, '');
    }

    const amount = extractAmount(message);
    if (amount) {
        const amountRegex = new RegExp(`\\b${amount}\\b`, 'i');
        message = message.replace(amountRegex, '');
    }

    // Remove filler words and any non alphanumeric characters
    const alphanumericRegex = /[^\w\s]/gi;
    const fillerWordRegex = new RegExp(`\\b(${fillerWords.join('|')})\\b`, 'gi');
    return message.replace(alphanumericRegex, '').replaceAll(fillerWordRegex, ' ').trim();
}