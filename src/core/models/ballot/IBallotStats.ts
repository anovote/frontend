import { ICandidateStats } from './ICandidateStats'

/**
 * Represents ballot stats for a particular ballot
 * It holds count of total votes, votes that is cast on a candidate,
 * blank votes and a list of all candidate stats
 */
export interface IBallotStats {
    ballotId: number
    stats: {
        total: number
        votes: number
        blank: number
        candidates: Array<ICandidateStats>
    }
}
