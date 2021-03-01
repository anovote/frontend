import { BallotResultDisplay } from './BallotResultDisplay'
import { BallotStatus } from './BallotStatus'
import { BallotType } from './BallotType'
import { ICandidate } from './ICandidate'

/** Represents a ballot  */
export interface IBallot {
    title: string
    description?: string
    image?: string
    resultDisplayType: BallotResultDisplay
    resultDisplayCount: number
    type: BallotType
    status: BallotStatus
    candidates: Array<ICandidate>
}
