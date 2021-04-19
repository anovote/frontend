import { IBallotEntity } from 'core/models/ballot/IBallotEntity'
import { IBallotStats } from 'core/models/ballot/IBallotStats'

export type ElectionBallotState = {
    ballots: Array<{ ballot: IBallotEntity; stats: IBallotStats }>
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
        case 'addStats':
            for (const stat of action.payload) {
                const ballot = newState.ballots.find((ballot) => ballot.ballot.id == stat.ballotId)
                if (ballot) {
                    ballot.stats = stat
                    newState.ballots = [...newState.ballots]
                }
            }
            break
        case 'updateStats': {
            const ballot = newState.ballots.find((ballot) => ballot.ballot.id == action.payload.ballotId)
            if (ballot) {
                ballot.stats = action.payload
                newState.ballots = [...newState.ballots]
            }
            break
        }
        case 'addBallots':
            for (const ballot of action.payload) {
                newState.ballots.push({
                    ballot,
                    stats: { ballotId: ballot.id, stats: { blank: 0, total: 0, votes: 0, candidates: [] } },
                })
            }
            break
        case 'setActiveBallot':
            newState.activeBallotIndex = newState.ballots.findIndex((ballot) => {
                return ballot.ballot.id == action.payload
            })
            break
        case 'previousBallot':
            if (newState.activeBallotIndex - 1 >= 0) {
                newState.activeBallotIndex -= 1
            }
            break
        case 'nextBallot':
            if (newState.activeBallotIndex + 1 < newState.ballots.length) {
                newState.activeBallotIndex += 1
            }
            break
    }
    return newState
}
