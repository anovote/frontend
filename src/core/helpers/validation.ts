/** regex found https://stackoverflow.com/a/46181/3946892 - same regex used in Chromium for email validation */
export const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ /**

 * Validates an email address for validity.
 * Returns true if it is valid, else false
 * @param email the email to validate
 */
export function isValidEmail(email: string): boolean {
    return emailRegex.test(String(email).toLowerCase())
}
