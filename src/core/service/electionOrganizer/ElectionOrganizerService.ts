import { AxiosError, AxiosInstance } from 'axios'
import { apiRoute } from '../../routes/apiRoutes'
import { StatusCodes } from 'http-status-codes'
import { ChangePasswordInterface } from '../../../views/changePassword/ChangePassword'
import { PasswordIsNotValidError, PasswordDoesNotMatchError } from '../../models/customErrors'

export class ElectionOrganizerService {
    private _httpClient: AxiosInstance

    // Regex found athttps://www.thepolyglotdeveloper.com/2015/05/use-regex-to-test-password-strength-in-javascript/
    strongRegex = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])^(?=.{8,225}$).*') // One upper case letter, one lower case letter, one number, one special char, min length 8

    constructor(httpClient: AxiosInstance) {
        this._httpClient = httpClient
    }

    /**
     * Validates and change the password of an election organizer only if validation passes
     * @param newPasswords contains the passwords to be checked
     */
    async validateAndChangePassword(newPasswords: ChangePasswordInterface): Promise<void> | never {
        this.validatePassword(newPasswords)
        return await this.changePassword(newPasswords.password1)
    }

    private async changePassword(newPassword: string) {
        try {
            await this._httpClient.put(apiRoute.electionOrganizer, { newPassword })
        } catch (error) {
            if (error.isAxiosError) {
                const axiosError: AxiosError = error
                if (axiosError.response?.status === StatusCodes.BAD_REQUEST) {
                    throw new Error('Bad request')
                }
            }
            throw error
        }
    }

    private validatePassword(newPasswords: ChangePasswordInterface): string {
        this.checkPasswordMatch(newPasswords)

        const { password1 } = newPasswords
        this.checkPasswordRequirements(password1)
        return password1
    }

    private checkPasswordRequirements(password: string) {
        if (!this.strongRegex.test(password)) {
            throw new PasswordIsNotValidError('Password is not valid')
        }
    }

    private checkPasswordMatch(newPasswords: ChangePasswordInterface) {
        const { password1, password2 } = newPasswords
        if (password1 !== password2) {
            throw new PasswordDoesNotMatchError('Password does not match')
        }
    }
}
