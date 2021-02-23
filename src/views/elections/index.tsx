import { Space } from 'antd'
import Title from 'antd/lib/typography/Title'
import React from 'react'
import { useTranslation } from 'react-i18next'
import ElectionCard from '../../components/ElectionCard'

export default function ElectionsView(): React.ReactElement {
    const [t] = useTranslation(['common'])

    return (
        <>
            <Title>{t('Elections')}</Title>
            <Space wrap={true}>
                <ElectionCard type="To be held"></ElectionCard>
                <ElectionCard type="In Progress"></ElectionCard>
                <ElectionCard type="Finished"></ElectionCard>
            </Space>
        </>
    )
}
