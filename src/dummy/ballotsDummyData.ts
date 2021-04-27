import { BallotResultDisplay } from 'core/models/ballot/BallotResultDisplay'
import { BallotStatus } from 'core/models/ballot/BallotStatus'
import { BallotType } from 'core/models/ballot/BallotType'
import { IBallotEntity } from 'core/models/ballot/IBallotEntity'

export const freshBallots: IBallotEntity[] = [
    {
        id: 1,
        title: 'first ballot',
        description: 'this was the first ballot',
        type: BallotType.SINGLE,
        status: BallotStatus.IN_QUEUE,
        candidates: [
            { id: 1, candidate: 'first' },
            { id: 1, candidate: 'second' },
        ],
        image: undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
        displayResultCount: true,
        resultDisplayTypeCount: 1,
        resultDisplayType: BallotResultDisplay.SINGLE,
        order: 1,
    },
    {
        id: 2,
        title: 'second ballot',
        description: 'this was the second ballot',
        type: BallotType.SINGLE,
        status: BallotStatus.IN_QUEUE,
        candidates: [
            { id: 3, candidate: 'first' },
            { id: 4, candidate: 'second' },
        ],
        image: undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
        displayResultCount: true,
        resultDisplayTypeCount: 1,
        resultDisplayType: BallotResultDisplay.SINGLE,
        order: 2,
    },
    {
        id: 3,
        title: 'third ballot',
        description: 'this was the third ballot',
        type: BallotType.SINGLE,
        status: BallotStatus.IN_QUEUE,
        candidates: [
            { id: 5, candidate: 'first' },
            { id: 6, candidate: 'second' },
        ],
        image: undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
        displayResultCount: true,
        resultDisplayTypeCount: 1,
        resultDisplayType: BallotResultDisplay.SINGLE,
        order: 3,
    },
]
