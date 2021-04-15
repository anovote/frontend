import { compareAsc } from 'date-fns'
import { RuleRender } from 'rc-field-form/lib/interface'

export const isDateNow: RuleRender = () => ({
    validator(_, value: Date) {
        // create date from 5 seconds ago
        const dateNow = new Date()
        //
        const hourAgo = new Date(dateNow.getTime() - 1000 * 60 * 60)

        // check if opening date is set to now or a future time/date
        if (compareAsc(value, hourAgo) !== -1) {
            return Promise.resolve()
        }
        return Promise.reject(new Error('The opening date must be either now or later'))
    },
})
