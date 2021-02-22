import { AuthLevel } from '../../service/authentication/AuthLevel'

export interface IAppState {
    isLoggedIn: boolean
    authLevel: AuthLevel
}

/**
 * Default global app state, only used for
 * initializing the AppContext
 */
export const appState: IAppState = {
    isLoggedIn: false,
    authLevel: AuthLevel.none,
}
