import { AxiosError, AxiosInstance } from 'axios'
import { CredentialError } from 'core/errors/CredentialsError'
import { DuplicateError } from 'core/errors/DuplicateError'
import { apiRoutes } from 'core/routes/apiRoutes'
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
            const response = await this.httpClient.post<RegistrationResponse>(apiRoutes.public.auth().register, {
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
                if (axiosError.response?.status == 400) this.handleBadRequestError(axiosError)
            }
            throw error
        }
    }

    private handleBadRequestError(axiosError: AxiosError) {
        const { validationMessages }: { validationMessages: string[] } = axiosError.response?.data
        if (validationMessages && validationMessages.includes('Email already exists')) {
            const message = validationMessages.find((val) => val === 'Email already exists') as string
            throw new DuplicateError(message)
        }
        throw new CredentialError('Credentials incorrect')
    }
}
