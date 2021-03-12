import { Card, Col, Row, Space } from 'antd'
import Title from 'antd/lib/typography/Title'
import CardList from 'components/cards/CardList'
import CountUpTimer from 'components/countUpTimer/countUpTimer'
import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { ElectionStatusCard } from './ElectionStatusCard'
/**
 * The main view used for creating an election
 */
export default function ElectionView(): React.ReactElement {
    const [t] = useTranslation(['translation', 'common', 'election'])

    const cardTitle = <Title level={2}>{t('election:Connected voters')}</Title>
    return (
        <>
            <Row>
            <Col>
                <Space direction={'vertical'}>
                        <ElectionStatusCard election={elections[0]} />
                    <Card className={'info-card'} title={cardTitle}>
                        <div className="is-flex-column has-content-center-center">
                            <span className={'text-large'}>1337</span> {/* todo fetch real time*/}
                        </div>
                    </Card>
                </Space>
            </Col>
                <Col span={12}>col-12</Col>
            </Row>
        </>
    )
}
