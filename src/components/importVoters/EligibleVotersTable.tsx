import * as React from 'react'
import { Table } from 'antd'
import ImportEligibleVotersDropdown from 'components/election/ImportEligibleVotersDropdown'

export default function EligibleVotersTable(): React.ReactElement {
    const columns = [
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
    ]

    return (
        <div className="voters-table-container">
            <ImportEligibleVotersDropdown />
            <Table columns={columns} />
        </div>
    )
}
