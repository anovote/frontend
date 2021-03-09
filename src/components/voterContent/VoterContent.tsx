import React, { ReactElement } from 'react'

export default function VoterContent({ children }: { children: ReactElement[] | ReactElement }) {
    return <div className="election-main">{children}</div>
}
