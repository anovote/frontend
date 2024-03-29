/**
 * Represents the token issued by the backend
 */
export interface IToken {
    id: number
    organizer: boolean
    iat: number
    exp: number
}

export interface IVoterToken extends IToken {
    electionId: number
}
