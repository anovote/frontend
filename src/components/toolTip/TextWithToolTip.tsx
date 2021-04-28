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
        <Space className="text-with-tooltip">
            {textComponent}
            <Tooltip title={toolTipTitle} placement={placement} className="text-with-tooltip">
                <QuestionCircleOutlined className="tooltip-icon" />
            </Tooltip>
        </Space>
    )
}
