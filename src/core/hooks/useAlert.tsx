import { AlertProps, Alert } from 'antd'
import { useReducer, useEffect } from 'react'
import * as React from 'react'

function alertReducer(state: AnovoteAlertState, action: AlertAction) {
    switch (action) {
        case 'show': {
            return {
                ...state,
            }
        }
        case 'close': {
            return {
                ...state,
            }
        }
        default:
            return state
    }
}

export function useAlert(initialState: AnovoteAlertState) {
    const [state, dispatch] = useReducer(alertReducer, initialState)
}

interface AnovoteAlertState {
    message: string
    description: string
    type: AlertType
}

type AlertType = 'error' | 'warning' | 'success' | 'info'

type AlertAction = 'show' | 'close'
