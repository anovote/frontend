import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import { Col, Row } from 'antd'
import Modal from 'antd/lib/modal/Modal'
import Title from 'antd/lib/typography/Title'
import StatCard from 'components/statCard/StatCard'
import { IControl } from 'core/helpers/IControl'
import { BallotEntity } from 'core/models/ballot/BallotEntity'
import { BallotVoteStats } from 'core/models/ballot/BallotVoteStats'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

export default function BallotModal({
    showModal,
    close,
    controls,
    ballotStats,
    ballotEntity,
}: {
    showModal: boolean
    close: () => void
    controls: IControl
    ballotStats: BallotVoteStats
    ballotEntity: BallotEntity
}): ReactElement {
    const [t] = useTranslation(['translation', 'common'])
    const { previous, next } = controls
    const { total, votes, blank, candidates } = ballotStats
    const footer = (
        <div className="spread">
            <button onClick={previous} className="inline-icon text-label button-no-style">
                <LeftOutlined />
                <div>{t('common:Previous')}</div>
            </button>
            <button onClick={next} className="inline-icon text-label button-no-style">
                <div>{t('common:Next')}</div>
                <RightOutlined />
            </button>
        </div>
    )

    const voteStats = [
        { title: t('common:Total'), value: total },
        { title: t('common:Vote_plural'), value: votes },
        { title: t('common:Blank'), value: blank },
    ]

    return (
        <>
            <Modal
                width={'100vw'}
                // TODO Add status ICON implementation here when merged
                title={ballotEntity.status}
                footer={footer}
                visible={showModal}
                onCancel={close}
                className="modal-display-small"
            >
                <Row>
                    <Col span={24}>
                        <Title level={2}>{ballotEntity.title}</Title>
                        <div>
                            <StatCard stats={voteStats} inverseColors={true} />
                        </div>
                    </Col>
                    <Col span={24}>
                        {/*This mapping is for representation til we have a graph library */}
                        {candidates.map((candidate, index) => {
                            return (
                                <div key={index}>
                                    Name: {candidate.candidate} Votes: {candidate.votes}
                                </div>
                            )
                        })}
                    </Col>
                </Row>
            </Modal>
        </>
    )
}
