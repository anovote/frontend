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

    const stats = [
        { title: 'Total', value: 143 },
        { title: 'Issues', value: 23 },
        { title: 'Votes', value: 94 },
    ]

    function pushBallot(id: number) {
        console.log('pushing ballot with id ', id)
    }

    for (const ballot of dataSource) {
        queue.push(
            <Step
                key={ballot.id}
                title={<Title level={4}>{ballot.title}</Title>}
                subTitle={<QueueDescription />}
                description={
                    <>
                        <StatCard stats={stats} />
                        <SquareIconButton
                            text="Push Ballot"
                            tabIndex={0}
                            classId="push-ballot-button"
                            onClick={() => pushBallot(ballot.id)}
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
