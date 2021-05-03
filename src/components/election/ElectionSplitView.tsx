import Title from 'antd/lib/typography/Title'
import ElectionStatusLabel from 'components/ElectionStatusLabel'
import { IElectionEntity } from 'core/models/election/IElectionEntity'
import React, { ReactElement } from 'react'

export default function ElectionSplitView({
    election,
    left,
    right,
}: {
    election: IElectionEntity
    left: React.ReactNode
    right: React.ReactNode
}): ReactElement {
    return (
        <>
            <header className="election-header">
                <Title level={1}>{election.title}</Title>
                <ElectionStatusLabel status={election.status} />
            </header>
            <div className="election-view">
                <div className="split-view-left">
                    <div className="election-fixed-side">{left}</div>
                </div>
                <div className="split-view-right">{right}</div>
            </div>
        </>
    )
}
