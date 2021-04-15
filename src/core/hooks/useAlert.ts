import { Dispatch, ReactNode, useReducer } from 'react'

type AlertType = 'error' | 'warning' | 'success' | 'info' | undefined

export type AlertAction = {
    type: 'add'
    alertType: AlertType
    message: string | undefined | ReactNode
    description?: string
}

export interface AnovoteAlertState {
    message: string | undefined | ReactNode
    description?: string
    alertType: AlertType
}

function alertReducer(state: AnovoteAlertState[], action: AlertAction): AnovoteAlertState[] {
    switch (action.type) {
        case 'add': {
            const listCopy = [...state]
            listCopy.push({
                message: action.message,
                description: action.description,
                alertType: action.alertType,
            })
            return listCopy
        }
        default:
            return state
    }
}

export function useAlert(initialState: AnovoteAlertState[]): [AnovoteAlertState[], Dispatch<AlertAction>] {
    if (initialState[0].message === '') {
        initialState.shift()
    }

    const [alertState, alertDispatch] = useReducer(alertReducer, initialState)

    return [alertState, alertDispatch]
}
