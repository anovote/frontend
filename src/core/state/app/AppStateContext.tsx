import React, { createContext, ReactElement, useContext, useState } from 'react'
import { AuthLevel } from '../../service/authentication/AuthLevel'
import { appState, IAppState } from './appState'

/**
 * Describes methods that is responsible for altering the global application state.
 */
interface IAppStateDispatcher {
    /**
     * Updates application state to logged in,
     * and set the provided auth level
     */
    setLoginState: (authLevel: AuthLevel) => void
    /**
     * Clears the logged in user.
     */
    setLogoutState: () => void
}

const appContext = createContext(appState)
const appStateDispatch = createContext({} as IAppStateDispatcher)

/**
 * Provides App state context to all child component(s) that this components wraps
 */
function ProvideAppContext({ children }: { children: Array<ReactElement> | ReactElement }): ReactElement {
    const [state, setState] = useState(appState)
    const dispatcher: IAppStateDispatcher = {
        setLoginState: (authLevel: AuthLevel) => {
            setState({ ...state, isLoggedIn: true, authLevel })
        },
        setLogoutState: () => {
            setState({ ...state, isLoggedIn: false, authLevel: AuthLevel.none })
        },
    }
    return (
        <appContext.Provider value={state}>
            <appStateDispatch.Provider value={dispatcher}>{children}</appStateDispatch.Provider>
        </appContext.Provider>
    )
}
/**
 * Hook to get access to the state of the application
 * This is should be considered read only
 */
const useAppState = (): IAppState => {
    return useContext(appContext)
}
/**
 * Hook to use app state dispatcher. The dispatchers are methods for altering the application
 * state
 */
const useAppStateDispatcher = (): IAppStateDispatcher => {
    return useContext(appStateDispatch)
}

export { ProvideAppContext, useAppState, useAppStateDispatcher }
