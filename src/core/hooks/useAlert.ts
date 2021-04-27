import { Dispatch, ReactNode, useReducer } from 'react'

type AlertType = 'error' | 'warning' | 'success' | 'info' | undefined

export type AlertAction =
    | {
          type: 'add'
          level: AlertType
          message: string | undefined | ReactNode
          description?: string
      }
    | {
          type: 'remove'
          index: number
      }

export interface AlertState {
    message: string | undefined | ReactNode
    description?: string
    level: AlertType
}

function alertReducer(state: AlertState[], action: AlertAction): AlertState[] {
    switch (action.type) {
        case 'add': {
            const listCopy = [...state]
            listCopy.push({
                message: action.message,
                description: action.description,
                level: action.level,
            })
            return listCopy
        }

        case 'remove': {
            const listCopy = [...state]
            listCopy.splice(action.index, 1)
            return listCopy
        }
        default:
            return state
    }
}

export function useAlert(initialState: AlertState[]): [AlertState[], Dispatch<AlertAction>] {
    if (initialState.length > 0 && initialState[0].message === '') {
        initialState.shift()
    }

    const [alertStates, dispatchAlert] = useReducer(alertReducer, initialState)

    return [alertStates, dispatchAlert]
}
