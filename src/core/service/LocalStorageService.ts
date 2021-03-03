import { IStorage } from './IStorage'

export class LocalStorageService<T extends string> implements IStorage<T> {
    [name: string]: unknown

    get length(): number {
        return localStorage.length
    }
    clear(): void {
        localStorage.clear()
    }

    getItem(key: T): string | null {
        return localStorage.getItem(key)
    }

    key(index: number): string | null {
        return localStorage.key(index)
    }

    removeItem(key: T): void {
        localStorage.removeItem(key)
    }

    setItem(key: T, value: string): void {
        localStorage.setItem(key, value)
    }

    keyExists(key: T): boolean {
        return !!localStorage.getItem(key)
    }
}
