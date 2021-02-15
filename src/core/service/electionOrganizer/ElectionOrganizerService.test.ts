import { ElectionOrganizerService } from './ElectionOrganizerService'
import { PasswordDoesNotMatchError, PasswordIsNotValidError } from '../../models/customErrors'
import { ChangePasswordInterface } from '../../../views/changePassword/ChangePassword'
import axios, { AxiosInstance } from 'axios'
const axiosMock: jest.Mocked<AxiosInstance> = (axios as unknown) as jest.Mocked<AxiosInstance>
jest.mock('axios')
let passwords: ChangePasswordInterface

const es = new ElectionOrganizerService(axiosMock)
test('Check that password matches criteria', async () => {
    let password = '!Dest123'
    passwords = { password1: password, password2: password }
    await expect(es.validateAndChangePassword(passwords)).resolves.toBe(undefined)
    password = '1Dest123'
    passwords = { password1: password, password2: password }
    await expect(es.validateAndChangePassword(passwords)).rejects.toThrowError(PasswordIsNotValidError)
})

test('Check that password is equal', async () => {
    let password1 = 'notEqu1!s'
    let password2 = 'toTh!5sks'
    passwords = { password1, password2 }
    await expect(es.validateAndChangePassword(passwords)).rejects.toThrowError(PasswordDoesNotMatchError)
    password2 = password1
    passwords = { password1, password2 }
    await expect(es.validateAndChangePassword(passwords)).resolves.toBe(undefined)
})

test('Check password is empty or less than 8', async () => {
    let password1 = '',
        password2 = ''
    passwords = { password1, password2 }
    await expect(es.validateAndChangePassword(passwords)).rejects.toThrowError(PasswordIsNotValidError)
    password1 = '1Dest1'
    password2 = password2
    await expect(es.validateAndChangePassword(passwords)).rejects.toThrowError(PasswordIsNotValidError)
    passwords = { password1, password2 }
})
