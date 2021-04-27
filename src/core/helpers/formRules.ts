import { Rule } from 'antd/lib/form'
import { TFunction } from 'i18next'

const PASSWORD_MAX_LENGTH = 255
const PASSWORD_MIN_LENGTH = 8
const strongRegex = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])^(?=.{8,225}$).*') // One upper case letter, one lower case letter, one number, one special char, min length 8

const oneLowerCase = new RegExp('(?=.*[a-z])')
const oneUpperCase = new RegExp('(?=.*[A-Z])')
const oneDigit = new RegExp('(?=.*[0-9])')
const oneSpecial = new RegExp('(?=.*[!@#$%^&*])')

/**
 * Defines a form rule set with appropriate messages
 * Due to the nature of i18next the translations are gotten asynchronous
 * @param i18n the translator instance
 * @returns A promise  with a form rule set
 */
export const formRules = (t: TFunction): IFormRules => {
    //await loadNamespaces('form')
    return {
        password: [
            { max: PASSWORD_MAX_LENGTH, message: t('form:max-length', { maxLength: PASSWORD_MAX_LENGTH }) },
            { required: true, message: t('form:Remember password') },
            {
                min: PASSWORD_MIN_LENGTH,
                message: t('form:min-length', { minLength: PASSWORD_MIN_LENGTH }),
            },
            { pattern: strongRegex, message: t('form:Password validation') },
            {
                pattern: oneLowerCase,
                message: t('form:Must have at least one', { field: 'lower case letter' }),
            },
            {
                pattern: oneUpperCase,
                message: t('form:Must have at least one', { field: 'upper case letter' }),
            },
            {
                pattern: oneDigit,
                message: t('form:Must have at least one', { field: 'digit' }),
            },
            {
                pattern: oneSpecial,
                message: t('form:Must have at least one', { field: 'special character (!@#$%^&*)' }),
            },
        ],
        rePassword: [
            { required: true, message: t('form:Remember to rewrite password') },
            // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
            ({ getFieldValue }) => ({
                validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                        return Promise.resolve()
                    }
                    return Promise.reject(new Error(t('form:Must be equal', { field: 'password' })))
                },
            }),
        ],
        email: [
            { required: true, message: t('form:Remember email') },
            { type: 'email', message: t('form:Email is not valid') },
        ],
        lastName: [{ required: true, message: t('form:Remember last name') }],
        firstName: [{ required: true, message: t('form:Remember first name') }],
    }
}

export interface IFormRules {
    password: Rule[]
    rePassword: Rule[]
    email: Rule[]
    firstName: Rule[]
    lastName: Rule[]
}
