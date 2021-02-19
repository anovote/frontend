import { AxiosInstance } from 'axios'
import { apiRoute } from '../../routes/apiRoutes'
import { IElectionDetails } from './IElectionDetails'

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
        await this.httpClient.post(apiRoute.createElection, {
            title,
            description,
            openDate,
            closeDate,
            password,
            status,
            isLocked,
            isAutomatic,
        })
        // TODO handle what to do with the response
    }
}
