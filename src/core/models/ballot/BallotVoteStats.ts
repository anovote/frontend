import { IBallotStats } from './IBallotStats'
import { ICandidateStats } from './ICandidateStats'
/**
 * Holds vote data for a given ballot.
 * Total votes, votes given to a candidate and blank votes. A list of all candidates for
 * the given ballot with vote status for each candidate
 */
export class BallotVoteStats {
    private _ballotStats: IBallotStats

    private _ballotId: number

    constructor(ballotId: number, ballotStats: IBallotStats) {
        this._ballotId = ballotId
        this._ballotStats = ballotStats
    }
    get ballotId(): number {
        return this._ballotId
    }

    get total(): number {
        return this._ballotStats.stats.total
    }

    get votes(): number {
        return this._ballotStats.stats.votes
    }

    get blank(): number {
        return this._ballotStats.stats.blank
    }

    get candidates(): Array<ICandidateStats> {
        return this._ballotStats.stats.candidates
    }
}
