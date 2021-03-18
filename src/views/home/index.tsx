import Text from 'antd/lib/typography/Text'
import Title from 'antd/lib/typography/Title'
import { VoteOnSingleCandidate } from 'components/ballot/voteOnBallot/VoteOnSingleCanidate'
import React from 'react'
import { Button } from 'antd'
import { useSocket } from 'core/state/websocket/useSocketHook'
import { Events } from 'core/events'
/**
 * Landing page of application and home root
 * @returns the landing page view
 */
export default function Home(): React.ReactElement {
    const [socket] = useSocket()
    socket.connect()

    const onChange = () => {
        const vote = {
            candidate: 1,
            submitted: new Date(),
            voterId: 1,
            ballotId: 1,
        }

        socket.emit(Events.client.vote.submit, vote, (data: any) => {
            console.log(data)
        })
    }

    return (
        <div>
            <Button onClick={onChange}>Submit vote</Button>
        </div>
    )
}
