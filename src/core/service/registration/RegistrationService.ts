import { AxiosError, AxiosInstance } from 'axios'
import { apiRoute } from '../../routes/apiRoutes'
import { CredentialError } from '../authentication/CredentialsError'
import { RegistrationDetails } from './RegistrationDetails'
import { RegistrationResponse } from './RegistrationResponse'

export class RegistrationService {
    private httpClient: AxiosInstance
    private readonly tokenkey = 'ACCESS_TOKEN'

    constructor(httpClient: AxiosInstance) {
        this.httpClient = httpClient
    }

    public async registerOrganizer({ firstName, lastName, email, password }: RegistrationDetails): Promise<void> {
        try {
            const response = await this.httpClient.post<RegistrationResponse>(apiRoute.registration, {
                firstName,
                lastName,
                email,
                password,
            })
            const token = response.data.token
            if (!token) throw new Error('Token not present')
            localStorage.setItem(this.tokenkey, token)
            this.httpClient.defaults.headers['Authorization'] = `Bearer ${token}`
        } catch (error) {
            if (error.isAxiosError) {
                const axiosError: AxiosError = error
                if (axiosError.response?.status == 400) throw new CredentialError('Credentials incorrect')
            }
            throw error
        }
    }
}
