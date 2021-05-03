import { CalendarOutlined } from '@ant-design/icons'
import { Space } from 'antd'
import Text from 'antd/lib/typography/Text'
import Title from 'antd/lib/typography/Title'
import { ElectionEntity } from 'core/models/election/ElectionEntity'
import { ElectionStatus } from 'core/models/election/ElectionStatus'
import { getAdminRoute } from 'core/routes/siteRoutes'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

/**
 * Takes a election object and displays it according to its status.
 * The date label will change based on the status of the election.
 * @param election a election entity to create the entry for
 * @returns ReactElement
 */
export default function ElectionEntry({ election }: { election: ElectionEntity }): ReactElement {
    const [t] = useTranslation(['common', 'translation', 'election'])

    const colors = new Map()
    colors.set(ElectionStatus.NotStarted, 'not-started')
    colors.set(ElectionStatus.Started, 'in-progress')
    colors.set(ElectionStatus.Finished, 'finished')

    let dateLabel
    let dateString

    switch (election.status) {
        case ElectionStatus.NotStarted:
            dateLabel = t('election:Opens on')
            dateString = election.openDate?.toLocaleDateString()
            break

        case ElectionStatus.Started:
            dateLabel = t('election:Opened on')
            dateString = election.openDate?.toLocaleDateString()
            break

        case ElectionStatus.Finished:
            dateLabel = t('election:Closed on')
            dateString = election.closeDate?.toLocaleDateString()
            break
        default:
            dateString = ''
            break
    }

    return (
        <Link
            to={`${getAdminRoute().elections.view}/${election.id}`}
            className={'election-entry ' + colors.get(election.status)}
        >
            <Title level={5}>{election.title}</Title>
            {election.openDate && (
                <Space direction="vertical" size="small" className="date-space">
                    <Text className="date-label">{dateLabel}</Text>
                    <Space align="center">
                        <CalendarOutlined />
                        <Text>{dateString}</Text>
                    </Space>
                </Space>
            )}
        </Link>
    )
}
