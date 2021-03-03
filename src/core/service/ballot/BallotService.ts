import { AxiosInstance, AxiosResponse } from 'axios'
import { BallotEntity } from 'core/models/ballot/BallotEntity'
import { IBallot } from 'core/models/ballot/IBallot'
import { IBallotEntity } from 'core/models/ballot/IBallotEntity'
import { apiRoute } from 'core/routes/apiRoutes'
import { StatusCodes } from 'http-status-codes'

export default class BallotService {
    private readonly _httpClient: AxiosInstance

    constructor(httpClient: AxiosInstance) {
        this._httpClient = httpClient
    }

    async getBallotsForElection(electionId: number): Promise<IBallotEntity[]> {
        const url = this.getBallotsUrl(electionId)
        const response = await this._httpClient.get<BallotEntity[]>(url)
        this.validateResponse(response)
        return response.data
    }

    private validateResponse(response: AxiosResponse) {
        if (response.status !== StatusCodes.OK) {
            throw new Error('request error')
        }
    }

    async updateBallots(electionId: number, ballots: IBallot[]): Promise<IBallotEntity[]> {
        const url = this.getBallotsUrl(electionId)
        const response = await this._httpClient.put<BallotEntity[]>(url, ballots)
        this.validateResponse(response)
        return response.data
    }

    private getBallotsUrl(electionId: number) {
        return apiRoute.createElection + `/${electionId}` + apiRoute.ballots
    }
}
