import {IReadableSheet} from "@app/spreadsheet/IReadableSheet";
import {computationSheet} from "@app/spreadsheet/computations/computation-sheet";
import {Computations} from "@app/spreadsheet/enums/computations";
import {createAsyncCache} from "@app/spreadsheet/caching/create-cache-async";
import {Category} from "@app/models/category";

const CATEGORY_CACHE_DURATION_MS = 60 * 60 * 1000; // 1 Hour

export const categorySheet: IReadableSheet<Category> = {
    async getAll(): Promise<Category[]> {
        return await getCategoriesCached();
    },
    async getById(name: string): Promise<Category | null> {
        const categories = await getCategoriesCached();
        return categories.find(category => category.name === name) || null;
    },
}

const getCategoriesCached = createAsyncCache(async () => {
    const categories = await computationSheet.getById(Computations.ALL_CATEGORIES);
    return decodeCategories(categories?.value || "");
}, CATEGORY_CACHE_DURATION_MS, 'allCategories');

function decodeCategories(encodedValue: string): Category[] {
    const nameRegex = new RegExp(/<n>(.*?)<\/n>/i);
    const keywordsRegex = new RegExp(/<k>(.*?)<\/k>/ig);
    const delimitedCategories = encodedValue.split(/<c>(.*?)<\/c>/ig).filter(s => !!s);
    return delimitedCategories.map(category => {
        return {
            name: category.match(nameRegex)?.[1] || "",
            keywords: category.match(keywordsRegex)?.map(keyword => keyword.replace(/<k>|<\/k>/g, "")) || []
        }
    });
}