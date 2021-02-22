import { Row, Col, Button } from 'antd'
import * as React from 'react'
import { EditFilled, CloseOutlined } from '@ant-design/icons'

export default function BallotPreview({ title }: { title: string }): React.ReactElement {
    return (
        <div className="ballot-preview">
            <Row>
                <Col span={22} order={1}>
                    {title}
                </Col>
                <Col span={1} order={2}>
                    <Button className="ballot-preview-button" icon={<EditFilled />}></Button>
                </Col>
                <Col span={1} order={3}>
                    <Button className="ballot-preview-button" icon={<CloseOutlined />}></Button>
                </Col>
            </Row>
        </div>
    )
}
