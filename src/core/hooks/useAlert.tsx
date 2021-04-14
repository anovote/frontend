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
        case 'error': {
            return {
                ...state,
                message: action.message,
                description: action.description,
                alertType: 'warning',
            }
        }
        case 'warning': {
            return {
                ...state,
                message: action.message,
                description: action.description,
                alertType: 'warning',
            }
        }
        case 'info': {
            return {
                ...state,
                message: action.message,
                description: action.description,
                alertType: 'info',
            }
        }
        case 'success': {
            return {
                ...state,
                message: action.message,
                description: action.description,
                alertType: 'info',
            }
        }
        default:
            throw new Error()
    }
}

export function useAlert(initialState: AnovoteAlertState): [AnovoteAlertState, Dispatch<AlertAction>] {
    const [alertState, alertDispatch] = useReducer(alertReducer, initialState)

    return [alertState, alertDispatch]
}

export interface AnovoteAlertState {
    message: string
    description?: string
    alertType: AlertType
}

type AlertType = 'error' | 'warning' | 'success' | 'info'

export type AlertAction =
    | { type: 'show' }
    | { type: 'new'; newState: AnovoteAlertState }
    | { type: 'close' }
    | { type: 'error' | 'warning' | 'info' | 'success'; message: string; description?: string }

export function createAlertComponent(alertProps: AnovoteAlertState): React.ReactElement {
    let alertComponent: React.ReactElement = <></>

    if (alertProps.message) {
        alertComponent = (
            <Alert
                message={alertProps.message}
                description={alertProps.description}
                type={alertProps.alertType}
                closable
                showIcon
            />
        )
    }

    return <div>{alertComponent}</div>
}
