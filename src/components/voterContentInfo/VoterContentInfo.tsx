import Title from 'antd/lib/typography/Title'
import React, { ReactElement } from 'react'

export default function VoterContentInfo({ context, title }: { title: string; context?: string }): ReactElement {
    return (
        <div className="voter-election-top">
            {!!context && <span className="text-label">{context}</span>}
            <Title level={1}>{title}</Title>
        </div>
    )
}
