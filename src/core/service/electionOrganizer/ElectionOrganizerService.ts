import { AxiosError, AxiosInstance } from 'axios'
import { ChangePasswordInterface } from 'containers/forms/profile/ChangePasswordForm'
import { InvalidEmail, PasswordDoesNotMatchError, PasswordIsNotValidError } from 'core/errors/customErrors'
import { IElectionOrganizerEntity } from 'core/models/electionOrganizer/IElectionOrganizerEntity'
import { apiRoutes } from 'core/routes/apiRoutes'
import { StatusCodes } from 'http-status-codes'

export class ElectionOrganizerService {
    private _httpClient: AxiosInstance

    // Regex found athttps://www.thepolyglotdeveloper.com/2015/05/use-regex-to-test-password-strength-in-javascript/
    strongRegex = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])^(?=.{8,225}$).*') // One upper case letter, one lower case letter, one number, one special char, min length 8

    constructor(httpClient: AxiosInstance) {
        this._httpClient = httpClient
    }

    /**
     * Fetches the organizer with the given id
     * @param organizerId the id of the organizer to fetch
     * @returns an object with the election organizer, or nothing
     */
    async fetchOrganizer(): Promise<IElectionOrganizerEntity | void> {
        try {
            const response = await this._httpClient.get(apiRoutes.admin.organizer().get)

            if (response) {
                const { data } = response
                const organizer = data
                return organizer
            }
        } catch (error) {
            throw new Error('Something happened')
        }
    }

    /**
     * Validates and change the password of an election organizer only if validation passes
     * @param newPasswords contains the passwords to be checked
     */
    async validateAndChangePassword(newPasswords: ChangePasswordInterface): Promise<void> | never {
        this.validatePassword(newPasswords)
        return await this.changePassword(newPasswords.password1)
    }

    /**
     * If the validated email is successfully validated, a request for changing the
     * email would be sent.
     * @param newEmail the new email the user want to change to
     * @returns the answer of the request, true if successful
     */
    async changeEmail(newEmail: string): Promise<boolean> {
        const sanitized = this.validateEmail(newEmail)
        try {
            await this._httpClient.put(apiRoutes.admin.organizer().changeEmail, { newEmail: sanitized })
            return true
        } catch (error) {
            if (error.isAxiosError) {
                const axiosError: AxiosError = error
                if (axiosError.response?.status === StatusCodes.BAD_REQUEST) {
                    throw new Error('Bad request')
                }
            }
            throw error
        }
        return false
    }

    private async changePassword(newPassword: string) {
        try {
            await this._httpClient.put(apiRoutes.admin.organizer().changePassword, { newPassword })
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

    private validateEmail(newEmail: string): string {
        const lowercaseMail = newEmail.toLowerCase()
        const trimmedMail = lowercaseMail.trim()
        const emailRegex = new RegExp(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)
        if (!emailRegex.test(trimmedMail)) {
            throw new InvalidEmail()
        }
        return trimmedMail
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
