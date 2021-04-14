import { Events } from 'core/events'
import { IBallotEntity } from 'core/models/ballot/IBallotEntity'
import { AnoSocket } from 'core/state/websocket/IAnoSocket'
import { SocketEventAcknowledgement } from './SocketEventAcknowledgement'

/**
 * Responsible for handling all socket events happening during an election
 */
export class ElectionEventService {
    // todo should it be singleton
    private readonly _socket: AnoSocket

    constructor(socket: AnoSocket) {
        // todo verify that token isOrganizer
        this._socket = socket
    }

    /**
     * Broadcasts a ballot to an election room
     * Solution inspired by https://stackoverflow.com/questions/60271984/await-socket-onanswertorequest-possible-with-socket-io
     * @param ballot ballot to be pushed
     * @param electionRoom the electionRoom to be broadcasted in. Usually the same as the election ID
     */
    broadcastBallot = async (ballot: IBallotEntity, electionRoom: number): Promise<SocketEventAcknowledgement> => {
        return await new Promise((resolve) => {
            this._socket.emit(
                Events.client.ballot.push,
                { ballotId: ballot.id, electionId: electionRoom },
                (acknowledgeMessage: SocketEventAcknowledgement) => {
                    resolve(acknowledgeMessage)
                },
            )
        })
    }
}
