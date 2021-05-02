import { PlusOutlined } from '@ant-design/icons'
import { Button, Form } from 'antd'
import * as React from 'react'
import { useTranslation } from 'react-i18next'

export default function SaveElectionButton({ hasInitial = false }: { hasInitial?: boolean }): React.ReactElement {
    const [t] = useTranslation('election')

    return (
        <div>
            <Form.Item>
                <Button type="primary" icon={<PlusOutlined />} size="large" htmlType="submit">
                    {!hasInitial ? t('election:create-election') : t('election:update-election')}
                </Button>
            </Form.Item>
        </div>
    )
}
