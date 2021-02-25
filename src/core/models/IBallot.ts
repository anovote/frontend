import { ICandidate } from './ICandidate'

/** Represents a ballot  */
export interface IBallot {
    title: string
    description?: string
    image?: string
    resultDisplayType: number
    resultDisplayCount: number
    status: number
    candidates: Array<ICandidate>
}
