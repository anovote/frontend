import { BallotEntity } from 'core/models/ballot/BallotEntity'
import { AnoSocket } from 'core/state/websocket/IAnoSocket'
import { StatusCodes } from 'http-status-codes'

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
    broadcastBallot = async (ballot: BallotEntity, electionRoom: number): Promise<ElectionEventAcknowledgement> => {
        return await new Promise((resolve) => {
            this._socket.emit(
                'pushBallot',
                { ballot, electionRoom },
                (acknowledgeMessage: ElectionEventAcknowledgement) => {
                    resolve(acknowledgeMessage)
                },
            )
        })
    }
}

/**
 * Describes the acknowledgement coming from the server
 */
interface ElectionEventAcknowledgement {
    status: StatusCodes
    message: string
}
