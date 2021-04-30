import { CloseCircleOutlined } from '@ant-design/icons'
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
            <Button
                type="text"
                className="color-main-contrasting no-hover-style"
                icon={<CloseCircleOutlined />}
                onClick={() => onDelete(voterIdentity)}
            ></Button>
        </>
    )
}
