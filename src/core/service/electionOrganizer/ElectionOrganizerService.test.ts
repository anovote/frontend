import axios, { AxiosInstance } from 'axios'
import { PasswordDoesNotMatchError, PasswordIsNotValidError } from 'core/errors/customErrors'
import { IElectionOrganizerEntity } from 'core/models/electionOrganizer/IElectionOrganizerEntity'
import RandExp from 'randexp'
import { ElectionOrganizerService } from './ElectionOrganizerService'

const axiosMock: jest.Mocked<AxiosInstance> = (axios as unknown) as jest.Mocked<AxiosInstance>
jest.mock('axios')

let passwords: { password1: string; password2: string }
const organizer: IElectionOrganizerEntity = {
    id: 1,
    firstName: 'Test',
    lastName: 'Organizer',
    email: 'testOrg@example.com',
    password: 'test',
    createdAt: new Date(),
    updatedAt: new Date(),
}

const es = new ElectionOrganizerService(axiosMock)
it('should resolve if password matches criteria', async () => {
    const password = '!Dest123'
    passwords = { password1: password, password2: password }

    expect(es.validatePassword(passwords)).toBe('!Dest123')
})
it('should throw password is not valid if password does not match criteria', () => {
    const password = '1Dest123'
    passwords = { password1: password, password2: password }
    expect(() => es.validatePassword(passwords)).toThrowError(PasswordIsNotValidError)
})

it('throws error if password is not equal', () => {
    const password1 = 'notEqu1!s'
    const password2 = 'toTh!5sks'
    passwords = { password1, password2 }
    expect(() => es.validatePassword(passwords)).toThrowError(PasswordDoesNotMatchError)
})
it('resolves if password is equal', () => {
    const password1 = '3quAl!78'
    const password2 = password1
    passwords = { password1, password2 }
    expect(es.validatePassword(passwords)).toBe(password1)
})

it('should throw PasswordIsNotValidError if password is empty or less than 8', () => {
    let password1 = '',
        password2 = ''
    passwords = { password1, password2 }
    expect(() => es.validatePassword(passwords)).toThrowError(PasswordIsNotValidError)
    password1 = '1Dest1'
    password2 = password1
    expect(() => es.validatePassword(passwords)).toThrowError(PasswordIsNotValidError)
    passwords = { password1, password2 }
})
//http://fent.github.io/randexp.js/#r=%5Ba-zA-Z1-9%21@%23%25%5E%26*%5D%7B226%7D&i
it('should throw PasswordIsNotValidError if password is longer than 225 characters', () => {
    const password = new RandExp('[a-zA-Z1-9!@#%^&*]{226}').gen()
    passwords = { password1: password, password2: password }
    expect(() => es.validatePassword(passwords)).toThrowError(PasswordIsNotValidError)
})

it('should resolve if password is between 8 and 225 characters', () => {
    let password = new RandExp('[a-zA-Z1-9!@#%^&*]{225}').gen()
    passwords = { password1: password, password2: password }
    expect(es.validatePassword(passwords)).toBe(password)

    password = new RandExp('[a-z]{1}[A-Z]{1}[1-9]{1}[!@#%^&*]{1}[a-zA-Z1-9!@#%^&*]{4}').gen()
    passwords = { password1: password, password2: password }
    expect(es.validatePassword(passwords)).toBe(password)

    password = new RandExp('[a-z]{1}[A-Z]{1}[1-9]{1}[!@#%^&*]{1}[a-zA-Z1-9!@#%^&*]{4, 225}').gen()
    passwords = { password1: password, password2: password }
    expect(es.validatePassword(passwords)).toBe(password)
})
