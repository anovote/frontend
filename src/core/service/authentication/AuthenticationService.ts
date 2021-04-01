import { AxiosError, AxiosInstance } from 'axios'
import { CredentialError } from 'core/errors/CredentialsError'
import { apiRoute } from 'core/routes/apiRoutes'
import { IStorage } from 'core/service/storage/IStorage'
import { StorageKeys } from 'core/service/storage/StorageKeys'
import { StatusCodes } from 'http-status-codes'
import jwt from 'jwt-decode'
import { AuthenticationDetails } from './AuthenticationDetails'
import { AuthenticationResponse } from './AuthenticationResponse'
import { IToken, IVoterToken } from './IToken'
export class AuthenticationService {
    private _httpClient: AxiosInstance
    private _storageService: IStorage<StorageKeys>

    constructor(httpClient: AxiosInstance, storage: IStorage<StorageKeys>) {
        this._httpClient = httpClient
        this._storageService = storage
    }

    /**
     * Authenticates an election organizer with email and password.
     */
    public async authenticateOrganizer({ email, password }: AuthenticationDetails): Promise<void> {
        try {
            const response = await this._httpClient.post<AuthenticationResponse>(apiRoute.authentication, {
                email,
                password,
            })
            const token = response.data.token
            if (!token) throw new Error('Token not present')
            this._storageService.setItem('ACCESS_TOKEN', token)
            this.setAuthorization(token)
        } catch (error) {
            if (error.isAxiosError) {
                const axiosError: AxiosError = error
                if (axiosError.response?.status === StatusCodes.BAD_REQUEST) {
                    throw new CredentialError('Credentials incorrect')
                }
            }
            throw error
        }
    }

    private setAuthorization(token: string) {
        // TODO Fix this to be a callable function on http client instead
        this._httpClient.defaults.headers['Authorization'] = `Bearer ${token}`
    }

    /**
     * Tries to login with the token stored in storage. If the token is valid
     * return true, else false.
     * This sets the authorization header for the http client if valid token
     */
    public tryLoginWithToken(): boolean {
        if (this.hasValidAuthorizationToken()) {
            const token = this.getAuthorizationToken()
            if (token) {
                this.setAuthorization(token)
                return true
            }
        }
        return false
    }

    /**
     * Returns the decoded token data if a token exists, else undefined
     */
    public getDecodedToken(): IToken | IVoterToken | undefined {
        const token = this.getAuthorizationToken()
        if (token) {
            return jwt<IToken>(token)
        }
    }

    /**
     * Returns the authorization token or null
     * @returns returns the authorization token or null
     */
    public getAuthorizationToken(): string | null {
        return this._storageService.getItem('ACCESS_TOKEN')
    }
    /**
     * Validates if we have a stored token, and the token is not expired
     */
    public hasValidAuthorizationToken(): boolean {
        let isValid = false
        const decodedToken = this.getDecodedToken()
        if (decodedToken) {
            // Divide Date.now by 1000 because it uses milliseconds since 1970 instead of seconds
            // since 1970 as JWT uses
            isValid = decodedToken.exp > Date.now() / 1000
        }
        return isValid
    }

    public logout(): void {
        localStorage.removeItem('ACCESS_TOKEN')
    }
}
