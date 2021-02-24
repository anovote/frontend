import { Card, List } from 'antd'
import { IElection } from 'core/models/IElection'
import { ElectionStatus } from 'core/models/IElectionStatus'
import React, { ReactElement } from 'react'
import ElectionEntry from './electionEntry'
import ElectionHeader from './electionHeader'
interface ElectionCardProps {
    type: ElectionStatus
    title: string
    data?: IElection[]
    // in rem
    minHeight?: number
}
export default function ElectionCard({ type, title, data, minHeight }: ElectionCardProps): ReactElement {
    return (
        <Card className="election-card" style={{ minHeight: minHeight + 'rem' }}>
            <List
                className="election-card-list"
                header={<ElectionHeader type={type} title={title} count={data ? data.length : 0} />}
                dataSource={data}
                renderItem={(election) => (
                    <List.Item>
                        <ElectionEntry election={election}></ElectionEntry>
                    </List.Item>
                )}
            />
        </Card>
    )
}
