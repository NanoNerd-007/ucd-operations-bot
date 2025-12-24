import {IReadableSheet} from "@app/spreadsheet/IReadableSheet";
import {Person} from "@app/models/person";
import {computationSheet} from "@app/spreadsheet/computations/computation-sheet";
import {Computations} from "@app/spreadsheet/enums/computations";
import {createAsyncCache} from "@app/spreadsheet/caching/create-cache-async";

const PEOPLE_CACHE_DURATION_MS = 12 * 60 * 60 * 1000; // 12 Hours

export const peopleSheet: IReadableSheet<Person> = {
    async getAll(): Promise<Person[]> {
        return getPeopleCached();
    },
    async getById(discordId: string): Promise<Person | null> {
        const people = await getPeopleCached();
        return people.find(person => person.discordId === discordId) || null;
    }
}

const getPeopleCached = createAsyncCache(async () => {
    const people = await computationSheet.getById(Computations.ALL_PEOPLE);
    return decodePeople(people?.value || "");
}, PEOPLE_CACHE_DURATION_MS, 'allPeople');

function decodePeople(encodedValue: string): Person[] {
    const discordIdRegex = new RegExp(/<d>(.*?)<\/d>/i);
    const nameRegex = new RegExp(/<n>(.*?)<\/n>/i);
    const aliasesRegex = new RegExp(/<a>(.*?)<\/a>/ig);
    const delimitedPeople = encodedValue.split(/<p>(.*?)<\/p>/ig).filter(s => !!s);
    return delimitedPeople.map(person => {
        return {
            discordId: person.match(discordIdRegex)?.[1] || "",
            name: person.match(nameRegex)?.[1] || "",
            aliases: person.match(aliasesRegex)?.map(alias => alias.replace(/<a>|<\/a>/g, "")) || []
        }
    });
}