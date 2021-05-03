import { Space } from 'antd'
import Item from 'antd/lib/list/Item'
import Title from 'antd/lib/typography/Title'
import { AlertList } from 'components/alert/AlertList'
import CardList from 'components/cards/CardList'
import ElectionEntry from 'components/list/entries/electionEntry'
import ElectionHeader from 'components/list/headers/electionHeader'
import { BackendAPI } from 'core/api'
import { useAlert } from 'core/hooks/useAlert'
import { ElectionEntity } from 'core/models/election/ElectionEntity'
import { ElectionStatus } from 'core/models/election/ElectionStatus'
import { ElectionService } from 'core/service/election/ElectionService'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function ElectionsView(): React.ReactElement {
    const [t] = useTranslation(['common', 'election'])

    const [upcoming, setUpcoming] = useState([] as ElectionEntity[])
    const [inProgress, setInProgress] = useState([] as ElectionEntity[])
    const [finished, setFinished] = useState([] as ElectionEntity[])

    const { alertStates, dispatchAlert } = useAlert()

    useEffect(() => {
        new ElectionService(BackendAPI)
            .getAllElection()
            .then((response) => {
                const upcoming: ElectionEntity[] = []
                const started: ElectionEntity[] = []
                const finished: ElectionEntity[] = []

                for (const election of response) {
                    const electionEntity = new ElectionEntity(election)
                    if (election.status == ElectionStatus.NotStarted) upcoming.push(electionEntity)
                    if (election.status == ElectionStatus.Started) started.push(electionEntity)
                    if (election.status == ElectionStatus.Finished) finished.push(electionEntity)
                }

                setUpcoming(upcoming)
                setInProgress(started)
                setFinished(finished)
            })
            .catch((error) => {
                console.log(error)
            })
    }, [])

    /**
     * Generates the list entry with correct elements.
     * @param item the election object to render in list
     */
    const render = (item: ElectionEntity) => {
        return (
            <Item>
                <ElectionEntry election={item} />
            </Item>
        )
    }

    return (
        <>
            <AlertList alerts={alertStates} onRemove={(index) => dispatchAlert({ type: 'remove', index: index })} />
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
