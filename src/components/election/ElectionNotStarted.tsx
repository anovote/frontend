import {
    DeleteOutlined,
    EditOutlined,
    ForwardFilled,
    PlayCircleFilled,
    PlayCircleOutlined,
    PlaySquareOutlined,
} from '@ant-design/icons'
import { Col, List, Popconfirm, Row, Space } from 'antd'
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
}: ElectionNotStartedProps): ReactElement => {
    const [t] = useTranslation(['common', 'election'])
    const deleteElectionHandler = () => {
        onElectionChange(election, true)
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
            <Title>{election.title}</Title>
            <div className="split-view">
                <div className="split-view-left">
                    <div>{election.description}</div>
                    <div className="mb-10">
                        <Space wrap={true} direction={'horizontal'}>
                            <IconButton
                                icon={<ForwardFilled />}
                                text="Begin"
                                onClick={changeElectionToStarted}
                                color="success"
                            />
                            <Popconfirm
                                title={t('election:Are you sure you want to delete the election')}
                                onConfirm={deleteElectionHandler}
                            >
                                <IconButton icon={<DeleteOutlined />} text="Delete" color="danger" />
                            </Popconfirm>
                            <IconButton icon={<EditOutlined />} text="Edit election" onClick={editElection} />
                        </Space>
                    </div>
                    <ElectionStatusCard {...{ election }} />
                    <Title level={2}>{t('common:Eligible voters')}</Title>
                    <List
                        id="voters-list"
                        locale={{ emptyText: t('election:No eligible voters') }}
                        dataSource={election.eligibleVoters}
                        renderItem={(item) => <List.Item>{item.identification}</List.Item>}
                    />
                </div>
                <div className="split-view-right">
                    <Title level={2}>{t('common:Ballots')}</Title>
                    {ballots.length > 0 ? (
                        <BallotPreviewList initialElection={election} onChange={onChangeHandler} />
                    ) : (
                        <span>{t('common:no-ballots')}</span>
                    )}
                </div>
            </div>
        </>
    )
}

interface ElectionNotStartedProps {
    election: IElectionEntity
    onElectionChange: (election: IElectionEntity, toDelete?: boolean) => void
    onElectionEdit: () => void
}
