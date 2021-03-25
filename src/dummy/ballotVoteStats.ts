import { IBallotStats } from 'core/models/ballot/IBallotStats'
import { ICandidateStats } from 'core/models/ballot/ICandidateStats'

const candidateStatsUno: ICandidateStats = {
    id: 1,
    votes: 13,
}
const candidateStatsDos: ICandidateStats = {
    id: 2,
    votes: 76,
}

const ballotStats: IBallotStats = {
    ballotId: 1,
    stats: {
        total: 91,
        votes: 89,
        blank: 2,
        candidates: [candidateStatsUno, candidateStatsDos],
    },
}

export const voteStats: IBallotStats[] = [
    {
        ballotId: 1,
        stats: {
            total: 91,
            votes: 89,
            blank: 2,
            candidates: [candidateStatsUno, candidateStatsDos],
        },
    },
    {
        ballotId: 2,
        stats: {
            total: 191,
            votes: 179,
            blank: 12,
            candidates: [
                {
                    id: 1,
                    votes: 145,
                },
                {
                    id: 2,
                    votes: 46,
                },
            ],
        },
    },
]
