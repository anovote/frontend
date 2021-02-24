import * as React from 'react'
import Text from 'antd/lib/typography/Text'
import { Space, Switch } from 'antd'

export default function SwitchWithLabel({ label }: { label: string }): React.ReactElement {
    return (
        <div>
            <Space size="large">
                <Text className="switch-text">{label}</Text>
                <Switch />
            </Space>
        </div>
    )
}
