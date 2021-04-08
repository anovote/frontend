import { AxiosError, AxiosInstance } from 'axios'
import { AuthorizationError } from 'core/errors/AuthorizationError'
import { IElection } from 'core/models/election/IElection'
import { IElectionBase } from 'core/models/election/IElectionBase'
import { IElectionEntity } from 'core/models/election/IElectionEntity'
import { apiRoutes } from 'core/routes/apiRoutes'
import { StatusCodes } from 'http-status-codes'

export class ElectionService {
    private httpClient: AxiosInstance
    private electionRoute = apiRoutes.admin.election()

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
        ballots,
    }: IElection): Promise<void> {
        try {
            await this.httpClient.post(this.electionRoute.create, {
                title,
                description,
                openDate,
                closeDate,
                eligibleVoters,
                password,
                status,
                isLocked,
                isAutomatic,
                ballots,
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

    public async getAllElection(): Promise<IElectionEntity[]> {
        try {
            return (await this.httpClient.get(this.electionRoute.get)).data
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

    public async getElection(electionId: number): Promise<IElectionEntity> {
        try {
            return (await this.httpClient.get(this.electionRoute.byId(electionId).get)).data
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

    public async updateElection(election: IElectionEntity): Promise<IElectionEntity> {
        console.log(election)
        try {
            return (
                await this.httpClient.put<IElectionEntity>(this.electionRoute.byId(election.id).update, { election })
            ).data
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

    /**
     * Tries to fetch the election base details for the given election id and returns it.
     * If it fails an error is thrown
     * @param electionId the id of the election to get details from
     * @returns returns election data or throws error
     */
    public async getElectionForVoter(electionId: number): Promise<IElectionBase> {
        try {
            return (await this.httpClient.get<IElectionBase>(apiRoutes.voter.election().byId(electionId).get)).data
        } catch (error) {
            if (error.isAxiosError) {
                const axiosError: AxiosError = error
                if (axiosError.response?.status === StatusCodes.UNAUTHORIZED) {
                    throw new AuthorizationError('You do not have a valid token to get details for this election')
                }
                if (axiosError.response?.status === StatusCodes.INTERNAL_SERVER_ERROR) {
                    throw new Error('Server error, try again later')
                }
            }
            throw error
        }
    }

    //private handleError(error: Error | AxiosError) {}
}
