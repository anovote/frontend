import { AxiosError, AxiosInstance } from 'axios'
import { InvalidEmail, PasswordDoesNotMatchError, PasswordIsNotValidError } from 'core/errors/customErrors'
import { isValidEmail } from 'core/helpers/validation'
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
     * Updates the details for an given election organizer on the server.
     * @param organizer the organizer to update details for
     * @returns the newly updated organizer details
     */
    async updateDetails(organizer: IElectionOrganizerEntity): Promise<IElectionOrganizerEntity> {
        let response

        try {
            response = await this._httpClient.put(apiRoutes.admin.organizer().byId(organizer.id).update, {
                ...organizer,
            })
        } catch (error) {
            if (error.isAxiosError) {
                const axiosError: AxiosError = error
                if (axiosError.response?.status === StatusCodes.BAD_REQUEST) {
                    throw new Error('Bad request')
                }
            }
            throw error
        }
        return response.data
    }

    /**
     * Changes the email for the organizer if the email is a valid address
     * @param organizer the organizer to update the email for
     * @returns the updated organizer entity
     */
    async changeEmail(organizer: IElectionOrganizerEntity): Promise<IElectionOrganizerEntity> {
        const sanitized = this.validateEmail(organizer.email)

        return this.updateDetails({ ...organizer, email: sanitized })
    }

    /**
     * Changes the password for the organizer after checking if the new passwords,
     * are validated as good passwords.
     * @param organizer the organizer object to change password to
     * @param newPasswords the new passwords the organizer wants to change to
     * @returns the updated organizer
     */
    async changePassword(
        organizer: IElectionOrganizerEntity,
        newPasswords: { password1: string; password2: string },
    ): Promise<IElectionOrganizerEntity> {
        const checkedPassword = this.validatePassword(newPasswords)

        organizer.password = checkedPassword

        return await this.updateDetails({ ...organizer })
    }

    private validateEmail(newEmail: string): string {
        const lowercaseMail = newEmail.toLowerCase()
        const trimmedMail = lowercaseMail.trim()

        if (!isValidEmail(trimmedMail)) {
            throw new InvalidEmail()
        }
        return trimmedMail
    }

    private validatePassword(newPasswords: { password1: string; password2: string }): string {
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

    private checkPasswordMatch(newPasswords: { password1: string; password2: string }) {
        const { password1, password2 } = newPasswords
        if (password1 !== password2) {
            throw new PasswordDoesNotMatchError('Password does not match')
        }
    }
}
