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
import { useParams } from 'react-router'
import { ElectionParams } from './ElectionParams'
import QueueDescription from './QueueDescription'

const { Step } = Steps

export default function BallotsQueue({ dataSource }: { dataSource: IBallotEntity[] }): ReactElement {
    const [current, setCurrent] = useState(0)
    const [t] = useTranslation(['common'])
    const [socket] = useSocket()
    const { electionId } = useParams<ElectionParams>()
    console.log(electionId)

    const electionEventService: ElectionEventService = new ElectionEventService(socket)
    const [isLoading, setIsLoading] = useState(false)

    const queue = []

    const stats = [
        { title: t('common:Total'), value: 143 },
        { title: t('common:Issues'), value: 23 },
        { title: t('Votes'), value: 94 },
    ]

    async function pushBallot(id: number) {
        setIsLoading(true)
        // todo #127 pushing a ballot should change some state on the ballot on the server to indicate that it has been published
        console.log('pushing ballot with id ', id)
        const ballot = dataSource.find((ballot) => ballot.id === id)
        console.log(ballot)
        if (ballot && electionId) {
            const electionIdInt = Number.parseInt(electionId)
            const ack = await electionEventService.broadcastBallot(ballot, electionIdInt)
            // todo button should be loading until ack is received
            console.log(ack)
        }
    }

    // render all ballots
    for (const ballot of dataSource) {
        queue.push(
            // todo make loading state follow the component
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
                            <PushBallotIcon spin={isLoading} />
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
