import { BackendAPI } from 'core/api'
import { IBallotStats } from 'core/models/ballot/IBallotStats'
import { apiRoutes } from 'core/routes/apiRoutes'
import { StatusCodes } from 'http-status-codes'

export const fetchElectionStats = async (electionId: number): Promise<IBallotStats[]> => {
    const url = `${apiRoutes.admin.election().byId(electionId).stats}`
    try {
        const response = await BackendAPI.get<IBallotStats[]>(url)
        if (response.status !== StatusCodes.OK) {
            return []
        }

        const stats = response.data
        return stats
    } catch (err) {
        console.log(err.message)
        return []
    }
}
