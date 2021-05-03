import { QuestionCircleOutlined } from '@ant-design/icons'
import { Space } from 'antd'
import Tooltip, { TooltipPlacement } from 'antd/lib/tooltip'
import React, { ReactElement, ReactNode } from 'react'

export default function ComponentWithTooltip({
    component,
    toolTipTitle,
    placement = 'right',
}: {
    component: ReactNode
    toolTipTitle: string
    placement?: TooltipPlacement
}): ReactElement {
    return (
        <Space>
            {component}
            <Tooltip title={toolTipTitle} placement={placement} className="component-with-tooltip">
                <QuestionCircleOutlined className="tooltip-icon" />
            </Tooltip>
        </Space>
    )
}
