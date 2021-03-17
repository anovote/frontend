import { StatusCodes } from 'http-status-codes'

/**
 * Describes the acknowledgement coming from the server
 */
export interface SocketEventAcknowledgement {
    status: StatusCodes
    message: string
}
