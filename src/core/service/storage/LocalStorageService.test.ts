import { LocalStorageService } from './LocalStorageService'

export type testTypes = 'A' | 'B' | 'C' | 'D'

const storageService: LocalStorageService<testTypes> = new LocalStorageService()
beforeEach(() => {
    storageService.clear()
})

it('should return same value after getting inserted item with key', () => {
    const value = '1234'
    storageService.setItem('A', value)
    expect(storageService.getItem('A')).toBe(value)
})

it('should clear storage when clear is called', () => {
    storageService.setItem('A', '....')
    storageService.clear()
    expect(storageService.length).toBe(0)
})

it('should contain N items after insert', () => {
    storageService.setItem('A', '....')
    storageService.setItem('B', '....')
    expect(storageService.length).toBe(2)
})

it('should return key name for item at index', () => {
    storageService.setItem('A', '....')
    expect(storageService.key(0)).toBe('A')
})

it('should remove item by key', () => {
    storageService.setItem('A', '...')
    expect(storageService.keyExists('A')).toBe(true)
    storageService.removeItem('A')
    expect(storageService.keyExists('A')).toBe(false)
})

it('should return false if key does not exists', () => {
    expect(storageService.keyExists('B')).toBe(false)
})

it('should return true if key does not exists', () => {
    storageService.setItem('A', '1234')
    expect(storageService.keyExists('A')).toBe(true)
})
