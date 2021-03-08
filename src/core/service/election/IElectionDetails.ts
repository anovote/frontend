import { IEligibleVoter } from 'components/importVoters/EligibleVotersTable'
import { ElectionStatus } from './ElectionStatus'

export interface IElectionDetails {
    title: string
    description: string
    openDate: Date
    closeDate: Date
    eligibleVoters: IEligibleVoter[]
    password?: string
    status: ElectionStatus
    isLocked: boolean
    isAutomatic: boolean
}
