import React, { createContext, ReactElement, useContext, useState } from 'react'
import { appState, IAppState } from './appState'

interface IAppStateDispatcher {
    setLoginState: () => void
    setLogoutState: () => void
}
const appContext = createContext(appState)
const appStateDispatch = createContext({} as IAppStateDispatcher)

/**
 * Provides App state context to all child componets that this components wraps
 */
function ProvideAppContext({ children }: { children: Array<ReactElement> }): ReactElement {
    const [state, setState] = useState(appState)
    const dispatcher: IAppStateDispatcher = {
        setLoginState: () => {
            setState({ ...state, isLoggedIn: true })
        },
        setLogoutState: () => {
            setState({ ...state, isLoggedIn: false })
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
 * Hook to use app state dispathers. The dispatchers are methods for altering the application
 * state
 */
const useAppStateDispatcher = (): IAppStateDispatcher => {
    return useContext(appStateDispatch)
}

export { ProvideAppContext, useAppState, useAppStateDispatcher }
