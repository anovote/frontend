import { ElectionOrganizerService } from './ElectionOrganizerService'
import { PasswordDoesNotMatchError, PasswordIsNotValidError } from '../../models/customErrors'
import { ChangePasswordInterface } from '../../../views/changePassword/ChangePassword'
import axios, { AxiosInstance } from 'axios'
import RandExp from 'randexp'

const axiosMock: jest.Mocked<AxiosInstance> = (axios as unknown) as jest.Mocked<AxiosInstance>
jest.mock('axios')
let passwords: ChangePasswordInterface

const es = new ElectionOrganizerService(axiosMock)
it('should resolve if password matches criteria', async () => {
    let password = '!Dest123'
    passwords = { password1: password, password2: password }
    await expect(es.validateAndChangePassword(passwords)).resolves.toBe(undefined)
})
it('should throw password is not valid if password does not match criteria', async () => {
    let password = '1Dest123'
    passwords = { password1: password, password2: password }
    await expect(es.validateAndChangePassword(passwords)).rejects.toThrowError(PasswordIsNotValidError)
})

it('throws error if password is not equal', async () => {
    const password1 = 'notEqu1!s'
    let password2 = 'toTh!5sks'
    passwords = { password1, password2 }
    await expect(es.validateAndChangePassword(passwords)).rejects.toThrowError(PasswordDoesNotMatchError)
})
it('resolves if password is equal', async () => {
    const password1 = '3quAl!78'
    const password2 = password1
    passwords = { password1, password2 }
    await expect(es.validateAndChangePassword(passwords)).resolves.toBe(undefined)
})

it('should throw PasswordIsNotValidError if password is empty or less than 8', async () => {
    let password1 = '',
        password2 = ''
    passwords = { password1, password2 }
    await expect(es.validateAndChangePassword(passwords)).rejects.toThrowError(PasswordIsNotValidError)
    password1 = '1Dest1'
    password2 = password1
    await expect(es.validateAndChangePassword(passwords)).rejects.toThrowError(PasswordIsNotValidError)
    passwords = { password1, password2 }
})
//http://fent.github.io/randexp.js/#r=%5Ba-zA-Z1-9%21@%23%25%5E%26*%5D%7B226%7D&i
it('should throw PasswordIsNotValidError if password is longer than 225 characters', async () => {
    let password = new RandExp('[a-zA-Z1-9!@#%^&*]{226}').gen()
    passwords = { password1: password, password2: password }
    await expect(es.validateAndChangePassword(passwords)).rejects.toThrowError(PasswordIsNotValidError)
})

it('should resolve if password is between 8 and 225 characters', async () => {
    let password = new RandExp('[a-zA-Z1-9!@#%^&*]{225}').gen()
    passwords = { password1: password, password2: password }
    await expect(es.validateAndChangePassword(passwords)).resolves.toBe(undefined)

    password = new RandExp('[a-z]{1}[A-Z]{1}[1-9]{1}[!@#%^&*]{1}[a-zA-Z1-9!@#%^&*]{4}').gen()
    passwords = { password1: password, password2: password }
    await expect(es.validateAndChangePassword(passwords)).resolves.toBe(undefined)

    password = new RandExp('[a-z]{1}[A-Z]{1}[1-9]{1}[!@#%^&*]{1}[a-zA-Z1-9!@#%^&*]{4, 225}').gen()
    passwords = { password1: password, password2: password }
    await expect(es.validateAndChangePassword(passwords)).resolves.toBe(undefined)
})