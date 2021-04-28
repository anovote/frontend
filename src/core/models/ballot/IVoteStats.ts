import { ICandidateStats } from './ICandidateStats'

export interface IVoteStats {
    total: number
    votes: number
    blank: number
    candidates: Array<ICandidateStats>
}
