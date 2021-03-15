import { Alert, AlertProps, Col, Form, Row } from 'antd'
import { Content } from 'antd/lib/layout/layout'
import CloseDateInput from 'components/election/CloseDateInput'
import CreateElectionButton from 'components/election/CreateElectionButton'
import ElectionDescriptionInput from 'components/election/ElectionDescriptionInput'
import ElectionPasswordInput from 'components/election/ElectionPasswordInput'
import ElectionTitleInput from 'components/election/ElectionTitleInput'
import IsAutomaticCheckbox from 'components/election/IsAutomaticCheckbox'
import OpenDateInput from 'components/election/OpenDateInput'
import EligibleVotersTable from 'components/importVoters/EligibleVotersTable'
import PreviewList from 'components/previewList/PreviewList'
import { BackendAPI } from 'core/api'
import { AuthorizationError } from 'core/errors/AuthorizationError'
import { IEligibleVoter } from 'core/models/ballot/IEligibleVoter'
import { ElectionStatus } from 'core/models/election/ElectionStatus'
import { IElectionDetails } from 'core/models/election/IElection'
import { ElectionService } from 'core/service/election/ElectionService'
import * as React from 'react'
import { useTranslation } from 'react-i18next'

/**
 * The main view used for creating an election
 */
export default function CreateElectionView(): React.ReactElement {
    const electionService = new ElectionService(BackendAPI)
    const [t] = useTranslation(['translation', 'common'])
    const [alertProps, setAlertProps] = React.useState<AlertProps>()
    const [eligibleVoters, setEligibleVoters] = React.useState<IEligibleVoter[]>([])

    /**
     * Validates a form and returns an error if the form is not filled out correctly
     * @param form The form we want to validate
     */
    const formValidated = async (form: IElectionDetails) => {
        try {
            form.status = ElectionStatus.NotStarted
            form.isLocked = false
            form.eligibleVoters = eligibleVoters
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

    const uploadEligibleVotersCallback = (eligibleVoters: IEligibleVoter[]) => {
        setEligibleVoters(eligibleVoters)
    }

    return (
        <Content>
            <Row>
                <Col span={12} className="election-information-input">
                    <h1>{t('common:Create new election')}</h1>
                    <Form className="is-flex-column" layout="vertical" name="description-form" onFinish={formValidated}>
                        <ElectionTitleInput />
                        <ElectionDescriptionInput />
                        <h2>{t('common:Schedule')}</h2>
                        <Row>
                            <Col span={12}>
                                <h3>{t('common:Open')}</h3>
                                <OpenDateInput />
                            </Col>
                            <Col span={12}>
                                <h3>{t('common:Close')}</h3>
                                <CloseDateInput />
                            </Col>
                        </Row>
                        <EligibleVotersTable onUpload={uploadEligibleVotersCallback} />
                        <h2>{t('common:Verification')}</h2>
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
                    <h2>{t('common:Ballots')}</h2>
                    <PreviewList />
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
