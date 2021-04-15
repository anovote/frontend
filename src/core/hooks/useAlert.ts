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
            if (action.message)
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
    const [alertState, alertDispatch] = useReducer(alertReducer, initialState)

    return [alertState, alertDispatch]
}
