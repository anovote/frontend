import { AlertProps } from 'antd'

/**
 * The state of the Voter Login View
 */
export interface VoterLoginState {
    alert?: AlertProps
    isLoading: boolean
}

/**
 * Different actions that can happen in Voter Login view. Intended to be used with the voterLoginReducer
 */
type VoterLoginAction =
    | { type: 'success' | 'sendRequest' | 'closeAlert' | 'connectToSocket' | 'connectedToSocket' }
    | { type: 'error' | 'socketNotConnected' | 'emailSent'; alertProps: AlertProps }

/**
 * Reducer to be used with the voter login view
 * @param state The state that can be changed
 * @param action object describing the action taken
 * @returns the state after the reducer has ran
 */
export const voterLoginReducer = (state: VoterLoginState, action: VoterLoginAction): VoterLoginState => {
    console.log(action)
    switch (action.type) {
        case 'emailSent':
            return { ...state, isLoading: false, alert: action.alertProps }

        case 'sendRequest':
            return {
                ...state,
                isLoading: true,
            }
        case 'connectedToSocket':
            return { ...state, isLoading: false }
        case 'success':
            return {
                ...state,
                isLoading: false,
            }
        case 'closeAlert':
            return {
                ...state,
                alert: undefined,
            }
        case 'error':
            return {
                ...state,
                alert: action.alertProps,
                isLoading: false,
            }
        case 'connectToSocket':
            return {
                ...state,
                isLoading: true,
            }
        case 'socketNotConnected':
            return {
                ...state,
                isLoading: false,
                alert: action.alertProps,
            }

        default:
            break
    }
    return { ...state }
}
