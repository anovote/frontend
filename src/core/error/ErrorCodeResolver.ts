import { TFunction } from 'react-i18next'
import { ErrorCode } from './ErrorCodes'
interface ICodeMessage {
    code: string
    message: (t: TFunction<string[]>) => string
}
type CodeMapping = Array<ICodeMessage>
/**
 * Error code resolver is a helper class resolving error codes to human readable error messages
 * translated current language using i18next translation as resolver.
 */
export class ErrorCodeResolver {
    private _translator: TFunction<string[]>

    private _codeMappings: CodeMapping = [
        { code: ErrorCode.alreadyVerified, message: (t) => t('error:Already verified') },
        { code: ErrorCode.electionCodeMissing, message: (t) => t('error:Missing election code') },
        { code: ErrorCode.electionFinished, message: (t) => t('error:Election is finished') },
        { code: ErrorCode.electionNotExist, message: (t) => t('error:Election do not exist') },
        { code: ErrorCode.unexpected, message: (t) => t('error:Unexpected') },
        { code: ErrorCode.verificationCodeInvalid, message: (t) => t('error:Verification code is invalid') },
        { code: ErrorCode.voterIdentificationMissing, message: (t) => t('error:Voter identification is missing') },
        { code: ErrorCode.verificationCodeMissing, message: (t) => t('error:Verification code is missing') },
        { code: ErrorCode.voterNotExist, message: (t) => t('error:Identification not exist for election') },
        { code: ErrorCode.electionDuplicate, message: (t) => t('error:Duplicate election') },
        { code: ErrorCode.electionRoomNotExist, message: (t) => t('error:Election room not exist') },
        { code: ErrorCode.ballotNotExist, message: (t) => t('error:Ballot not exist') },
        { code: ErrorCode.alreadyVotedOnBallot, message: (t) => t('error:Already voted on ballot') },
        { code: ErrorCode.ballotArchived, message: (t) => t('error:Ballot is archived') },
    ]

    constructor(t: TFunction<string[]>) {
        this._translator = t
    }

    /**
     * Returns the error message for the provided code, if the code cant be
     * resolved to a message, a default unexpected error message is returned.
     * @param code error code to get error message for
     * @returns return error message for code, or default message
     */
    resolve(code: string): string {
        const codeMessage = this._codeMappings.find((e) => e.code === code)
        return codeMessage ? codeMessage.message(this._translator) : this._translator('error.Unexpected')
    }
}
