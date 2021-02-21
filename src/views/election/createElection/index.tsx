import { Content } from 'antd/lib/layout/layout'
import * as React from 'react'
import { Form, Row, Col, Table, Alert, AlertProps } from 'antd'
import { eligibleVotersDummyData, electionAuthoritiesDummyData } from './DummyData'
import BallotPreview from '../../../components/election/BallotPreview'
import { IElectionDetails } from '../../../core/service/election/IElectionDetails'
import { ElectionService } from '../../../core/service/election/ElectionService'
import { BackendAPI } from '../../../core/api'
import { ElectionStatus } from '../../../core/service/election/ElectionStatus'
import CreateElectionButton from '../../../components/election/CreateElectionButton'
import ElectionTitleInput from '../../../components/election/ElectionTitleInput'
import ElectionDescriptionInput from '../../../components/election/ElectionDescriptionInput'
import OpenDateInput from '../../../components/election/OpenDateInput'
import CloseDateInput from '../../../components/election/CloseDateInput'
import ImportEligibleVotersDropdown from '../../../components/election/ImportEligibleVotersDropdown'
import ImportElectionAuthoritiesDropdown from '../../../components/election/ImportElectionAuthoritiesDropdown'
import ElectionPasswordInput from '../../../components/election/ElectionPasswordInput'
import CreateBallotButton from '../../../components/election/CreateBallotButton'
import IsAutomaticCheckbox from '../../../components/election/IsAutomaticCheckbox'
import { AuthorizationError } from '../../../core/service/election/AuthorizationError'
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

    const electionService = new ElectionService(BackendAPI)

    const [ballots, setBallots] = React.useState([
        { title: 'Diktator 1' },
        { title: 'Diktator 2' },
        { title: 'Diktator 3' },
    ])

    const [alertProps, setAlertProps] = React.useState<AlertProps>()

    const formValidated = async (form: IElectionDetails) => {
        try {
            form.status = ElectionStatus.NotStarted
            form.isLocked = false
            await electionService.createElection(form)
            const newAlertProps: AlertProps = {
                message: 'Election created',
                description: 'The election was created successfully',
                type: 'success',
            }
            setAlertProps(newAlertProps)
        } catch (error) {
            const newAlertProps: AlertProps = {
                message: '',
                type: 'error',
            }

            if (error instanceof AuthorizationError) {
                newAlertProps.message = 'Election Organizer not logged in'
                newAlertProps.description = 'The election organizer needs to be logged in to create an election'
                setAlertProps(newAlertProps)
            } else {
                newAlertProps.message = 'Something went wrong'
                newAlertProps.description = 'Please try again later'
                setAlertProps(newAlertProps)
            }
        }
    }

    const addBallot = () => {
        const ballotList = [...ballots]
        ballotList.push({ title: 'hello' })
        setBallots(ballotList)
    }

    return (
        <Content>
            <Row>
                <Col span={12} className="election-information-input">
                    <h1>Create new election</h1>
                    <Form className="is-flex-column" layout="vertical" name="description-form" onFinish={formValidated}>
                        <ElectionTitleInput />
                        <ElectionDescriptionInput />
                        <h2>Schedule</h2>
                        <Row>
                            <Col span={12}>
                                <h3>Open</h3>
                                <OpenDateInput />
                            </Col>
                            <Col span={12}>
                                <h3>Close</h3>
                                <CloseDateInput />
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                                <h2>Eligible voters</h2>
                            </Col>
                            <Col span={12}>
                                <ImportEligibleVotersDropdown />
                            </Col>
                        </Row>
                        <Table columns={eligibleVotersColumns} dataSource={eligibleVotersDummyData}></Table>
                        <Row>
                            <Col span={12}>
                                <h2>Election authorities</h2>
                            </Col>
                            <Col span={12}>
                                <ImportElectionAuthoritiesDropdown />
                            </Col>
                        </Row>
                        <Table columns={electionAuthoritiesColumns} dataSource={electionAuthoritiesDummyData}></Table>
                        <h2>Verification</h2>
                        <Row>
                            <Col>
                                <ElectionPasswordInput />
                            </Col>
                        </Row>
                        <IsAutomaticCheckbox />
                        <CreateElectionButton />
                    </Form>
                </Col>
                <Col span={12} className="ballot-section">
                    <h2>Ballots</h2>
                    <div>
                        {ballots.map((ballots) => (
                            <BallotPreview key={ballots.title} title={ballots.title} />
                        ))}
                    </div>
                    <CreateBallotButton addBallot={addBallot} />
                </Col>
            </Row>
            <div className="alert-field">
                {!!alertProps && (
                    <Alert
                        message={alertProps?.message}
                        description={alertProps?.description}
                        type={alertProps?.type}
                        showIcon
                        closable
                    />
                )}
            </div>
        </Content>
    )
}
