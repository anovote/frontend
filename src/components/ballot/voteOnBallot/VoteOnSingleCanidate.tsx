import { Radio } from 'antd'
import * as React from 'react'

export interface ICandidate {
    id: number
    candidate: string
}

export interface IVote {
    candidate: number
    submitted: Date
    voterId: number
    ballotId: number
}
export function VoteOnSingleCandidate(): React.ReactElement {
    const candidate1: ICandidate = { id: 1, candidate: 'Diana' }
    const candidate2: ICandidate = { id: 2, candidate: 'Diana' }
    const candidate3: ICandidate = { id: 3, candidate: 'Diana' }
    const candidateOptions = [
        {
            label: candidate1.candidate,
            value: candidate1.id,
        },
        {
            label: candidate2.candidate,
            value: candidate2.id,
        },
        {
            label: candidate3.candidate,
            value: candidate3.id,
        },
    ]

    const candidateChosen = (e: any) => {}

    return (
        <div>
            <Radio.Group
                options={candidateOptions}
                onChange={candidateChosen}
                optionType="button"
                buttonStyle="solid"
            />
        </div>
    )
}
