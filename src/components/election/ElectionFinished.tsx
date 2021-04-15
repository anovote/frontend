import { DeleteOutlined, EditOutlined, PlayCircleFilled } from '@ant-design/icons'
import { Col, List, Row, Space } from 'antd'
import Title from 'antd/lib/typography/Title'
import { ElectionStatusCard } from 'components/election/ElectionStatusCard'
import PreviewList from 'components/previewList/PreviewList'
import BallotsQueue from 'components/queue/BallotsQueue'
import IconButton from 'containers/button/IconButton'
import BallotModal from 'containers/modal/BallotModal'
import { fetchElectionStats } from 'core/helpers/fetchElectionStats'
import { BallotEntity } from 'core/models/ballot/BallotEntity'
import { IBallot } from 'core/models/ballot/IBallot'
import { IBallotEntity } from 'core/models/ballot/IBallotEntity'
import { IBallotStats } from 'core/models/ballot/IBallotStats'
import { ElectionStatus } from 'core/models/election/ElectionStatus'
import { IElectionEntity } from 'core/models/election/IElectionEntity'
import { LocalStorageService } from 'core/service/storage/LocalStorageService'
import { StorageKeys } from 'core/service/storage/StorageKeys'
import React, { ReactElement, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

export const ElectionFinished = ({ election }: { election: IElectionEntity }): ReactElement => {
    const [t] = useTranslation(['common', 'election'])
    const [modal, setModal] = useState(false)
    const [active, setActive] = useState(0)
    const [stats, setStats] = useState<IBallotStats[]>([])
    const [activeBallot, setActiveBallot] = useState<{ ballot: BallotEntity; stats: IBallotStats }>()
    const [ballots, setballots] = useState<Array<IBallotEntity>>([])
    useEffect(() => {
        const storageService = new LocalStorageService<StorageKeys>()

        fetchElectionStats(election.id)
            .then((serverStats) => {
                console.log(serverStats)

                setStats(serverStats)
            })
            .catch((err) => {
                console.log(err)
            })

        const b = election.ballots
            ? election.ballots.map((ballot, index) => new BallotEntity(ballot as IBallotEntity))
            : new Array<IBallotEntity>()
        setballots(b)
    }, [])
    const deleteElectionHandler = () => {
        // todo show confirmation modal
        console.log('handle click')
    }

    /**
     * Display modal for a given ballot with id.
     * @param id the id to show modal for
     */
    const showModal = (id: number) => {
        const ballot = findBallotWithId(id)
        const stat = stats.find((s) => s.ballotId == id) as IBallotStats
        console.log('ACTIVE')
        console.log(stat)

        if (ballot) setActiveBallot({ ballot, stats: stat })

        setActive(id)
        setModal(true)
    }

    const closeModal = () => {
        setModal(false)
        setActive(-1)
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
        console.log(ballot)

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
                                ballotEntity={activeBallot?.ballot}
                                ballotStats={activeBallot?.stats}
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
