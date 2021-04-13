import { Alert } from 'antd'
import { useReducer } from 'react'
import * as React from 'react'
import { Dispatch } from 'react'

function alertReducer(state: AnovoteAlertState, action: AlertAction): AnovoteAlertState {
    switch (action.type) {
        case 'show': {
            return {
                ...state,
                message: state.message,
                description: state.description,
                alertType: state.alertType,
            }
        }

        case 'new': {
            return {
                ...state,
                message: action.newState.message,
                description: action.newState.description,
                alertType: action.newState.alertType,
            }
        }
        case 'close': {
            return {
                ...state,
            }
        }
        default:
            throw new Error()
    }
}

export function useAlert(initialState: AnovoteAlertState): [React.ReactElement | undefined, Dispatch<AlertAction>] {
    const [alertState, alertDispatch] = useReducer(alertReducer, initialState)

    const alert: React.ReactElement | undefined = (
        <Alert message={alertState.message} description={alertState.description} type={alertState.alertType} />
    )

    return [alert, alertDispatch]
}

interface AnovoteAlertState {
    message: string | undefined
    description?: string
    alertType: AlertType
}

type AlertType = 'error' | 'warning' | 'success' | 'info'

export type AlertAction = { type: 'show' } | { type: 'new'; newState: AnovoteAlertState } | { type: 'close' }
