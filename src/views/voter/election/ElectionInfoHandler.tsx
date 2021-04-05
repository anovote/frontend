import VoterTopInfo from 'components/voterContentInfo/VoterContentInfo'
import { DisplayAction, ElectionState } from 'core/state/election/electionReducer'
import React, { ReactElement } from 'react'

/**
 * This modules is responsible for providing the correct information for the current state of the
 * election.
 */
export default function ElectionInfoHandler({ state }: { state: ElectionState }): ReactElement {
    let title = ''
    let context = undefined
    const shouldDisplay = true
    switch (state.displayAction) {
        case DisplayAction.Result:
        case DisplayAction.Ballot:
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
