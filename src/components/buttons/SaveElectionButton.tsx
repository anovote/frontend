import { PlusOutlined } from '@ant-design/icons'
import { Button, Form } from 'antd'
import * as React from 'react'
import { useTranslation } from 'react-i18next'

export default function SaveElectionButton({
    hasInitial = false,
    loading,
}: {
    hasInitial?: boolean
    loading?: boolean
}): React.ReactElement {
    const [t] = useTranslation('election')

    return (
        <div>
            <Form.Item>
                <Button
                    type="primary"
                    shape="round"
                    icon={<PlusOutlined />}
                    size="large"
                    htmlType="submit"
                    loading={loading}
                >
                    {!hasInitial ? t('election:create-election') : t('election:update-election')}
                </Button>
            </Form.Item>
        </div>
    )
}
