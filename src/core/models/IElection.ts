import { IElectionDetails } from 'core/service/election/IElectionDetails'

export interface IElection extends IElectionDetails {
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
