import * as React from 'react'
import SwitchComponent from './SwitchComponent'
import Text from 'antd/lib/typography/Text'
import { Space } from 'antd'

export default function SwitchWithLabel({ label }: { label: string }): React.ReactElement {
    return (
        <span>
            <Space size="large">
                <Text>{label}</Text>
                <SwitchComponent />
            </Space>
        </span>
    )
}
