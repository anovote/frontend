import * as React from 'react'
import { Form } from 'antd'
import Checkbox from 'antd/lib/checkbox/Checkbox'

export default function IsAutomaticCheckbox(): React.ReactElement {
    return (
        <Form.Item name="isAutomatic" valuePropName="checked">
            <Checkbox>The election is automatic</Checkbox>
        </Form.Item>
    )
}
