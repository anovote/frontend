import { Space } from 'antd'
import Item from 'antd/lib/list/Item'
import Title from 'antd/lib/typography/Title'
import CardList from 'components/cards/CardList'
import ElectionEntry from 'components/list/entries/electionEntry'
import ElectionHeader from 'components/list/headers/electionHeader'
import { ElectionStatus } from 'core/models/election/ElectionStatus'
import { IElectionEntity } from 'core/models/election/IElectionEntity'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function ElectionsView(): React.ReactElement {
    const [t] = useTranslation(['common', 'election'])
    const [upcoming, setUpcoming] = useState([] as IElectionEntity[])
    const [inProgress, setInProgress] = useState([] as IElectionEntity[])
    const [finished, setFinished] = useState([] as IElectionEntity[])
    const data: IElectionEntity[] = [
        {
            id: 1,
            electionOrganizer: 1,
            description: 'This is a election description',
            title: 'My first election',
            isAutomatic: false,
            isLocked: true,
            status: ElectionStatus.NotStarted,
            openDate: new Date(2021, 3, 1, 10, 0),
            closeDate: new Date(2021, 5, 1, 10, 0),
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            id: 2,
            electionOrganizer: 1,
            description: 'This is a election description',
            title: 'My first election',
            isAutomatic: false,
            isLocked: true,
            status: ElectionStatus.Finished,
            openDate: new Date(2021, 3, 1, 10, 0),
            closeDate: new Date(2021, 5, 1, 10, 0),
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            id: 3,
            electionOrganizer: 1,
            description: 'This is a election description',
            title: 'My second election',
            isAutomatic: false,
            isLocked: true,
            status: ElectionStatus.Started,
            openDate: new Date(2021, 3, 1, 10, 0),
            closeDate: new Date(2021, 5, 1, 10, 0),
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            id: 4,
            electionOrganizer: 1,
            description: 'This is a election description',
            title: 'My third election',
            isAutomatic: false,
            isLocked: true,
            status: ElectionStatus.NotStarted,
            openDate: new Date(2021, 3, 1, 10, 0),
            closeDate: new Date(2021, 5, 1, 10, 0),
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    ]
    useEffect(() => {
        const upcoming: IElectionEntity[] = []
        const started: IElectionEntity[] = []
        const finished: IElectionEntity[] = []
        for (const election of data) {
            if (election.status == ElectionStatus.NotStarted) upcoming.push(election)
            if (election.status == ElectionStatus.Started) started.push(election)
            if (election.status == ElectionStatus.Finished) finished.push(election)
        }

        setUpcoming(upcoming)
        setInProgress(started)
        setFinished(finished)
    }, [])

    /**
     * Generates the list entry with correct elements.
     * @param item the election object to render in list
     */
    const render = (item: IElectionEntity) => {
        return (
            <Item>
                <ElectionEntry election={item} />
            </Item>
        )
    }

    return (
        <>
            <Title>{t('common:Elections')}</Title>
            <Space align="start" wrap={true}>
                <CardList
                    listHeader={
                        <ElectionHeader
                            status={ElectionStatus.NotStarted}
                            title={t('election:To be held')}
                            count={upcoming.length}
                        />
                    }
                    list={upcoming}
                    renderItem={(item) => render(item)}
                    classNames="election-card"
                ></CardList>
                <CardList
                    listHeader={
                        <ElectionHeader
                            status={ElectionStatus.Started}
                            title={t('election:In progress')}
                            count={inProgress.length}
                        />
                    }
                    renderItem={(item) => render(item)}
                    list={inProgress}
                    classNames="election-card"
                ></CardList>
                <CardList
                    listHeader={
                        <ElectionHeader
                            status={ElectionStatus.Finished}
                            title={t('election:Finished')}
                            count={finished.length}
                        />
                    }
                    list={finished}
                    renderItem={(item) => render(item)}
                    classNames="election-card"
                ></CardList>
            </Space>
        </>
    )
}
