import { StepProps, Steps } from 'antd'
import Title from 'antd/lib/typography/Title'
import PushBallotIcon from 'components/icons/PushBallotIcon'
import { IStatValue } from 'components/statCard/IStatValue'
import StatCard from 'components/statCard/StatCard'
import SquareIconButton from 'containers/button/SquareIconButton'
import { BallotStatus } from 'core/models/ballot/BallotStatus'
import { BallotWithVotes } from 'core/models/ballot/BallotWithVotes'
import { IVoteStats } from 'core/models/ballot/IVoteStats'
import React, { ReactElement, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import QueueDescription from './QueueDescription'

const { Step } = Steps

export default function BallotsQueue({
    dataSource,
    expandBallot,
    doPushBallot,
}: {
    dataSource: Array<BallotWithVotes>
    expandBallot?: (id: number) => void
    doPushBallot?: (id: number) => void
}): ReactElement {
    const [t] = useTranslation(['common'])
    const [current, setCurrent] = useState(0)
    const [isLoading, setIsLoading] = useState(false)
    const [queue, setQueue] = useState<ReactElement<StepProps>[]>()
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

    async function onPushBallot(id: number) {
        if (doPushBallot) {
            setIsLoading(true)
            doPushBallot(id)
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
                            {BallotStatus[ballot.status]}
                            {ballot.status}
                            {ballot && (
                                <StatCard stats={appendStats(ballot.votes)} onClick={() => handleClick(ballot.id)} />
                            )}
                            {doPushBallot && (
                                <SquareIconButton
                                    text={t('common:Push ballot')}
                                    tabIndex={0}
                                    classId="push-ballot-button"
                                    onClick={() => onPushBallot(ballot.id)}
                                >
                                    <PushBallotIcon spin={isLoading} />
                                </SquareIconButton>
                            )}{' '}
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
