import { IBallot } from './IBallot'

/**
 * Represents a ballot entity that is stored
 * somewhere. It is an extension of ballot and has
 * and ID, createdAt & updatedAt date
 */
export interface IBallotEntity extends IBallot {
    id: number
    createdAt: Date
    updatedAt: Date
}
