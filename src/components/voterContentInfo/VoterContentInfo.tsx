import Title from 'antd/lib/typography/Title'
import React, { ReactElement, ReactNode } from 'react'

export default function VoterContentInfo({ context, title }: { title: string; context?: string }): ReactElement {
    return (
        <div className="election-top">
            {!!context && <span className="text-label">{context}</span>}
            <h2 className="text-medium">{title}</h2>
        </div>
    )
}
