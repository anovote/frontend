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
    const listMaxLength = 5
    switch (action.type) {
        case 'add': {
            const listCopy = [...state]

            // make sure alert list never exceeds max length to avoid stacking
            if (state.length + 1 > listMaxLength) {
                listCopy.splice(listCopy.length - listMaxLength, 1)
            }

            if (state.length > 0) {
                const prev = state[state.length - 1]

                if (
                    isEqualToPrevious(
                        { message: action.message, description: action.description },
                        { message: prev.message, description: prev.description },
                    )
                ) {
                    return listCopy
                }
            }
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

function isEqualToPrevious(
    newAlert: { message: string | ReactNode; description?: string },
    prevAlert: { message: string | ReactNode; description?: string },
) {
    if (newAlert.message === prevAlert.message) return true
    if (newAlert.description && newAlert.description === prevAlert.description) return true
    return false
}

export function useAlert(initialState: AlertState[]): [AlertState[], Dispatch<AlertAction>] {
    if (initialState.length > 0 && initialState[0].message === '') {
        initialState.shift()
    }

    const [alertStates, dispatchAlert] = useReducer(alertReducer, initialState)

    return [alertStates, dispatchAlert]
}
