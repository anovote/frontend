import { CloseOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import React, { ReactElement } from 'react'

export function EligibleVoterListItem({
    voterIdentity,
    onDelete,
}: {
    voterIdentity: string
    onDelete: (voterIdentity: string) => void
}): ReactElement {
    return (
        <>
            {voterIdentity}
            <Button type="text" icon={<CloseOutlined />} onClick={() => onDelete(voterIdentity)}></Button>
        </>
    )
}
