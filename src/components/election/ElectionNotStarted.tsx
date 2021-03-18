import { DeleteOutlined, EditOutlined, PlayCircleFilled } from '@ant-design/icons'
import { Col, List, Row, Space } from 'antd'
import Title from 'antd/lib/typography/Title'
import BallotsQueue from 'components/queue/BallotsQueue'
import IconButton from 'containers/button/IconButton'
import { IBallotEntity } from 'core/models/ballot/IBallotEntity'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { ElectionStatusCard } from 'components/election/ElectionStatusCard'
import { IElection } from 'core/models/election/IElectionEntity'
import { ElectionStatus } from 'core/models/election/ElectionStatus'

export const ElectionNotStarted = ({
    election,
    onElectionChange,
    onElectionEdit,
}: {
    election: IElection
    onElectionChange: (election: IElection) => void
    onElectionEdit: () => void
}): ReactElement => {
    const [t] = useTranslation('common')
    const deleteElectionHandler = () => {
        // todo show confirmation modal
        console.log('handle click')
    }

    const changeElectionToStarted = () => {
        const newElection: IElection = { ...election, status: ElectionStatus.Started }
        onElectionChange(newElection)
    }

    const editElection = () => {
        onElectionEdit()
    }

    const ballots = election.ballots
        ? election.ballots.map((ballot, index) => ({ id: index, ...ballot } as IBallotEntity))
        : new Array<IBallotEntity>()

    return (
        <>
            <Row gutter={[16, 32]} align="top">
                <Col span={12}>
                    <Title>{election.title}</Title>
                    <Row justify="space-between">
                        <Col>
                            <Space>
                                <IconButton
                                    icon={<PlayCircleFilled />}
                                    text="Begin"
                                    onClick={changeElectionToStarted}
                                    color="green"
                                />
                                <IconButton
                                    icon={<DeleteOutlined />}
                                    text="Delete"
                                    onClick={deleteElectionHandler}
                                    color="red"
                                />
                            </Space>
                        </Col>
                        <Col>
                            <IconButton icon={<EditOutlined />} text="Edit election" onClick={editElection} />
                        </Col>
                    </Row>
                    <Space>
                        <ElectionStatusCard {...{ election }} />
                        <div>{election.description}</div>
                    </Space>
                    <Title level={2}>{t('common:Eligible voters')}</Title>
                    <List
                        id="voters-list"
                        dataSource={election.eligibleVoters}
                        renderItem={(item) => <List.Item>{item.identification}</List.Item>}
                    />
                </Col>
                <Col span={12}>
                    <Title level={2}>{t('common:Ballots')}</Title>
                    {ballots.length > 0 ? <BallotsQueue dataSource={ballots} /> : <div>{t('common:no-ballots')}</div>}
                </Col>
            </Row>
        </>
    )
}
