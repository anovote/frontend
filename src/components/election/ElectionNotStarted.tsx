import { DeleteOutlined, EditOutlined, PlayCircleFilled } from '@ant-design/icons'
import { Col, List, Row, Space } from 'antd'
import Title from 'antd/lib/typography/Title'
import { ElectionStatusCard } from 'components/election/ElectionStatusCard'
import BallotPreviewList from 'components/previewList/BallotPreviewList'
import IconButton from 'containers/button/IconButton'
import { IBallot } from 'core/models/ballot/IBallot'
import { IBallotEntity } from 'core/models/ballot/IBallotEntity'
import { ElectionStatus } from 'core/models/election/ElectionStatus'
import { IElectionEntity } from 'core/models/election/IElectionEntity'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

export const ElectionNotStarted = ({
    election,
    onElectionChange,
    onElectionEdit,
}: {
    election: IElectionEntity
    onElectionChange: (election: IElectionEntity) => void
    onElectionEdit: () => void
}): ReactElement => {
    const [t] = useTranslation('common')
    const deleteElectionHandler = () => {
        // todo show confirmation modal
        console.log('handle click')
    }

    let timerId: NodeJS.Timeout | undefined = undefined

    const changeElectionToStarted = () => {
        const newElection: IElectionEntity = { ...election, status: ElectionStatus.Started }
        onElectionChange(newElection)
    }

    const editElection = () => {
        onElectionEdit()
    }

    const onChangeHandler = (ballots: IBallot[]) => {
        const newElection: IElectionEntity = { ...election, ballots }
        if (timerId) {
            console.log('clear timeout')
            clearTimeout(timerId)
        }
        timerId = setTimeout(async () => {
            console.log('update on server')
            timerId = undefined
            onElectionChange(newElection)
        }, 3000)
    }

    const ballots = election.ballots
        ? election.ballots.map((ballot, index) => ({ id: index, ...ballot } as IBallotEntity))
        : new Array<IBallotEntity>()

    return (
        <>
            <Row gutter={[32, 16]} align="top">
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
                    <Space align="start" wrap={true}>
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
                    {ballots.length > 0 ? (
                        <BallotPreviewList initialElection={election} onChange={onChangeHandler} />
                    ) : (
                        <div>{t('common:no-ballots')}</div>
                    )}
                </Col>
            </Row>
        </>
    )
}
