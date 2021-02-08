import axios, { AxiosInstance } from 'axios'
import { AuthenticationService } from './AuthenticationService'
import { CredentialError } from './CredentialsError'
const axiosMock: jest.Mocked<AxiosInstance> = (axios as unknown) as jest.Mocked<AxiosInstance>
jest.mock('axios')
let service!: AuthenticationService
beforeAll(() => {
    service = new AuthenticationService(axios)
})

it('should throw credential error on 400', async () => {
    try {
        axiosMock.post.mockRejectedValue({
            isAxiosError: true,
            response: { status: 400 },
        })
        await service.authenticateOrganizer({ identification: 'test', password: 'test' })
    } catch (error) {
        expect(error).toBeInstanceOf(CredentialError)
    }
})

it('should throw error on non axios error', async () => {
    try {
        axiosMock.post.mockRejectedValue(new Error('error'))
        await service.authenticateOrganizer({ identification: 'test', password: 'test' })
    } catch (error) {
        expect(error.isAxiosError).toBeUndefined()
    }
})

it('should store token if successfull login', async () => {
    const tokenValue = 'randomtoken'
    axiosMock.post.mockResolvedValue({ data: { token: tokenValue } })
    await service.authenticateOrganizer({ identification: 'test', password: 'test' })
    expect(global.localStorage.getItem('ACCESS_TOKEN')).toBe(tokenValue)
})

it('should throw error if token is missing', async () => {
    try {
        axiosMock.post.mockResolvedValue({ data: {} })
        await service.authenticateOrganizer({ identification: 'test', password: 'test' })
    } catch (error) {
        expect(error).toBeInstanceOf(Error)
    }
})
