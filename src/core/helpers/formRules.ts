import { Rule } from 'antd/lib/form'
import i18n from 'i18n'

i18n.loadNamespaces('form')

const PASSWORD_MAX_LENGTH = 255
const PASSWORD_MIN_LENGTH = 8
const strongRegex = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])^(?=.{8,225}$).*') // One upper case letter, one lower case letter, one number, one special char, min length 8

const oneLowerCase = new RegExp('(?=.*[a-z]) ')
const oneUpperCase = new RegExp('(?=.*[A-Z])')
const oneDigit = new RegExp('(?=.*[0-9])')
const oneSpecial = new RegExp('(?=.*[!@#$%^&*])')

const rules: IFormRules = {
    password: [
        { max: PASSWORD_MAX_LENGTH, message: i18n.t('form:max-length', { maxLength: PASSWORD_MAX_LENGTH }) },
        { required: true, message: i18n.t('form:Remember password') },
        {
            min: PASSWORD_MIN_LENGTH,
            message: i18n.t('form:min-length', { minLength: PASSWORD_MIN_LENGTH }),
        },
        { pattern: strongRegex, message: i18n.t('form:Password validation') },
        {
            pattern: oneLowerCase,
            message: i18n.t('form:Must have at least one', { field: 'lower case letter' }),
        },
        {
            pattern: oneUpperCase,
            message: i18n.t('form:Must have at least one', { field: 'upper case letter' }),
        },
        {
            pattern: oneDigit,
            message: i18n.t('form:Must have at least one', { field: 'digit' }),
        },
        {
            pattern: oneSpecial,
            message: i18n.t('form:Must have at least one', { field: 'special character (!@#$%^&*)' }),
        },
    ],
    rePassword: [
        { required: true, message: i18n.t('form:Remember to rewrite password') },
        // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
        ({ getFieldValue }) => ({
            validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                    return Promise.resolve()
                }
                return Promise.reject(new Error(i18n.t('form:Must be equal', { field: 'password' })))
            },
        }),
    ],
    email: [
        { required: true, message: i18n.t('form:Remember email') },
        { type: 'email', message: i18n.t('form:Email is not valid') },
    ],
    lastName: [{ required: true, message: i18n.t('form:Remember last name') }],
    firstName: [{ required: true, message: i18n.t('form:Remember first name') }],
}

interface IFormRules {
    password: Rule[]
    rePassword: Rule[]
    email: Rule[]
    firstName: Rule[]
    lastName: Rule[]
}
