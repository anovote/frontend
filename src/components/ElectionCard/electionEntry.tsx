import Text from 'antd/lib/typography/Text'
import Title from 'antd/lib/typography/Title'
import React, { ReactElement } from 'react'

interface EntryProps {
    title: string
    date: Date | string
}

export default function ElectionEntry({ title, date }: EntryProps): ReactElement {
    return (
        <div className="election-entry">
            <Title level={5}>{title}</Title>
            <Text>{date}</Text>
        </div>
    )
}
