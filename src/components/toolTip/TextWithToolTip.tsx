import { QuestionCircleOutlined } from '@ant-design/icons'
import { Space } from 'antd'
import Tooltip, { TooltipPlacement } from 'antd/lib/tooltip'
import React, { ReactElement, ReactNode } from 'react'

export default function TextWithToolTip({
    textComponent,
    toolTipTitle,
    placement = 'right',
}: {
    textComponent: ReactNode
    toolTipTitle: string
    placement?: TooltipPlacement
}): ReactElement {
    return (
        <Space>
            {textComponent}
            <Tooltip title={toolTipTitle} placement={placement}>
                <QuestionCircleOutlined />
            </Tooltip>
        </Space>
    )
}
