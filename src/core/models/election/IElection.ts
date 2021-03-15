import { ElectionStatus } from './ElectionStatus'

export interface IElection {
    id: number
    electionOrganizer: number
    title: string
    description: string
    image?: string
    openDate?: Date
    closeDate?: Date
    password?: string
    status: ElectionStatus
    isLocked: boolean
    isAutomatic: boolean
}
