import { useLocation } from 'react-router-dom'

/**
 * This hook provides functionality to get query params for a URI
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function useQuery() {
    return new URLSearchParams(useLocation().search)
}
