import { IBallot } from 'core/models/ballot/IBallot'
import { IEligibleVoter } from 'core/models/ballot/IEligibleVoter'
import { IElectionBase } from './IElectionBase'

/**
 * Represents an election with eligible voters added, password and ballots.
 * This implementation is sensitive, and should not be provided to other parties then
 * the owner of the election
 */
export interface IElection extends IElectionBase {
    eligibleVoters?: IEligibleVoter[]
    password?: string
    ballots?: IBallot[]
}
