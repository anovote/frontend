import { Alert } from 'antd'
import { useReducer } from 'react'
import * as React from 'react'
import { Dispatch } from 'react'

function alertReducer(state: AnovoteAlertState, action: AlertAction): AnovoteAlertState {
    switch (action.type) {
        case 'show': {
            return {
                ...state,
                message: action.showState.message,
                description: action.showState.description,
                alertType: action.showState.alertType,
                alertComponent: (
                    <Alert
                        message={state.message}
                        description={state.description}
                        type={state.alertType}
                        showIcon
                        closable
                    />
                ),
            }
        }
        case 'close': {
            return {
                ...state,
                alertComponent: <></>,
            }
        }
        default:
            throw new Error()
    }
}

export function useAlert(initialState: AnovoteAlertState): [React.ReactElement | undefined, Dispatch<AlertAction>] {
    const [alertState, alertDispatch] = useReducer(alertReducer, initialState)

    const alert: React.ReactElement | undefined = alertState.alertComponent

    return [alert, alertDispatch]
}

interface AnovoteAlertState {
    message: string
    description: string
    alertType: AlertType
    alertComponent?: React.ReactElement
}

type AlertType = 'error' | 'warning' | 'success' | 'info'

export type AlertAction = { type: 'show'; showState: AnovoteAlertState } | { type: 'close' }
