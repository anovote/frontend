import { filterForDuplicates, trimItemsInArray } from 'core/helpers/array'
import { isValidEmail } from 'core/helpers/validation'
import { IEligibleVoter } from 'core/models/ballot/IEligibleVoter'

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
    const noDuplicates = filterForDuplicates(trimItemsInArray(listOfEmails))
    const invalidEmails: string[] = []
    const eligibleVoters: IEligibleVoter[] = []

    for (const identification of noDuplicates) {
        if (isValidEmail(identification)) eligibleVoters.push({ identification })
        else if (identification) invalidEmails.push(identification)
    }

    return {
        invalidEmails,
        noDuplicates,
        eligibleVoters,
    }
}
