import { ICandidate } from './ICandidate'

/**
 * Represents a candidate with vote results for the ballot
 * the candidate is belonging to.
 */
export interface ICandidateStats extends ICandidate {
    votes: number
}
