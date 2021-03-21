import BallotDisplayHandler from 'containers/BallotDisplayHandler/BallotDisplayHandler'
import { BallotResultDisplay } from 'core/models/ballot/BallotResultDisplay'
import { BallotStatus } from 'core/models/ballot/BallotStatus'
import { BallotType } from 'core/models/ballot/BallotType'
import { IBallotEntity } from 'core/models/ballot/IBallotEntity'
import { ICandidateEntity } from 'core/models/ballot/ICandidate'
import React from 'react'

/**
 * Landing page of application and home root
 * @returns the landing page view
 */
export default function Home(): React.ReactElement {
    const candidate1: ICandidateEntity = { id: 1, candidate: 'First candidate' }
    const candidate2: ICandidateEntity = { id: 2, candidate: 'Second candidate' }

    const ballot: IBallotEntity = {
        id: 1,
        status: BallotStatus.IN_PROGRESS,
        createdAt: new Date(),
        updatedAt: new Date(),
        title: 'My good title',
        type: BallotType.SINGLE,
        resultDisplayType: BallotResultDisplay.SINGLE,
        displayResultCount: false,
        resultDisplayTypeCount: 1,
        order: 1,
        candidates: [candidate1, candidate2],
    }

    return (
        <div>
            <BallotDisplayHandler ballot={ballot} />
        </div>
    )
}
