import { IElection } from 'core/models/election/IElection'

/**
 * Prepares an election for an form by fixing values that is transformed via the JSON oject. For instance, an
 * date object on server is provided as a date string over JSON.
 * Since the form handling of ant d uses objects and not classes, it makes it difficult for use to work with our classes
 * Especially since the date for date-fns should use date instances and not strings (which is what we get from the server)
 * @param election the election object to transform
 * @returns a new Election object with proper values for fields
 */
export const prepareElection = (election: IElection) => {
    if (election.openDate && !(election.openDate instanceof Date)) {
        election.openDate = new Date(election.openDate)
    }

    if (election.closeDate && !(election.closeDate instanceof Date)) {
        election.closeDate = new Date(election.closeDate)
    }

    return election
}
