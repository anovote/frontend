import { Divider, Steps } from 'antd'
import React, { ReactElement, useState } from 'react'
import QueueDescription from './QueueDescription'
import QueueHeader from './QueueHeader'

const { Step } = Steps

export default function BallotsQueue({ dataSource }: { dataSource: any[] }): ReactElement {
    const [current, setCurrent] = useState(0)

    const queue = []

    for (const ballot of dataSource) {
        queue.push(<Step key={ballot.id} title={<QueueHeader />} description={<QueueDescription />} />)
    }

    return (
        <div className="ballots-queue">
            <Steps current={current} progressDot={true}>
                {queue}
            </Steps>

            <Divider />

            <Steps current={current} onChange={setCurrent} direction="vertical">
                {queue}
            </Steps>
        </div>
    )
}
