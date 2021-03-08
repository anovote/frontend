import { ElectionStatus } from './ElectionStatus'

export interface IElectionDetails {
    title: string
    description: string
    openDate: Date
    closeDate: Date
    eligibleVoters: { email: string }[]
    password?: string
    status: ElectionStatus
    isLocked: boolean
    isAutomatic: boolean
}
