import { useVoterElectionState } from 'core/state/voter/VoterElectionContext'
import React, { ReactElement, ReactPropTypes } from 'react'

export default function VoterContent({ children }: { children: ReactElement[] | ReactElement }) {
    return <div className="election-main">{children}</div>
}
