import * as React from 'react'
import Text from 'antd/lib/typography/Text'
import { Space, Switch } from 'antd'

export default function SwitchWithLabel({ label }: { label: string }): React.ReactElement {
    return (
        <span>
            <Space size="large">
                <Text>{label}</Text>
                <Switch />
            </Space>
        </span>
    )
}
