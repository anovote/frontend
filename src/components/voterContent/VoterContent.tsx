import React, { ReactElement } from 'react'

export default function VoterContent({ children }: { children: ReactElement[] | ReactElement }): ReactElement {
    return <div className="voter-election-main">{children}</div>
}
