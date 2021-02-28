import * as React from 'react'
import { Table } from 'antd'

export default function EligibleVotersTable(): React.ReactElement {
    const columns = [
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
    ]

    return (
        <div>
            <Table columns={columns} />
        </div>
    )
}
