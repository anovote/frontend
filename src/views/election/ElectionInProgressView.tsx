import { Col, Row } from 'antd'
import Layout from 'antd/lib/layout/layout'
import BallotsQueue from 'components/queue/BallotsQueue'
import { useSocket } from 'core/state/websocket/useSocketHook'
import { freshBallots } from 'dummy/ballotsDummyData'
import React, { ReactElement, useEffect } from 'react'
import ElectionView from './election'

export function ElectionInProgressView(): ReactElement {
    const [socket] = useSocket()

    useEffect(() => {
        socket.connect()

        socket.on('connection', () => {
            console.log(socket.id)
        })
        return () => {
            socket.disconnect()
        }
    }, [])

    return (
        <Layout>
            <Row>
                <Col>
                    <ElectionView />
                </Col>
                <Col span={16}>
                    <BallotsQueue dataSource={freshBallots} />
                </Col>
            </Row>
        </Layout>
    )
}
