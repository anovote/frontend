import { BallotWithVotes } from 'core/models/ballot/BallotWithVotes'
import { IBallotEntity } from 'core/models/ballot/IBallotEntity'
import { IBallotStats } from 'core/models/ballot/IBallotStats'

export interface ElectionBallotState {
    ballotWithStats: Array<BallotWithVotes>
    activeBallotIndex: number
}

export type Action =
    | { type: 'addStats'; payload: IBallotStats[] }
    | { type: 'updateStats'; payload: IBallotStats }
    | { type: 'addBallots'; payload: IBallotEntity[] }
    | { type: 'setActiveBallot'; payload: number }
    | { type: 'previousBallot' }
    | { type: 'nextBallot' }

export const electionBallotReducer = (state: ElectionBallotState, action: Action): ElectionBallotState => {
    const newState = Object.assign({}, state)
    switch (action.type) {
        case 'addStats': {
            for (const stat of action.payload) {
                const ballot = newState.ballotWithStats.find((ballot) => ballot.id == stat.ballotId)
                if (ballot) ballot.updateVotes(stat.stats)
            }
            newState.ballotWithStats = [...newState.ballotWithStats]
            break
        }
        case 'updateStats': {
            const ballot = newState.ballotWithStats.find((ballot) => ballot.id == action.payload.ballotId)
            if (ballot) {
                ballot.updateVotes(action.payload.stats)
                newState.ballotWithStats = [...newState.ballotWithStats]
            }
            break
        }
        case 'addBallots':
            for (const ballot of action.payload) {
                newState.ballotWithStats.push(new BallotWithVotes(ballot))
            }
            break
        case 'setActiveBallot':
            newState.activeBallotIndex = newState.ballotWithStats.findIndex((ballot) => {
                return ballot.id == action.payload
            })
            break
        case 'previousBallot':
            if (newState.activeBallotIndex - 1 >= 0) {
                newState.activeBallotIndex -= 1
            }
            break
        case 'nextBallot':
            if (newState.activeBallotIndex + 1 < newState.ballotWithStats.length) {
                newState.activeBallotIndex += 1
            }
            break
    }
    return newState
}
