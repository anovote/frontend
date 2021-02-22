export enum AuthLevel {
    none,
    voter,
    organizer,
    authorizer,
}

export interface IAppState {
    isLoggedIn: boolean
    authLevel: AuthLevel
}

/**
 * Default global app state, only used for
 * initializing the AppContext
 */
export const appState = {
    isLoggedIn: false,
    authLevel: AuthLevel.none,
}
