export type ValidationCode = string

export interface IVerificationPayload {
    code: ValidationCode | undefined
}
