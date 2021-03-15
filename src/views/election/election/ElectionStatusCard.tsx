import {
    ClockCircleOutlined,
    EyeInvisibleOutlined,
    EyeOutlined,
    ForwardOutlined,
    LockOutlined,
    SafetyOutlined,
    SecurityScanOutlined,
    UnlockOutlined,
} from '@ant-design/icons'
import { Space } from 'antd'
import Title from 'antd/lib/typography/Title'
import CardList from 'components/cards/CardList'
import CountUpTimer from 'components/countUpTimer/countUpTimer'
import { IElection } from 'core/models/IElection'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { IStatusDetail } from './IStatusDetail'
import StatusListItem from './StatusListItem'

export function ElectionStatusCard({ election }: { election: IElection }): ReactElement {
    const [t] = useTranslation(['common'])

    const header = (
        <div className="spread align-items-center">
            <Title level={2}>{t('common:Status')} </Title>
            <div className="">
                <span className="text-label">{t('common:Election').toUpperCase()} ID # </span>
                <span className="text-medium">{election.id}</span>
            </div>
        </div>
    )

    const details: Array<IStatusDetail> = [
        {
            icon: <LockOutlined />,
            colorClass: 'success-light',
            title: t('election:Election open'),
            text: election.openDate ? (
                election.openDate.toLocaleDateString
            ) : (
                <span className="field-not-relevant"> {new Date().toLocaleDateString()}</span>
            ),
        },
        {
            icon: <UnlockOutlined />,
            colorClass: 'danger-light',
            title: t('election:Election close'),
            text: election.closeDate ? (
                election.closeDate
            ) : (
                <span className="field-not-relevant"> {new Date().toLocaleDateString()}</span>
            ),
        },
        {
            icon: <ClockCircleOutlined />,
            colorClass: 'main-light',
            title: t('election:Time elapsed'),
            // TODO! implement logic to set timer on states from current election
            text: <CountUpTimer />,
        },
        {
            icon: <ForwardOutlined />,
            colorClass: 'main-light',
            title: t('election:Ballot proceed'),
            text: election.isAutomatic ? 'automatic' : 'manual',
        },
        {
            icon: <SecurityScanOutlined />,
            colorClass: 'main-light',
            title: t('election:Authentication method'),
            text: t('common:Email'),
        },
        {
            icon: <SafetyOutlined />,
            colorClass: 'main-light',
            title: t('common:Password'),
            text: election.password ? <PasswordShowHide password={election.password} /> : <span>----</span>,
        },
    ]

    return <CardList listHeader={header} list={details} renderItem={(item) => StatusListItem(item)}></CardList>
}

export function PasswordShowHide({ password }: { password: string }): ReactElement {
    const [hide, setHide] = useState(true)
    const [toggleHideOn, setToggleHideOn] = useState(false)

    const hiddenPassword = '••••••••'

    const toggleHide = () => {
        //setHide(!hide)
        setToggleHideOn(!toggleHideOn)
    }

    return (
        <>
            <Space>
                <text onClick={toggleHide} onMouseEnter={() => setHide(false)} onMouseLeave={() => setHide(true)}>
                    {hide && !toggleHideOn ? hiddenPassword : password}
                </text>
                <span onClick={toggleHide}>{!toggleHideOn ? <EyeInvisibleOutlined /> : <EyeOutlined />}</span>
            </Space>
        </>
    )
}
