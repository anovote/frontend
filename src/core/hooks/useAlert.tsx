import { AlertProps, Alert } from 'antd'
import { useReducer, useEffect } from 'react'
import * as React from 'react'
import { Dispatch } from 'react'

function alertReducer(state: AnovoteAlertState, action: AlertAction) {
    switch (action.type) {
        case 'show': {
            return {
                ...state,
                message: action.alertProps.message,
                description: action.alertProps.description,
                type: action.alertProps.type,
            }
        }
        case 'close': {
            return {
                ...state,
                message: '',
                description: '',
            }
        }
        default:
            return state
    }
}

export function useAlert(initialState: AnovoteAlertState): [React.ReactElement, Dispatch<AlertAction>] {
    const [alertState, alertDispatch] = useReducer(alertReducer, initialState)

    const alert = (
        <Alert message={alertState.message} description={alertState.description} type={alertState.type} showIcon />
    )

    return [alert, alertDispatch]
}

interface AnovoteAlertState {
    message: string
    description: string
    type: AlertType
}

type AlertType = 'error' | 'warning' | 'success' | 'info'

export type AlertAction = { type: 'show'; alertProps: AnovoteAlertState } | { type: 'close' }
