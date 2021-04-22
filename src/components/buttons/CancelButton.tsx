import { QuestionCircleOutlined } from '@ant-design/icons'
import { Button, Popconfirm } from 'antd'
import * as React from 'react'
import { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

export function CancelButton({ onAbort }: { onAbort: () => void }): ReactElement {
    const [t] = useTranslation('form')
    return (
        <Popconfirm
            title={t('form:Are you sure you want to cancel')}
            icon={
                <QuestionCircleOutlined
                    style={{
                        color: 'red',
                    }}
                />
            }
            okText={t('form:Yes')}
            cancelText={t('form:No')}
            onConfirm={onAbort}
        >
            <Button htmlType="button" shape="round" size="large">
                {t('form:Cancel')}
            </Button>
        </Popconfirm>
    )
}
