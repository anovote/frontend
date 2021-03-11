import { Button } from 'antd'
import * as React from 'react'

export interface IVote {
    candidate: number
    submitted: Date
    voterId: number
    ballotId: number
}
export function VoteOnSingleCandidate(): React.ReactElement {
    const submitVote = () => {
        const vote: IVote = {
            candidate: 1,
            submitted: new Date(),
            voterId: 696969,
            ballotId: 6969,
        }
        console.log(vote)
    }

    return (
        <div>
            <Button onClick={submitVote}>Submit vote</Button>
        </div>
    )
}
