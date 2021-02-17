import { ElectionStatus } from './ElectionStatus'

export interface IElectionDetails {
    title: string
    description: string
    electionOrganizer: any
    openDate: Date
    closeDate: Date
    password?: string
    status: ElectionStatus
    isLocked: boolean
    isAutomatic: boolean
}
