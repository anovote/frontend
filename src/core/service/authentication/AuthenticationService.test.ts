import axios, { AxiosInstance } from 'axios'
import { LocalStorageService } from 'core/service/storage/LocalStorageService'
import { CredentialError } from 'core/errors/CredentialsError'
import { StorageKeys } from 'core/service/storage/StorageKeys'
import { AuthenticationService } from './AuthenticationService'
const axiosMock: jest.Mocked<AxiosInstance> = (axios as unknown) as jest.Mocked<AxiosInstance>
const localStorageMock: jest.Mocked<LocalStorageService<StorageKeys>> = new LocalStorageService() as jest.Mocked<
    LocalStorageService<StorageKeys>
>
jest.mock('axios')
jest.mock('core/service/storage/LocalStorageService')

let service!: AuthenticationService

beforeAll(() => {
    service = new AuthenticationService(axios, localStorageMock)
})

/**
 * Contains IAT, EXP, and organizer:true and id:1
 * Expires : 03.03.2030
 */
const notExpiredToken =
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJhbm92b3RlIiwiaWF0IjoxNjE0ODAwOTM4LCJleHAiOjE4OTg3OTc3MzgsImF1ZCI6ImFub3ZvdGUuYXBwIiwic3ViIjoiYW5vdm90ZSIsImlkIjoiMSIsIm9yZ2FuaXplciI6InRydWUifQ.OFYrMuFxasEzvMjn3phGBNUMgesrDP169P3Bz7uH_iM'
/**
 * Contains IAT, EXP, and organizer:true, and id:1
 * Expires : 03.03.2021
 */
const expiredToken =
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJhbm92b3RlIiwiaWF0IjoxNjE0ODAwOTM4LCJleHAiOjE2MTQ4MDA5MzgsImF1ZCI6ImFub3ZvdGUuYXBwIiwic3ViIjoiYW5vdm90ZSIsImlkIjoiMSIsIm9yZ2FuaXplciI6InRydWUifQ.oAJFZTpmEaXD_4PriKnCnEYvcRw18cdLZPp4TIhbqRs'

it('should throw credential error on 400', async () => {
    try {
        axiosMock.post.mockRejectedValue({
            isAxiosError: true,
            response: { status: 400 },
        })
        await service.authenticateOrganizer({ email: 'test', password: 'test' })
    } catch (error) {
        expect(error).toBeInstanceOf(CredentialError)
    }
})

it('should throw error on non axios error', async () => {
    try {
        axiosMock.post.mockRejectedValue(new Error('error'))
        await service.authenticateOrganizer({ email: 'test', password: 'test' })
    } catch (error) {
        expect(error.isAxiosError).toBeUndefined()
    }
})

it('should return undefined if login successful', async () => {
    const tokenValue = notExpiredToken
    axiosMock.post.mockResolvedValue({ data: { token: tokenValue } })
    const login = await service.authenticateOrganizer({ email: 'test', password: 'test' })
    expect(login).toBe(undefined)
})

it('should throw error if token is missing from response', async () => {
    try {
        axiosMock.post.mockResolvedValue({ data: {} })
        await service.authenticateOrganizer({ email: 'test', password: 'test' })
    } catch (error) {
        expect(error).toBeInstanceOf(Error)
    }
})

it('token should be valid before expiration date', async () => {
    function getItem() {
        return notExpiredToken
    }
    localStorageMock.getItem.mockImplementation(getItem)
    expect(service.hasValidAuthorizationToken()).toBe(true)
})

it('token should be invalid after expiration date', async () => {
    function getItem() {
        return expiredToken
    }
    localStorageMock.getItem.mockImplementation(getItem)
    expect(service.hasValidAuthorizationToken()).toBe(false)
})

it('should login with token if the exists a token and it is valid', async () => {
    function getItem() {
        return notExpiredToken
    }
    localStorageMock.getItem.mockImplementation(getItem)
    expect(service.tryLoginWithToken()).toBe(true)
})

it('should not login with token if token exists but is expired', async () => {
    function getItem() {
        return expiredToken
    }
    localStorageMock.getItem.mockImplementation(getItem)
    expect(service.tryLoginWithToken()).toBe(false)
})

it('should not login with token if token exists but is expired', async () => {
    function getItem() {
        return expiredToken
    }
    localStorageMock.getItem.mockImplementation(getItem)
    expect(service.tryLoginWithToken()).toBe(false)
})

it('should not login with token if token does not exist', async () => {
    function getItem() {
        return null
    }
    localStorageMock.getItem.mockImplementation(getItem)
    expect(service.tryLoginWithToken()).toBe(false)
})
