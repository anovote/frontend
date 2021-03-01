import { Divider, Steps } from 'antd'
import Title from 'antd/lib/typography/Title'
import PushBallotIcon from 'components/icons/PushBallotIcon'
import StatCard from 'components/statCard/StatCard'
import SquareIconButton from 'containers/button/SquareIconButton'
import { BallotEntity } from 'core/models/ballot/BallotEntity'
import React, { ReactElement, useState } from 'react'
import QueueDescription from './QueueDescription'

const { Step } = Steps

export default function BallotsQueue({ dataSource }: { dataSource: BallotEntity[] }): ReactElement {
    const [current, setCurrent] = useState(0)

    const queue = []

    const timeline = []

    const b = [
        { title: 'Total', value: 99999 },
        { title: 'Votes', value: 3343 },
        { title: 'Votes', value: 94 },
    ]

    for (const ballot of dataSource) {
        queue.push(
            <Step
                key={ballot.id}
                title={<Title level={4}>{ballot.title}</Title>}
                subTitle={<QueueDescription />}
                description={
                    <>
                        <StatCard stats={b} />
                        <SquareIconButton
                            text="Push Ballot"
                            tabIndex={0}
                            classId="push-ballot-button"
                            onClick={() => console.log('log ballot id: ', ballot.id)}
                        >
                            <PushBallotIcon />
                        </SquareIconButton>
                    </>
                }
            />,
        )
    }

    return (
        <div className="ballots-queue">
            <Steps current={current} onChange={setCurrent} direction="vertical" className="queue">
                {queue}
            </Steps>
        </div>
    )
}
