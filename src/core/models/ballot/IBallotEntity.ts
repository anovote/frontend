import { BallotStatus } from './BallotStatus'
import { IBallot } from './IBallot'
import { ICandidateEntity } from './ICandidate'

/**
 * Represents a ballot entity that is stored
 * somewhere. It is an extension of ballot and has
 * and ID, createdAt & updatedAt date
 */
export interface IBallotEntity extends IBallot {
    id: number
    status: BallotStatus
    createdAt: Date
    updatedAt: Date
    candidates: Array<ICandidateEntity>
}
