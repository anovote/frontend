import { Button } from 'antd'
import * as React from 'react'
import { useSocket } from 'core/state/websocket/useSocketHook'

export interface IVote {
    candidate: number
    submitted: Date
    voterId: number
    ballotId: number
}
export function VoteOnSingleCandidate(): React.ReactElement {
    const [socket] = useSocket()
    socket.connect()

    const submitVote = () => {
        const vote: IVote = {
            candidate: 1,
            submitted: new Date(),
            voterId: 999,
            ballotId: 6969,
        }
        socket.emit('vote_submitted')
        console.log(vote)
    }

    return (
        <div>
            <Button onClick={submitVote}>Submit vote</Button>
        </div>
    )
}
