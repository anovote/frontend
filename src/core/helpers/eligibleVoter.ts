import { filterForDuplicates, trimItemsInArray } from 'core/helpers/array'
import { isValidEmail } from 'core/helpers/validation'
import { IEligibleVoter } from '../../components/importVoters/EligibleVotersTable'

/**
 * Creates a list of eligible voters based of a list of emails.
 * First the emails in the list are trimmed, then any duplicates are removed,
 * and then checked if all of the emails are valid. Any invalid emails will be removed.
 * @param arrays
 * @returns
 */
export function createListOfEligibleVoters(
    listOfEmails: string[],
): { invalidEmails: string[]; noDuplicates: string[]; eligibleVoters: IEligibleVoter[] } {
    const trimmedList: string[] = trimItemsInArray(listOfEmails)

    const noDuplicates = filterForDuplicates(trimmedList)

    const invalidEmails: string[] = []
    const eligibleVoters: IEligibleVoter[] = []

    for (let i = 0; i < noDuplicates.length; i++) {
        if (isValidEmail(noDuplicates[i])) {
            eligibleVoters.push({ identification: noDuplicates[i] })
        } else {
            invalidEmails.push(noDuplicates[i])
        }
    }

    return {
        invalidEmails,
        noDuplicates,
        eligibleVoters,
    }
}
