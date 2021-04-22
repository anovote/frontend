import { BallotEntity } from 'core/models/ballot/BallotEntity'
import { IBallotEntity } from 'core/models/ballot/IBallotEntity'
import { ICandidate } from 'core/models/ballot/ICandidate'
import { ICandidateStats } from 'core/models/ballot/ICandidateStats'
import { IVoteStats } from 'core/models/ballot/IVoteStats'

export interface IVoteStatsWithCandidates {
    total: number
    votes: number
    blank: number
    candidates: Array<ICandidateWithVotes>
}

export interface ICandidateWithVotes extends ICandidateStats, ICandidate {}

/**
 * A ballot entity with vote stats for the ballot.
 */
export class BallotWithVotes extends BallotEntity {
    private _votes: IVoteStats = {
        blank: 0,
        votes: 0,
        total: 0,
        candidates: [],
    }
    constructor(ballot: IBallotEntity) {
        super(ballot)
    }

    /**
     * Update the vote stats for this ballot id
     * @param voteStats new vote stats for this ballot
     */
    updateVotes(voteStats: IVoteStats): void {
        this._votes = { ...this._votes, ...voteStats }
    }

    /**
     * Returns vote stats for this ballot.
     */
    get votes(): IVoteStats {
        return { ...this._votes }
    }

    /**
     * Return ballot vote stats with ballot candidate details
     * @returns returns vote stats for ballot with candidates votes and name
     */
    getVoteStatsWithCandidates(): IVoteStatsWithCandidates {
        const candidates = this._votes.candidates.map((voteCandidate) => {
            const candidate = this.candidates.find((candidate) => candidate.id === voteCandidate.id)
            const candidateVotes = {
                candidate: '...',
                ...voteCandidate,
            }
            if (candidate) candidateVotes.candidate = candidate.candidate
            return candidateVotes
        })

        return {
            ...this._votes,
            candidates: candidates,
        }
    }

    /**
     *  Returns the current leading candidate for a ballot. If there are no available leaders,
     * undefined is returned.
     * @param stats ballot stats for the ballot
     * @param ballot ballot to get leader of
     * @returns returns current leader of the ballot or undefined
     */
    getBallotLeader(): string | undefined {
        let votes = -1
        let leadingCandidate
        for (const candidate of this._votes.candidates) {
            if (candidate.votes > votes) {
                const candidateEntity = this.candidates.find((ballotCandidate) => candidate.id === ballotCandidate.id)
                if (candidateEntity) {
                    votes = candidate.votes
                    leadingCandidate = candidateEntity.candidate
                }
            }
        }

        return leadingCandidate
    }
}
