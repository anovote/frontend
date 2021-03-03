/**
 * Represents the token issued by the backend
 */
export interface IToken {
    isOrganizer: boolean
    iat: number
    exp: number
}
