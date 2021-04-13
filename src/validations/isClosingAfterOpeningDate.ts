import { compareDesc } from 'date-fns'
import { RuleRender } from 'rc-field-form/lib/interface'

export const isClosingAfterOpeningDate: RuleRender = ({ getFieldValue }) => ({
    validator(_, value) {
        const openDate = getFieldValue('openDate')

        // check if close date is after open date. It can also be equal.
        if (compareDesc(openDate, value) !== -1) {
            return Promise.resolve()
        }
        return Promise.reject(new Error('The close date must be set to after open date'))
    },
})
