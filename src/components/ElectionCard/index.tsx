import { Card, List } from 'antd'
import React, { ReactElement } from 'react'
import ElectionEntry from './electionEntry'
import ElectionHeader from './electionHeader'
interface ElectionCardProps {
    type: string
}
export default function ElectionCard({ type }: ElectionCardProps): ReactElement {
    const data = [
        'Racing car sprays burning fuel into crowd.',
        'Japanese princess to wed commoner.',
        'Australian walks 100km after outback crash.',
        'Man charged over missing wedding girl.',
        'Los Angeles battles huge wildfires.',
    ]
    return (
        <Card className="election-card">
            <List
                className="election-card-list"
                header={<ElectionHeader title={type} count={data.length} />}
                bordered
                dataSource={data}
                renderItem={(item) => (
                    <List.Item>
                        <ElectionEntry title={item} date="1.1.2020"></ElectionEntry>
                    </List.Item>
                )}
            />
        </Card>
    )
}
