import {CacheEntry} from "@app/models/cache-entry";

/**
 * Creates a memoized (cached) version of an asynchronous function.
 * @param fn The asynchronous function to cache.
 * @param cacheDurationMs The duration in milliseconds for which the cache is valid.
 * @param cacheKey An optional key for the cache if you want to manage multiple caches.
 * @returns A cached version of the function.
 */
export function createAsyncCache<T>(
    fn: () => Promise<T>,
    cacheDurationMs: number,
    cacheKey: string = 'default'
): () => Promise<T> {
    let cache: CacheEntry<T> | null = null;

    return async function (): Promise<T> {
        const now = Date.now();

        if (cache && (now - cache.timestamp < cacheDurationMs)) {
            console.log(`Returning data for key "${cacheKey}" from cache.`);
            return cache.data;
        }

        console.log(`Fetching data for key "${cacheKey}" and updating cache.`);
        const data = await fn()
        cache = {
            data: data,
            timestamp: now,
        };
        return data;
    };
}