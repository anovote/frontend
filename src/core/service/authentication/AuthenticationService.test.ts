import axios, { AxiosInstance } from 'axios'
import { LocalStorageService } from 'core/service/storage/LocalStorageService'
import { StorageKeys } from '../storage/StorageKeys'
import { AuthenticationService } from './AuthenticationService'
import { CredentialError } from './CredentialsError'
const axiosMock: jest.Mocked<AxiosInstance> = (axios as unknown) as jest.Mocked<AxiosInstance>
jest.mock('axios')
let service!: AuthenticationService
beforeAll(() => {
    service = new AuthenticationService(axios, new LocalStorageService<StorageKeys>())
})

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

it('should store token if successful login', async () => {
    const tokenValue = 'randomToken'
    axiosMock.post.mockResolvedValue({ data: { token: tokenValue } })
    await service.authenticateOrganizer({ email: 'test', password: 'test' })
    expect(global.localStorage.getItem('ACCESS_TOKEN')).toBe(tokenValue)
})

it('should throw error if token is missing', async () => {
    try {
        axiosMock.post.mockResolvedValue({ data: {} })
        await service.authenticateOrganizer({ email: 'test', password: 'test' })
    } catch (error) {
        expect(error).toBeInstanceOf(Error)
    }
})

it('should be have a valid authorization token if token is not expired', async () => {
    const tokenValue =
        'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJhbm92b3RlIiwiaWF0IjoxNjE0ODAwOTM4LCJleHAiOjE4OTg3OTc3MzgsImF1ZCI6ImFub3ZvdGUuYXBwIiwic3ViIjoiYW5vdm90ZSIsIlJvbGUiOiJQcm9qZWN0IEFkbWluaXN0cmF0b3IifQ.FdwR1I8kPwvbkXtpYInWYwqEFPp5hqlfUwb4ArJs7ho'
    axiosMock.post.mockResolvedValue({ data: { token: tokenValue } })
    await service.authenticateOrganizer({ email: 'test', password: 'test' })
    expect(service.hasValidAuthorizationToken()).toBe(true)
})
