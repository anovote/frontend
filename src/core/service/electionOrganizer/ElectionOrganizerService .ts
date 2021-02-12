import { AxiosError, AxiosInstance } from 'axios'
import { apiRoute } from '../../routes/apiRoutes'
import { StatusCodes } from 'http-status-codes'

export class ElectionOrganizerService {
    private _httpClient: AxiosInstance

    constructor(httpClient: AxiosInstance) {
        this._httpClient = httpClient
    }

    async changePassword(newPassword: string) {
        try {
            await this._httpClient.put(apiRoute.electionOrganizer, { newPassword })
        } catch (error) {
            if (error.isAxiosError) {
                const axiosError: AxiosError = error
                if (axiosError.response?.status === StatusCodes.BAD_REQUEST) {
                    throw new Error('Bad request')
                }
            }
            console.log(error)
        }
    }
}
