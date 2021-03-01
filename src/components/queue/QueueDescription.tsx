import Text from 'antd/lib/typography/Text'
import Title from 'antd/lib/typography/Title'
import React, { ReactElement } from 'react'

export default function QueueDescription(): ReactElement {
    return (
        <div className="queue-additional">
            <Title level={5}>Current leader</Title>
            <Text>Christoffer Elton Holanger</Text>
        </div>
    )
}
