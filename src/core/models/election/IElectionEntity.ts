import { IElection } from 'core/models/election/IElection'

export interface IElectionEntity extends IElection {
    id: number
    electionOrganizer: number
    //title: string
    //description: string
    //image?: string
    //openDate?: Date
    //closeDate?: Date
    //password?: string
    //status: ElectionStatus
    //isLocked: boolean
    //isAutomatic: boolean
}
