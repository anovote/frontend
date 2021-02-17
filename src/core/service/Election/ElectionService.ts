import { AxiosError, AxiosInstance } from 'axios'
import { apiRroute } from '../../routes/apiRoutes'
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
        electionOrganizer,
        openDate,
        closeDate,
        password,
        status,
        isLocked,
        isAutomatic,
    }: IElectionDetails): Promise<void> {
        try {
            const response = await this.httpClient.post<IElectionResponse>(apiRroute.createElection, {
                title,
                description,
                electionOrganizer,
                openDate,
                closeDate,
                password,
                status,
                isLocked,
                isAutomatic,
            })
            console.log(response)
        } catch (error) {
            if (error.isAxiosError) {
                const axiosError: AxiosError = error
                if (axiosError.response?.status == 400) {
                    throw new CredentialError('Credentials incorrect')
                }
                throw error
            }
        }
    }
}
