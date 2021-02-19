import { AxiosError, AxiosInstance } from 'axios'
import { StatusCodes } from 'http-status-codes'
import { apiRoute } from '../../routes/apiRoutes'
import { CredentialError } from '../authentication/CredentialsError'
import { IElectionDetails } from './IElectionDetails'
import { IElectionResponse } from './IElectionResponse'

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
        password,
        status,
        isLocked,
        isAutomatic,
    }: IElectionDetails): Promise<void> {
        await this.httpClient.post<IElectionResponse>(apiRoute.createElection, {
            title,
            description,
            openDate,
            closeDate,
            password,
            status,
            isLocked,
            isAutomatic,
        })
        // TODO handle to do with the response
    }
}
