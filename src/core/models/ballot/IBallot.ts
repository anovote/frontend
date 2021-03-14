import { BallotResultDisplay } from './BallotResultDisplay'
import { BallotType } from './BallotType'
import { ICandidateEntity } from './ICandidate'

/** Represents a ballot  */
export interface IBallot {
    title: string
    description?: string
    image?: string
    type: BallotType
    resultDisplayType: BallotResultDisplay
    displayResultCount: boolean
    resultDisplayTypeCount: number
    order: number
    candidates: Array<ICandidateEntity>
}

export interface IBallotInList extends IBallot {
    indexInList: number
}
