import { CalendarOutlined } from '@ant-design/icons'
import { Space } from 'antd'
import Text from 'antd/lib/typography/Text'
import Title from 'antd/lib/typography/Title'
import { IElection } from 'core/models/election/IElection'
import { ElectionStatus } from 'core/models/election/ElectionStatus'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

export default function ElectionEntry({ election }: { election: IElection }): ReactElement {
    const [t] = useTranslation(['common', 'translation', 'election'])

    const colors = new Map()
    colors.set(ElectionStatus.NotStarted, 'not-started')
    colors.set(ElectionStatus.Started, 'in-progress')
    colors.set(ElectionStatus.Finished, 'finished')

    let dateString = election.openDate?.toDateString()

    if (election.status == ElectionStatus.Finished)
        dateString = t('election:Ended on ') + election.closeDate?.toDateString()

    return (
        <Link to="test" className={'election-entry ' + colors.get(election.status)}>
            <Title level={5}>{election.title}</Title>
            <Space align="center">
                <CalendarOutlined />
                <Text>{dateString}</Text>
            </Space>
        </Link>
    )
}
