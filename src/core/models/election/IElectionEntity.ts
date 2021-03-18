import { IElectionDetails } from './IElection'

export interface IElection extends IElectionDetails {
    id: number
    electionOrganizer: number
}
