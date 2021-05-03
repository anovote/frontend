import { BallotEntity } from 'core/models/ballot/BallotEntity'
import { BallotStatus } from 'core/models/ballot/BallotStatus'
import { BallotType } from 'core/models/ballot/BallotType'
import { IBallotEntity } from 'core/models/ballot/IBallotEntity'
import { ICandidateEntity } from 'core/models/ballot/ICandidate'

export const ballotEntity: IBallotEntity = {
    id: 1,
    status: BallotStatus.IN_PROGRESS,
    createdAt: new Date(),
    updatedAt: new Date(),
    displayResultCount: true,
    resultDisplayType: 0,
    resultDisplayTypeCount: 3,
    title: 'First ballot!',
    type: BallotType.SINGLE,
    order: 1,
    candidates: [
        { id: 1, candidate: 'Finn Tom' } as ICandidateEntity,
        {
            id: 2,
            candidate: 'David Andersen',
        } as ICandidateEntity,
    ],
}

export const ballotInstance: BallotEntity = new BallotEntity(ballotEntity)
