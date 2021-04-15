import { Dispatch, useReducer } from 'react'

type AlertType = 'error' | 'warning' | 'success' | 'info' | undefined

export type AlertAction = {
    type: 'add'
    alertType: AlertType
    message: string | undefined
    description?: string
}

export interface AnovoteAlertState {
    message: string | undefined
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
            throw new Error()
    }
}

export function useAlert(initialState: AnovoteAlertState[]): [AnovoteAlertState[], Dispatch<AlertAction>] {
    initialState.shift()
    const [alertState, alertDispatch] = useReducer(alertReducer, initialState)

    return [alertState, alertDispatch]
}
