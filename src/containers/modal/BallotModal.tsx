import { Bar } from '@ant-design/charts'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import { Col, Row } from 'antd'
import Modal from 'antd/lib/modal/Modal'
import Title from 'antd/lib/typography/Title'
import { IStatValue } from 'components/statCard/IStatValue'
import StatCard from 'components/statCard/StatCard'
import { IControl } from 'core/helpers/IControl'
import { BallotEntity } from 'core/models/ballot/BallotEntity'
import { IBallotStats } from 'core/models/ballot/IBallotStats'
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
    ballotStats?: IBallotStats
    ballotEntity: BallotEntity
}): ReactElement {
    const [t] = useTranslation(['translation', 'common'])
    const { previous, next } = controls

    const config = {
        width: 600,
        height: 400,
        autoFit: false,
        xField: 'votes',
        yField: 'candidate',
        seriesField: 'candidate',
    }

    const appendStats = (stats: IBallotStats): IStatValue[] => {
        return [
            { title: t('common:Total'), value: stats.total },
            { title: t('common:Votes'), value: stats.votes },
            { title: t('common:Blank'), value: stats.blank },
        ]
    }

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

    return (
        <>
            <Modal
                width={'100vw'}
                // TODO Add status ICON implementation here when merged
                title={ballotEntity.status == 1 ? 'IN PROGRESS' : 'NOT STARTED'}
                footer={footer}
                visible={showModal}
                onCancel={close}
                className="modal-display-small"
            >
                <Row>
                    <Col span={24}>
                        <Title level={2}>{ballotEntity.title}</Title>
                        <div>{ballotStats && <StatCard stats={appendStats(ballotStats)} />}</div>
                    </Col>
                    <Col span={24}>{ballotStats && <Bar data={ballotStats?.candidates} {...config} />}</Col>
                </Row>
            </Modal>
        </>
    )
}
