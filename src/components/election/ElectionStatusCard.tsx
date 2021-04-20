import {
    ClockCircleOutlined,
    ForwardOutlined,
    LockOutlined,
    SafetyOutlined,
    SecurityScanOutlined,
    UnlockOutlined,
} from '@ant-design/icons'
import Title from 'antd/lib/typography/Title'
import CardList from 'components/cards/CardList'
import CountUpTimer from 'components/countUpTimer/countUpTimer'
import { IElectionEntity } from 'core/models/election/IElectionEntity'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { IStatusDetail } from 'views/election/election/IStatusDetail'
import StatusListItem from 'views/election/election/StatusListItem'
import { PasswordShowHide } from './PasswordShowHide'

/**
 * Creates and populates a status card with key properties of an election
 * @param props An object containing the election
 * @returns An election status card
 */
export function ElectionStatusCard({ election }: { election: IElectionEntity }): ReactElement {
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
                new Date(election.openDate).toLocaleDateString()
            ) : (
                <span className="field-not-relevant"> {new Date().toLocaleDateString()}</span>
            ),
        },
        {
            icon: <UnlockOutlined />,
            colorClass: 'danger-light',
            title: t('election:Election close'),
            text: election.closeDate ? (
                new Date(election.closeDate).toLocaleDateString()
            ) : (
                <span className="field-not-relevant"> {new Date().toLocaleDateString()}</span>
            ),
        },
    ]

    if (election.status === ElectionStatus.Started) {
        details.push({
            icon: <ClockCircleOutlined />,
            colorClass: 'main-light',
            title: t('election:Time elapsed'),
            text: <CountUpTimer initialTime={election.openDate ? election.openDate.getTime() : Date.now()} />,
        })
    }

    details.push(
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
    )
        },
    ]

    return <CardList listHeader={header} list={details} renderItem={(item) => StatusListItem(item)} />
}
