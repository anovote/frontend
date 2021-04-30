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
type UseAlertReturn = {
    alertStates: AlertState[]
    dispatchAlert: Dispatch<AlertAction>
}

function alertReducer(state: AlertState[], action: AlertAction): AlertState[] {
    const LIST_MAX_LENGTH = 5

    switch (action.type) {
        case 'add': {
            const listCopy = [...state]

            // make sure alert list never exceeds max length to avoid stacking
            if (state.length + 1 > LIST_MAX_LENGTH) {
                listCopy.splice(listCopy.length - LIST_MAX_LENGTH, 1)
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
    if (
        messageAreEqual(newAlert.message, prevAlert.message) ||
        (newAlert.description &&
            prevAlert.description &&
            descriptionAreEqual(newAlert.description, prevAlert.description))
    ) {
        return true
    }
    return false
}

function messageAreEqual(newMessage: string | ReactNode, prevMessage: string | ReactNode) {
    return newMessage === prevMessage
}

function descriptionAreEqual(newDescription: string, prevDescription: string) {
    return newDescription === prevDescription
}

export function useAlert(initialState: AlertState[]): UseAlertReturn {
    if (initialState.length > 0 && initialState[0].message === '') {
        initialState.shift()
    }

    const [alertStates, dispatchAlert] = useReducer(alertReducer, initialState)

    return { alertStates, dispatchAlert }
}
