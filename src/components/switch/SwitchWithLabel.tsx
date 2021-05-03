import * as React from 'react'
import Text from 'antd/lib/typography/Text'
import { Form, Space, Switch } from 'antd'
import { useState } from 'react'

export default function SwitchWithLabel({ label, name }: { label: string; name: string }): React.ReactElement {
    const [isChecked, setIsChecked] = useState(false)
    function checkedChange() {
        setIsChecked(!isChecked)
    }
    return (
        <Space size="large" direction={'horizontal'}>
            <Text className="switch-text" type="secondary">
                {label}
            </Text>
            <Form.Item name={name} style={{ margin: 0 }} initialValue={isChecked}>
                <Switch onChange={checkedChange} checked={isChecked} />
            </Form.Item>
        </Space>
    )
}
