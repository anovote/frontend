import { IBallotStats } from 'core/models/ballot/IBallotStats'
import { ICandidateStats } from 'core/models/ballot/ICandidateStats'

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

export const voteStats: IBallotStats[] = [
    {
        total: 91,
        votes: 89,
        blank: 2,
        candidates: [candidateStatsUno, candidateStatsDos],
    },
    {
        total: 191,
        votes: 179,
        blank: 12,
        candidates: [
            {
                candidate: 'Tom Petty',
                votes: 145,
            },
            {
                candidate: 'John Peter',
                votes: 46,
            },
        ],
    },
]
