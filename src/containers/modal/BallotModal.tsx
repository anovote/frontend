import { Bar } from '@ant-design/charts'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import Modal from 'antd/lib/modal/Modal'
import Title from 'antd/lib/typography/Title'
import { BallotStatusLabel } from 'components/ElectionStatusLabel'
import { IStatValue } from 'components/statCard/IStatValue'
import StatCard from 'components/statCard/StatCard'
import IconButton from 'containers/button/IconButton'
import { IControl } from 'core/helpers/IControl'
import { BallotWithVotes } from 'core/models/ballot/BallotWithVotes'
import { IVoteStats } from 'core/models/ballot/IVoteStats'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

export default function BallotModal({
    showModal,
    close,
    controls,
    ballot,
}: {
    showModal: boolean
    close: () => void
    controls: IControl
    ballot: BallotWithVotes
}): ReactElement {
    const [t] = useTranslation(['translation', 'common'])
    const { previous, next } = controls
    // cross reference stats with a candidate
    const diagramStats = ballot
        .getVoteStatsWithCandidates()
        .candidates // Sorts ballots in decreasing order
        .sort((statsA, statsB) => {
            return statsB.votes - statsA.votes
        })

    const config = {
        width: 600,
        height: 400,
        autoFit: true,
        xField: 'votes',
        yField: 'candidate',
        seriesField: 'candidate',
        yAxis: {
            label: null,
        },
    }

    const appendStats = (stats: IVoteStats): IStatValue[] => {
        return [
            { title: t('common:Total'), value: stats.total },
            { title: t('common:Votes'), value: stats.votes },
            { title: t('common:Blank'), value: stats.blank },
        ]
    }

    const footer = (
        <div className="spread">
            <IconButton
                text={t('common:Previous')}
                tabIndex={0}
                onClick={previous}
                reverse={true}
                icon={<LeftOutlined />}
            ></IconButton>
            <IconButton text={t('common:Next')} tabIndex={0} onClick={next} icon={<RightOutlined />}></IconButton>
        </div>
    )

    return (
        <>
            {ballot && (
                <Modal
                    width={'100vw'}
                    title={
                        <>
                            <Title level={2}>{ballot.title}</Title>
                            <BallotStatusLabel status={ballot.status} />
                        </>
                    }
                    footer={footer}
                    visible={showModal}
                    onCancel={close}
                    className="modal-display-small ballot-modal"
                >
                    <header>
                        {!!ballot.description && <p className="ballot-description">{ballot.description}</p>}
                        {ballot.votes && <StatCard stats={appendStats(ballot.votes)} />}
                    </header>
                    <section className="ballot-chart">
                        <Title level={3}>{t('common:Votes')}</Title>
                        {diagramStats && <Bar data={diagramStats} {...config} />}
                    </section>
                </Modal>
            )}
        </>
    )
}
