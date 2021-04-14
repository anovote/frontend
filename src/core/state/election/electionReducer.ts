import { IBallot } from 'core/models/ballot/IBallot'
import { ElectionStatus } from 'core/models/election/ElectionStatus'
import { IElectionBase } from 'core/models/election/IElectionBase'

/**
 * Different display actions that can occur in an election
 */
export enum DisplayAction {
    Locked,
    Closed,
    NotStarted,
    Finished,
    Waiting,
    Ballot,
    Result,
}
/**
 * Election state type that contains information about the
 * current state of the election.
 */
export type ElectionState = {
    displayAction: DisplayAction
    election: IElectionBase | undefined
    ballot: IBallot | undefined
    result: null
}

/**
 * Election state actions, used to perform actions on the reducer
 */
export type ElectionAction =
    | { type: 'election'; payload: IElectionBase }
    | { type: 'ballot'; payload: IBallot }
    // TODO Not implemented yet
    | { type: 'result'; payload: null }
    | { type: 'close'; payload: boolean }

export const initialElectionState: ElectionState = {
    ballot: undefined,
    election: undefined,
    displayAction: DisplayAction.Waiting,
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
                    newState.displayAction = DisplayAction.Locked
                    return newState
                }

                if (election.status == ElectionStatus.NotStarted) {
                    newState.displayAction = DisplayAction.NotStarted
                    return newState
                } else if (election.status == ElectionStatus.Started) {
                    newState.displayAction = DisplayAction.Waiting
                    return newState
                } else if (election.status == ElectionStatus.Finished) {
                    newState.displayAction = DisplayAction.Finished
                    return newState
                }

                const currentDate = new Date()
                if (election.openDate && election.openDate < currentDate) {
                    newState.displayAction = DisplayAction.Waiting
                } else if (election.closeDate && election.closeDate > currentDate) {
                    newState.displayAction = DisplayAction.Closed
                }
            }
            break
        case 'ballot': {
            const ballot = action.payload
            if (ballot) {
                newState.displayAction = DisplayAction.Ballot
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
            newState.displayAction = action.payload ? DisplayAction.Closed : DisplayAction.Waiting
            break
        }
        default:
    }
    return newState
}
