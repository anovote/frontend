import { BackendAPI } from 'core/api'
import { IBallotStats } from 'core/models/ballot/IBallotStats'
import { getAdminRoute } from 'core/routes/siteRoutes'
import { StatusCodes } from 'http-status-codes'

export const fetchElectionStats = async (electionId: number): Promise<IBallotStats[]> => {
    const url = `${getAdminRoute().elections.view}/${electionId}/stats`
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
