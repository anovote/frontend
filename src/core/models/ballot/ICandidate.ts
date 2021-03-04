/**
 * Represents a candidate that can be added to a ballot
 */
export interface ICandidate {
    candidate: string
}

export interface ICandidateEntity extends ICandidate {
    id: number
}
