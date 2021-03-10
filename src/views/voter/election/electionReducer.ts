import { IBallot } from 'core/models/ballot/IBallot'
import { IElection } from 'core/models/IElection'
import { ElectionStatus } from 'core/models/IElectionStatus'

/**
 * Different display actions that can occur in an election
 */
export enum DisplayAction {
    DisplayLocked,
    DisplayClosed,
    DisplayNotStarted,
    DisplayFinished,
    DisplayWaiting,
    DisplayBallot,
    DisplayResult,
}
/**
 * Election state type that contains information about the
 * current state of the election.
 */
export type ElectionState = {
    displayAction: DisplayAction
    election: IElection | undefined
    ballot: IBallot | undefined
    result: null
}

/**
 * Election state actions, used to perform actions on the reducer
 */
export type ElectionAction =
    | { type: 'election'; payload: IElection }
    | { type: 'ballot'; payload: IBallot }
    // TODO Not implemented yet
    | { type: 'result'; payload: null }
    | { type: 'close'; payload: boolean }

export const initialElectionState: ElectionState = {
    ballot: undefined,
    election: undefined,
    displayAction: DisplayAction.DisplayWaiting,
    result: null,
}

/**
 * Election state handler, responsible for setting the state of the election
 * based on content from payloads, ballot, election, results and closed.
 */
export function electionReducer(state: ElectionState, action: ElectionAction): ElectionState {
    const newState = Object.assign({}, state)
    switch (action.type) {
        case 'election':
            {
                const election = action.payload
                newState.election = election
                if (election.isLocked) {
                    newState.displayAction = DisplayAction.DisplayLocked
                    return newState
                }

                if (election.status == ElectionStatus.NotStarted) {
                    newState.displayAction = DisplayAction.DisplayNotStarted
                    return newState
                } else if (election.status == ElectionStatus.Started) {
                    newState.displayAction = DisplayAction.DisplayWaiting
                    return newState
                } else if (election.status == ElectionStatus.Finished) {
                    newState.displayAction = DisplayAction.DisplayFinished
                    return newState
                }

                const currentDate = new Date()
                if (election.openDate && election.openDate < currentDate) {
                    newState.displayAction = DisplayAction.DisplayWaiting
                } else if (election.closeDate && election.closeDate > currentDate) {
                    newState.displayAction = DisplayAction.DisplayClosed
                }
            }
            break
        case 'ballot': {
            const ballot = action.payload
            if (ballot) {
                newState.displayAction = DisplayAction.DisplayBallot
                newState.ballot = ballot
                newState.result = null
            }
            break
        }
        case 'result': {
            newState.ballot = undefined
            break
        }
        case 'close': {
            newState.displayAction = action.payload ? DisplayAction.DisplayClosed : DisplayAction.DisplayWaiting
            break
        }
        default:
    }
    return newState
}
