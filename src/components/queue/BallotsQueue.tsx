import { StepProps, Steps } from 'antd'
import Title from 'antd/lib/typography/Title'
import PushBallotIcon from 'components/icons/PushBallotIcon'
import StatCard from 'components/statCard/StatCard'
import SquareIconButton from 'containers/button/SquareIconButton'
import { IBallotEntity } from 'core/models/ballot/IBallotEntity'
import { ElectionEventService } from 'core/service/election/ElectionEventService'
import { useSocket } from 'core/hooks/useSocket'
import React, { ReactElement, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router'
import { ElectionParams } from './ElectionParams'
import QueueDescription from './QueueDescription'
import { IBallotStats } from 'core/models/ballot/IBallotStats'
import { IStatValue } from 'components/statCard/IStatValue'

const { Step } = Steps

export default function BallotsQueue({
    dataSource,
    stats,
    expandBallot,
}: {
    dataSource: IBallotEntity[]
    stats?: IBallotStats[]
    expandBallot?: (id: number) => void
}): ReactElement {
    const [current, setCurrent] = useState(0)
    const [queue, setQueue] = useState<ReactElement<StepProps>[]>()
    const [t] = useTranslation(['common'])
    const [socket] = useSocket()
    const { electionId } = useParams<ElectionParams>()

    const electionEventService: ElectionEventService = new ElectionEventService(socket)
    const [isLoading, setIsLoading] = useState(false)

    const appendStats = (stats: IBallotStats | undefined): IStatValue[] | [] => {
        console.log(stats)

        if (stats) {
            return [
                { title: t('common:Total'), value: stats.stats.total },
                { title: t('Votes'), value: stats.stats.votes },
                { title: t('common:Blank'), value: stats.stats.blank },
            ]
        }

        return []
    }

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

    const handleClick = (id: number) => {
        if (expandBallot) expandBallot(id)
    }

    // render all ballots
    useEffect(() => {
        const q: ReactElement<StepProps>[] = []
        for (const ballot of dataSource) {
            let ballotStat = null
            if (stats) {
                ballotStat = stats.find((stat) => {
                    return stat.ballotId === ballot.id
                })
                console.log(ballot)
                console.log(ballotStat)
            }

            q.push(
                // todo make loading state follow the component
                <Step
                    key={ballot.id}
                    title={<Title level={4}>{ballot.title}</Title>}
                    subTitle={<QueueDescription winner="John Doe" />}
                    description={
                        <>
                            {ballotStat && (
                                <StatCard stats={appendStats(ballotStat)} onClick={() => handleClick(ballot.id)} />
                            )}

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
        setQueue(q)
    }, [dataSource, stats])
    return (
        <div className="ballots-queue">
            <Steps current={current} onChange={setCurrent} direction="vertical" className="queue">
                {queue}
            </Steps>
        </div>
    )
}
