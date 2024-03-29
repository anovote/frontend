import { CheckCircleOutlined, FormOutlined } from '@ant-design/icons'
import { StepProps, Steps } from 'antd'
import Title from 'antd/lib/typography/Title'
import PushBallotIcon from 'components/icons/PushBallotIcon'
import { IStatValue } from 'components/statCard/IStatValue'
import StatCard from 'components/statCard/StatCard'
import IconButton from 'containers/button/IconButton'
import { BallotStatus } from 'core/models/ballot/BallotStatus'
import { BallotWithVotes } from 'core/models/ballot/BallotWithVotes'
import { IBallotEntity } from 'core/models/ballot/IBallotEntity'
import { IVoteStats } from 'core/models/ballot/IVoteStats'
import React, { ReactElement, ReactNode, useEffect, useState } from 'react'
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
    const [t] = useTranslation(['common, ballot'])
    const [current, setCurrent] = useState(0)
    const [isLoading, setIsLoading] = useState(false)
    const [queue, setQueue] = useState<ReactElement<StepProps>[]>()

    const appendStats = (stats: IVoteStats | undefined): IStatValue[] | [] => {
        if (stats) {
            return [
                { title: t('common:Total'), value: stats.total },
                { title: t('common:Votes'), value: stats.votes },
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

    /**
     * Returns true if the ballot can be pushed, else false
     * @param ballot the ballot to check
     * @returns returns true if it can be pushed or else false
     */
    const canPushBallot = (ballot: IBallotEntity) => {
        let canPush = false
        if (doPushBallot && (ballot.status == BallotStatus.IN_QUEUE || ballot.status == BallotStatus.IN_PROGRESS)) {
            canPush = true
        }
        return canPush
    }

    useEffect(() => {
        const statsQueue: ReactElement<StepProps>[] = []
        for (const ballot of dataSource) {
            statsQueue.push(
                // todo make loading state follow the component
                <>
                    <Step
                        key={ballot.id}
                        title={<Title level={4}>{ballot.title}</Title>}
                        subTitle={<QueueDescription winner={ballot.getBallotLeader()} />}
                        description={
                            <>
                                {ballot && (
                                    <StatCard
                                        stats={appendStats(ballot.votes)}
                                        onClick={() => handleClick(ballot.id)}
                                    />
                                )}
                            </>
                        }
                    />
                    {canPushBallot(ballot) && (
                        <IconButton
                            key={ballot.id * -1}
                            text={t('common:Push ballot')}
                            tabIndex={0}
                            classId="push-ballot-button"
                            onClick={() => onPushBallot(ballot.id)}
                            icon={<PushBallotIcon spin={isLoading} />}
                        ></IconButton>
                    )}
                </>,
            )
        }
        setQueue(statsQueue)
        // Re-renders queue, when stats or data source changes
    }, [dataSource, isLoading])

    return (
        <div className="ballots-queue">
            <Steps
                progressDot={(_: ReactNode, step: IProgressDot) => {
                    switch (step.status) {
                        case 'error':
                            break
                        case 'process':
                            return <FormOutlined />
                        case 'finish':
                            return <CheckCircleOutlined className="ant-steps-finish-icon"></CheckCircleOutlined>
                        case 'wait':
                            return step.index == 0 ? 1 : Math.floor(step.index / 2) + 1
                        default:
                            return step.index
                    }
                }}
                current={current}
                onChange={onActiveBallotChange}
                direction="vertical"
                className="queue"
            >
                {queue}
            </Steps>
        </div>
    )
}
/**
 * Antd progress dot interface
 */
interface IProgressDot {
    index: number
    status: 'wait' | 'process' | 'finish' | 'error'
    title: string
    description: string
}
