import { IBallot } from 'core/models/ballot/IBallot'
import { IEligibleVoter } from 'core/models/ballot/IEligibleVoter'
import { ElectionStatus } from './ElectionStatus'

export interface IElection {
    title: string
    description: string
    openDate?: Date
    closeDate?: Date
    eligibleVoters?: IEligibleVoter[]
    password?: string
    status: ElectionStatus
    isLocked: boolean
    isAutomatic: boolean
    ballots?: IBallot[]
}
