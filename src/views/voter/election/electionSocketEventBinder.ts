import { Events } from 'core/events'
import { IBallot } from 'core/models/ballot/IBallot'
import { IElection } from 'core/models/IElection'
import { AnoSocket } from 'core/state/websocket/IAnoSocket'
import { ElectionAction } from './electionReducer'

let anoSocket: AnoSocket
let electionStateDispatcher: React.Dispatch<ElectionAction>
let hasBound = false

const electionEvent = (election: IElection) => electionStateDispatcher({ type: 'election', payload: election })
const ballotEvent = (ballot: IBallot) => electionStateDispatcher({ type: 'ballot', payload: ballot })
const resultEvent = (result: null) => electionStateDispatcher({ type: 'result', payload: result })
const closeEvent = (close: boolean) => electionStateDispatcher({ type: 'close', payload: close })

/**
 * Binds socket events to the provided socket instance. The events are bound to the dispatcher
 * actions for the provided state dispatcher. The binding only occurs once, the first time this method
 * is executed.
 * @param socket the socket to bind event to
 * @param stateDispatcher state dispatcher to submit events on
 */
export const electionSocketEventBinder = (socket: AnoSocket, stateDispatcher: React.Dispatch<ElectionAction>): void => {
    if (!hasBound) {
        anoSocket = socket
        electionStateDispatcher = stateDispatcher

        anoSocket.on(Events.voter.election, electionEvent)
        anoSocket.on(Events.voter.ballot, ballotEvent)
        anoSocket.on(Events.voter.result, resultEvent)
        anoSocket.on(Events.voter.close, closeEvent)

        hasBound = true
    }
}

/**
 * Remove all events for the election
 */
export const electionSocketEventCleanup = (): void => {
    if (anoSocket) {
        anoSocket.removeEventListener(Events.voter.election, electionEvent)
        anoSocket.removeEventListener(Events.voter.ballot, ballotEvent)
        anoSocket.removeEventListener(Events.voter.result, resultEvent)
        anoSocket.removeEventListener(Events.voter.close, closeEvent)
    }
}
