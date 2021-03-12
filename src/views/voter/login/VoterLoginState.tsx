import { IIconMessage } from 'components/iconMessage/IIconMessage'

/**
 * The state of the Voter Login View
 */
export interface VoterLoginState {
    message?: IIconMessage
    isLoading: boolean
    showMessage: boolean
}

/**
 * Different actions that can happen in Voter Login view. Intended to be used with the voterLoginReducer
 */
type VoterLoginAction =
    | { type: 'showMessage'; payload: IIconMessage }
    | { type: 'hideMessage' }
    | { type: 'isLoading'; payload: boolean }

/**
 * Reducer to be used with the voter login view
 * @param state The state that can be changed
 * @param action object describing the action taken
 * @returns the state after the reducer has ran
 */
export const voterLoginReducer = (state: VoterLoginState, action: VoterLoginAction): VoterLoginState => {
    switch (action.type) {
        case 'showMessage': {
            return { ...state, message: action.payload, showMessage: true }
        }
        case 'hideMessage': {
            return { ...state, message: undefined, showMessage: false }
        }
        case 'isLoading': {
            return { ...state, isLoading: action.payload }
        }
        default:
            break
    }
    return { ...state }
}
