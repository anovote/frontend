import React, { ReactElement } from 'react'
import { DisplayAction, ElectionState } from './electionReducer'
import VoterTopInfo from 'components/voterContentInfo/VoterContentInfo'

/**
 * This modules is responsible for providing the correct information for the current state of the
 * election.
 */
export default function ElectionInfoHandler({ state }: { state: ElectionState }): ReactElement {
    let title = ''
    let context = undefined
    const shouldDisplay = true
    switch (state.displayAction) {
        case DisplayAction.DisplayResult:
        case DisplayAction.DisplayBallot:
            {
                if (state.ballot && state.election) {
                    title = state.ballot.title
                    context = state.election.title
                }
            }
            break
        default:
            {
                if (state.election) {
                    title = state.election.title
                }
            }
            break
    }
    return <>{shouldDisplay && <VoterTopInfo title={title} context={context} />}</>
}
