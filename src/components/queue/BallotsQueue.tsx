import { StepProps, Steps } from 'antd'
import Title from 'antd/lib/typography/Title'
import PushBallotIcon from 'components/icons/PushBallotIcon'
import { IStatValue } from 'components/statCard/IStatValue'
import StatCard from 'components/statCard/StatCard'
import SquareIconButton from 'containers/button/SquareIconButton'
import { useSocket } from 'core/hooks/useSocket'
import { BallotWithVotes } from 'core/models/ballot/BallotWithVotes'
import { ICandidateEntity } from 'core/models/ballot/ICandidate'
import { IVoteStats } from 'core/models/ballot/IVoteStats'
import { ElectionEventService } from 'core/service/election/ElectionEventService'
import React, { ReactElement, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router'
import { ElectionParams } from './ElectionParams'
import QueueDescription from './QueueDescription'

const { Step } = Steps

export default function BallotsQueue({
    dataSource,
    expandBallot,
}: {
    dataSource: Array<BallotWithVotes>
    expandBallot?: (id: number) => void
}): ReactElement {
    const [socket] = useSocket()
    const [t] = useTranslation(['common'])
    const [current, setCurrent] = useState(0)
    const [isLoading, setIsLoading] = useState(false)
    const { electionId } = useParams<ElectionParams>()
    const [queue, setQueue] = useState<ReactElement<StepProps>[]>()
    const electionEventService: ElectionEventService = new ElectionEventService(socket)
    const appendStats = (stats: IVoteStats | undefined): IStatValue[] | [] => {
        if (stats) {
            return [
                { title: t('common:Total'), value: stats.total },
                { title: t('Votes'), value: stats.votes },
                { title: t('common:Blank'), value: stats.blank },
            ]
        }

        return []
    }

    async function pushBallot(id: number) {
        setIsLoading(true)
        // todo #127 pushing a ballot should change some state on the ballot on the server to indicate that it has been published
        const ballot = dataSource.find((ballot) => ballot.id === id)
        if (ballot && electionId) {
            const electionIdInt = Number.parseInt(electionId)
            await electionEventService.broadcastBallot(ballot, electionIdInt)
            // todo button should be loading until ack is received
        }
    }

    const handleClick = (id: number) => {
        if (expandBallot) expandBallot(id)
    }

    // Handler for when the active ballot queue card changes.
    // Disables loading state and set the current active ballot card
    const onActiveBallotChange = (id: number) => {
        setIsLoading(false)
        setCurrent(id)
    }

    useEffect(() => {
        const statsQueue: ReactElement<StepProps>[] = []
        for (const ballot of dataSource) {
            statsQueue.push(
                // todo make loading state follow the component
                <Step
                    key={ballot.id}
                    title={<Title level={4}>{ballot.title}</Title>}
                    subTitle={<QueueDescription winner={ballot.getBallotLeader()} />}
                    description={
                        <>
                            {ballot && (
                                <StatCard stats={appendStats(ballot.votes)} onClick={() => handleClick(ballot.id)} />
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
        setQueue(statsQueue)
        // Re-renders queue, when stats or data source changes
    }, [dataSource, isLoading])

    return (
        <div className="ballots-queue">
            <Steps current={current} onChange={onActiveBallotChange} direction="vertical" className="queue">
                {queue}
            </Steps>
        </div>
    )
}
