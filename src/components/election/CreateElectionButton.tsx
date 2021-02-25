import * as React from 'react'
import { Button, Form } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

export default function CreateElectionButton(): React.ReactElement {
    return (
        <div>
            <Form.Item>
                <Button
                    className="create-election-button"
                    type="primary"
                    shape="round"
                    icon={<PlusOutlined />}
                    size="large"
                    htmlType="submit"
                >
                    Create election!
                </Button>
            </Form.Item>
        </div>
    )
}
