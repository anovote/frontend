import { Steps } from 'antd'
import Title from 'antd/lib/typography/Title'
import PushBallotIcon from 'components/icons/PushBallotIcon'
import StatCard from 'components/statCard/StatCard'
import SquareIconButton from 'containers/button/SquareIconButton'
import { BallotEntity } from 'core/models/ballot/BallotEntity'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'
import QueueDescription from './QueueDescription'

const { Step } = Steps

export default function BallotsQueue({ dataSource }: { dataSource: BallotEntity[] }): ReactElement {
    const [current, setCurrent] = useState(0)
    const [t] = useTranslation(['common'])

    const queue = []

    const stats = [
        { title: t('common:Total'), value: 143 },
        { title: t('common:Issues'), value: 23 },
        { title: t('Votes'), value: 94 },
    ]

    function pushBallot(id: number) {
        console.log('pushing ballot with id ', id)
    }

    for (const ballot of dataSource) {
        queue.push(
            <Step
                key={ballot.id}
                title={<Title level={4}>{ballot.title}</Title>}
                subTitle={<QueueDescription winner="John Doe" />}
                description={
                    <>
                        <StatCard stats={stats} />
                        <SquareIconButton
                            text={t('common:Push ballot')}
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
