import { IElection } from './IElection'

/**
 * Represents an election after it has been created.
 * By adding additional fields as id, electionOrganizer and dates
 */
export interface IElectionEntity extends IElection {
    id: number
    electionOrganizer: number
    createdAt: Date
    updatedAt: Date
}
