import { Space } from 'antd'
import Text from 'antd/lib/typography'
import { QuestionCircleOutlined } from '@ant-design/icons'
import Tooltip, { TooltipPlacement } from 'antd/lib/tooltip'
import React, { ReactElement } from 'react'

export default function TextWithToolTip({
    text,
    toolTipTitle,
    placement = 'right',
}: {
    text: string
    toolTipTitle: string
    placement?: TooltipPlacement
}): ReactElement {
    return (
        <Space>
            <Text>{text}</Text>
            <Tooltip title={toolTipTitle} placement={placement}>
                <QuestionCircleOutlined />
            </Tooltip>
        </Space>
    )
}
