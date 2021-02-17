import { AxiosError, AxiosInstance } from 'axios'
import { apiRoute } from '../../routes/apiRoutes'
import { AuthenticationDetails } from './AuthenticationDetails'
import { AuthenticationResponse } from './AuthenticationResponse'
import { CredentialError } from './CredentialsError'

export class AuthenticationService {
    private _httpClient: AxiosInstance
    private _tokenkey = 'ACCESS_TOKEN'

    constructor(httpClient: AxiosInstance) {
        this._httpClient = httpClient
    }

    public async authenticateOrganizer({ email, password }: AuthenticationDetails): Promise<void> {
        try {
            const response = await this._httpClient.post<AuthenticationResponse>(apiRoute.authentication, {
                email,
                password,
            })
            const token = response.data.token
            if (!token) throw new Error('Token not present')
            localStorage.setItem(this._tokenkey, token)
            this._httpClient.defaults.headers['Authorization'] = `Bearer ${token}`
        } catch (error) {
            if (error.isAxiosError) {
                const axiosError: AxiosError = error
                if (axiosError.response?.status == 400) throw new CredentialError('Credentials incorrect')
            }
            throw error
        }
    }

    // !TODO Implement
    public logout(): void {
        return
    }
}
