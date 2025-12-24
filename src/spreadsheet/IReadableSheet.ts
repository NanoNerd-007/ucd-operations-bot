export interface IReadableSheet<T> {
    getAll(): Promise<T[]>;
    getById(id: string): Promise<T | null>;
}