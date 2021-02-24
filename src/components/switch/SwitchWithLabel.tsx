import * as React from 'react'
import Text from 'antd/lib/typography/Text'
import { Space, Switch } from 'antd'

export default function SwitchWithLabel({ label }: { label: string }): React.ReactElement {
    return (
        <div>
            <Space size="large" align="end">
                <Text className="switch-text" type="secondary">
                    {label}
                </Text>
                <Switch />
            </Space>
        </div>
    )
}
