import { Rule } from 'antd/lib/form'
import i18next from 'i18next'

const PASSWORD_MAX_LENGTH = 255
const PASSWORD_MIN_LENGTH = 8
const strongRegex = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])^(?=.{8,225}$).*') // One upper case letter, one lower case letter, one number, one special char, min length 8

export const formRules: IFormRules = {
    password: [
        { max: PASSWORD_MAX_LENGTH, message: i18next.t('form:max-length', { maxLength: PASSWORD_MAX_LENGTH }) },
        { required: true, message: i18next.t('form:Remember password') },
        {
            min: PASSWORD_MIN_LENGTH,
            message: i18next.t('form:min-length', { minLength: PASSWORD_MIN_LENGTH }),
        },
        { pattern: strongRegex, message: i18next.t('form:Password validation') },
    ],
    rePassword: [
        { required: true, message: i18next.t('form:Remember to rewrite password') },
        // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
        ({ getFieldValue }) => ({
            validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                    return Promise.resolve()
                }
                return Promise.reject(new Error(i18next.t('form:Must be equal', { field: 'password' })))
            },
        }),
    ],
    email: [
        { required: true, message: i18next.t('form:Remember email') },
        { type: 'email', message: i18next.t('form:Email is not valid') },
    ],
    lastName: [{ required: true, message: i18next.t('form:Remember last name') }],
    firstName: [{ required: true, message: i18next.t('form:Remember first name') }],
}

interface IFormRules {
    password: Rule[]
    rePassword: Rule[]
    email: Rule[]
    firstName: Rule[]
    lastName: Rule[]
}
