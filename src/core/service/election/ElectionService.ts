import { AxiosError, AxiosInstance } from 'axios'
import { StatusCodes } from 'http-status-codes'
import { apiRoute } from 'core/routes/apiRoutes'
import { AuthorizationError } from 'core/errors/AuthorizationError'
import { IElection } from 'core/models/election/IElection'

export class ElectionService {
    private httpClient: AxiosInstance

    constructor(httpClient: AxiosInstance) {
        this.httpClient = httpClient
    }

    public async createElection({
        title,
        description,
        openDate,
        closeDate,
        eligibleVoters,
        password,
        status,
        isLocked,
        isAutomatic,
    }: IElection): Promise<void> {
        try {
            await this.httpClient.post(apiRoute.createElection, {
                title,
                description,
                openDate,
                closeDate,
                eligibleVoters,
                password,
                status,
                isLocked,
                isAutomatic,
            })
            // TODO handle what to do with the response
        } catch (error) {
            if (error.isAxiosError) {
                const axiosError: AxiosError = error
                if (axiosError.response?.status === StatusCodes.UNAUTHORIZED) {
                    throw new AuthorizationError('You need to be logged in to create an election!')
                }
                if (axiosError.response?.status === StatusCodes.INTERNAL_SERVER_ERROR) {
                    throw new Error('Error at the server, drink some Tea and wait')
                }
            }
            throw error
        }
    }
}
