import { Space } from 'antd'
import React, { ReactElement } from 'react'

export default function CandidateEntry({ id, name }: { id: number; name: string }): ReactElement {
    return (
        <Space className="width-100" size="large">
            <span className="candidate-id">#{id}</span>
            <span className="candidate-title">{name}</span>
        </Space>
    )
}
