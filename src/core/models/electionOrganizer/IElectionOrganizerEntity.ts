import { IElectionOrganizer } from './IElectionOrganizer'

export interface IElectionOrganizerEntity extends IElectionOrganizer {
    id: number
    createdAt: Date
    updatedAt: Date
}
