import { BallotVoteStats } from 'core/models/ballot/BallotVoteStats'
import { IBallotStats } from 'core/models/ballot/IBallotStats'
import { ICandidateStats } from 'core/models/ballot/ICandidateStats'
import { freshBallots } from './ballotsDummyData'

const candidateStatsUno: ICandidateStats = {
    candidate: 'Bjarne Andersen',
    votes: 13,
}
const candidateStatsDos: ICandidateStats = {
    candidate: 'Finn Torgersen',
    votes: 76,
}

const ballotStats: IBallotStats = {
    total: 91,
    votes: 89,
    blank: 2,
    candidates: [candidateStatsUno, candidateStatsDos],
}

export const voteStats = new BallotVoteStats(freshBallots[0].id, ballotStats)
