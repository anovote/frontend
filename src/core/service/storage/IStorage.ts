export interface IStorage<T extends string> extends Storage {
    getItem(key: T): string | null
    key(index: number): string | null
    removeItem(key: T): void
    setItem(key: T, value: string): void
    keyExists(key: T): boolean
}
