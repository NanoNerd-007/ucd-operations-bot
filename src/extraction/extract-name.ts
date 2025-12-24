import {Person} from "@app/models/person";

export function extractName(message: string, people: Person[]): string | null {
    const messageAsLower = message.toLowerCase();
    return people.find(person =>
        messageAsLower.includes(person.name.toLowerCase()) ||
        person.aliases.some(alias => messageAsLower.includes(alias.toLowerCase()))
    )?.name ?? null;
}