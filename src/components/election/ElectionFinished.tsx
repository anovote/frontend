import { DeleteOutlined, EditOutlined, PlayCircleFilled } from '@ant-design/icons'
import { Col, List, Row, Space } from 'antd'
import Title from 'antd/lib/typography/Title'
import { ElectionStatusCard } from 'components/election/ElectionStatusCard'
import PreviewList from 'components/previewList/PreviewList'
import BallotsQueue from 'components/queue/BallotsQueue'
import IconButton from 'containers/button/IconButton'
import BallotModal from 'containers/modal/BallotModal'
import { BallotEntity } from 'core/models/ballot/BallotEntity'
import { IBallot } from 'core/models/ballot/IBallot'
import { IBallotEntity } from 'core/models/ballot/IBallotEntity'
import { IBallotStats } from 'core/models/ballot/IBallotStats'
import { ElectionStatus } from 'core/models/election/ElectionStatus'
import { IElectionEntity } from 'core/models/election/IElectionEntity'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'

export const ElectionFinished = ({ election }: { election: IElectionEntity }): ReactElement => {
    const [t] = useTranslation(['common', 'election'])
    const [modal, setModal] = useState(false)
    const [active, setActive] = useState(0)
    const [stats, setStats] = useState([] as IBallotStats[])
    const deleteElectionHandler = () => {
        // todo show confirmation modal
        console.log('handle click')
    }

    const timerId: NodeJS.Timeout | undefined = undefined

    const ballots = election.ballots
        ? election.ballots.map((ballot, index) => ({ id: index, ...ballot } as IBallotEntity))
        : new Array<IBallotEntity>()

    /**
     * Display modal for a given ballot with id.
     * @param id the id to show modal for
     */
    const showModal = (id: number) => {
        setModal(true)
        console.log(id)
        setActive(id)
    }

    const closeModal = () => {
        setModal(false)
    }

    const hasNext = () => {
        if (ballots[active + 1]) {
            setActive(active + 1)
        }
    }

    const hasPrevious = () => {
        if (ballots[active - 1]) {
            setActive(active - 1)
        }
    }

    const findBallotWithId = (id: number) => {
        const ballot = ballots.find((ballot) => ballot.id === id)
        if (!ballot) return undefined
        return new BallotEntity(ballot)
    }
    return (
        <>
            <Row gutter={[32, 16]} align="top">
                <Col span={12}>
                    <Title>{election.title}</Title>
                    <Row justify="space-between">
                        <Col>
                            <Space>
                                <IconButton
                                    icon={<DeleteOutlined />}
                                    text="Delete"
                                    onClick={deleteElectionHandler}
                                    color="red"
                                />
                            </Space>
                        </Col>
                        <Col></Col>
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
                        <>
                            <BallotsQueue dataSource={ballots} stats={stats} expandBallot={showModal} />
                            <BallotModal
                                showModal={modal}
                                ballotEntity={findBallotWithId(active)}
                                ballotStats={stats[active]}
                                close={closeModal}
                                controls={{
                                    next: () => {
                                        console.log('next')
                                    },
                                    previous: () => {
                                        console.log('prev')
                                    },
                                }}
                            />
                        </>
                    ) : (
                        <div>No ballots! should this even be allowed</div>
                    )}
                </Col>
            </Row>
        </>
    )
}
