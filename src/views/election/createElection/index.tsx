import { Content } from 'antd/lib/layout/layout'
import * as React from 'react'
import { Form, Input, Row, Col, DatePicker, Table, Button, Dropdown, Alert } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { eligibleVotersDummyData, electionAuthoritiesDummyData } from './DummyData'
import ImportMenu from './ImportMenu'
import BallotPreview from './BallotPreview'
import { IElectionDetails } from '../../../core/service/Election/IElectionDetails'
import { ElectionService } from '../../../core/service/Election/ElectionService'
import { BackendAPI } from '../../../core/api'
import { CredentialError } from '../../../core/service/authentication/CredentialsError'
import { ElectionStatus } from '../../../core/service/Election/ElectionStatus'

export default function CreateElectionView(): React.ReactElement {
    const eligibleVotersColumns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
    ]

    const electionAuthoritiesColumns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Organization',
            dataIndex: 'organization',
            key: 'organization',
        },
    ]

    const [ballots, setBallots] = React.useState([
        { title: 'Diktator 1' },
        { title: 'Diktator 2' },
        { title: 'Diktator 3' },
    ])

    const addBallot = () => {
        const ballotList = [...ballots]
        ballotList.push({ title: 'hello' })
        setBallots(ballotList)
    }

    const electionService = new ElectionService(BackendAPI)
    const [errorMessage, setErrorMessage] = React.useState('')

    const formValidated = async (form: IElectionDetails) => {
        setErrorMessage('')
        try {
            form.status = ElectionStatus.NotStarted
            form.electionOrganizer = {}
            form.isAutomatic = false
            form.isLocked = false
            electionService.createElection(form)
            setErrorMessage('Everything went right')
        } catch (error) {
            if (error instanceof CredentialError) {
                setErrorMessage('Something is wrong in the filling of the form')
            } else {
                setErrorMessage('Something very wrong happened, try another voting service')
            }
        }
    }

    return (
        <Content>
            <Row>
                <Col span={12} className="election-information-input">
                    <h1>Create new election</h1>
                    <Form className="is-flex-column" layout="vertical" name="description-form" onFinish={formValidated}>
                        <Form.Item name="title" rules={[{ required: true, message: 'Please fill in a title!' }]}>
                            <Input placeholder="Title"></Input>
                        </Form.Item>
                        <Form.Item
                            name="description"
                            rules={[{ required: true, message: 'Please fill in a description' }]}
                        >
                            <Input.TextArea placeholder="Description"></Input.TextArea>
                        </Form.Item>
                        <h2>Schedule</h2>
                        <Row>
                            <Col span={12}>
                                <h3>Open</h3>
                                <Form.Item
                                    name="openDate"
                                    rules={[{ required: true, message: 'Please choose a date and time' }]}
                                >
                                    <DatePicker />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <h3>Close</h3>
                                <Form.Item
                                    name="closeDate"
                                    rules={[{ required: true, message: 'Please choose a date and time' }]}
                                >
                                    <DatePicker />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row>
                            <Col span={12}>
                                <h2>Eligible voters</h2>
                            </Col>
                            <Col span={12}>
                                <Dropdown overlay={<ImportMenu />} placement="bottomRight" arrow>
                                    <Button
                                        className="import-menu-button"
                                        type="primary"
                                        shape="circle"
                                        icon={<PlusOutlined />}
                                        size="large"
                                    />
                                </Dropdown>
                            </Col>
                        </Row>
                        <Table columns={eligibleVotersColumns} dataSource={eligibleVotersDummyData}></Table>
                        <Row>
                            <Col span={12}>
                                <h2>Election authorities</h2>
                            </Col>
                            <Col span={12}>
                                <Dropdown overlay={<ImportMenu />} placement="bottomRight" arrow>
                                    <Button
                                        className="import-menu-button"
                                        type="primary"
                                        shape="circle"
                                        icon={<PlusOutlined />}
                                        size="large"
                                    />
                                </Dropdown>
                            </Col>
                        </Row>
                        <Table columns={electionAuthoritiesColumns} dataSource={electionAuthoritiesDummyData}></Table>
                        <h2>Verification</h2>
                        <Row>
                            <Col>
                                <Form.Item
                                    className="password-input"
                                    name="password"
                                    rules={[{ required: true, message: 'Please fill in a password!' }]}
                                >
                                    <Input.Password placeholder="Password" />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Form.Item>
                            <Button type="primary" shape="round" icon={<PlusOutlined />} size="large" htmlType="submit">
                                Create election!
                            </Button>
                        </Form.Item>
                    </Form>
                </Col>
                <Col span={12} className="ballot-section">
                    <h1>Ballots</h1>
                    <div>
                        {ballots.map((ballots) => (
                            <BallotPreview key={ballots.title} title={ballots.title} />
                        ))}
                    </div>
                    <Button
                        className="create-ballot-button"
                        type="primary"
                        shape="circle"
                        icon={<PlusOutlined />}
                        size="large"
                        onClick={addBallot}
                    />
                </Col>
            </Row>
            <div className="error-field">
                {!!errorMessage && <Alert message={errorMessage} type={'warning'} showIcon closable />}
            </div>
        </Content>
    )
}