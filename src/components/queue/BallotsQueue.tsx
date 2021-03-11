import { Steps } from 'antd'
import Title from 'antd/lib/typography/Title'
import PushBallotIcon from 'components/icons/PushBallotIcon'
import StatCard from 'components/statCard/StatCard'
import SquareIconButton from 'containers/button/SquareIconButton'
import { IBallotEntity } from 'core/models/ballot/IBallotEntity'
import { ElectionEventService } from 'core/service/election/ElectionEventService'
import { useSocket } from 'core/state/websocket/useSocketHook'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'
import QueueDescription from './QueueDescription'

const { Step } = Steps

export default function BallotsQueue({ dataSource }: { dataSource: IBallotEntity[] }): ReactElement {
    const [current, setCurrent] = useState(0)
    const [t] = useTranslation(['common'])
    const [socket] = useSocket()
    const electionEventService: ElectionEventService = new ElectionEventService(socket)

    const queue = []

    const stats = [
        { title: t('common:Total'), value: 143 },
        { title: t('common:Issues'), value: 23 },
        { title: t('Votes'), value: 94 },
    ]

    async function pushBallot(id: number) {
        console.log('pushing ballot with id ', id)
        const ballot = dataSource.find((ballot) => ballot.id === id)
        console.log(ballot)
        const electionId = 1
        if (ballot) {
            const ack = await electionEventService.broadcastBallot(ballot, electionId)
            // todo button should be loading until ack is received
            console.log(ack)
        }
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
