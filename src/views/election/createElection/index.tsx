import { Alert, AlertProps, Col, Form, Row } from 'antd'
import { Content } from 'antd/lib/layout/layout'
import Title from 'antd/lib/typography/Title'
import CloseDateInput from 'components/election/CloseDateInput'
import ElectionDescriptionInput from 'components/election/ElectionDescriptionInput'
import ElectionPasswordInput from 'components/election/ElectionPasswordInput'
import ElectionTitleInput from 'components/election/ElectionTitleInput'
import IsAutomaticCheckbox from 'components/election/IsAutomaticCheckbox'
import OpenDateInput from 'components/election/OpenDateInput'
import SaveElectionButton from 'components/election/SaveElectionButton'
import EligibleVotersTable from 'components/importVoters/EligibleVotersTable'
import PreviewList from 'components/previewList/PreviewList'
import { BackendAPI } from 'core/api'
import { AuthorizationError } from 'core/errors/AuthorizationError'
import { IEligibleVoter } from 'core/models/ballot/IEligibleVoter'
import { ElectionStatus } from 'core/models/election/ElectionStatus'
import { IElectionDetails } from 'core/models/election/IElection'
import { IElection } from 'core/models/election/IElectionEntity'
import { ElectionService } from 'core/service/election/ElectionService'
import * as React from 'react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

/**
 * The main view used for creating and updating an election
 */
export default function CreateElectionView({
    initialElection = undefined,
    onUpdate,
}: CreateElectionProps): React.ReactElement {
    const electionService = new ElectionService(BackendAPI)
    const [t] = useTranslation(['translation', 'common', 'election'])
    const [alertProps, setAlertProps] = useState<AlertProps>()
    const [eligibleVoters, setEligibleVoters] = useState<IEligibleVoter[]>([])
    const [election] = useState<IElection | undefined>(initialElection)

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

    // todo #134 the form cant be populated with election containing dates. This is due to how antd handles dates. We should switch to momentJs for dates.
    return (
        <Content>
            <Row>
                <Col span={12} className="election-information-input">
                    <Title level={1}>
                        {initialElection ? t('election:Edit election') : t('common:Create new election')}
                    </Title>
                    <Form
                        className="is-flex-column"
                        layout="vertical"
                        name="description-form"
                        onFinish={initialElection ? onUpdate : formValidated}
                        initialValues={initialElection}
                    >
                        <ElectionTitleInput />
                        <ElectionDescriptionInput />
                        <Title level={2}>{t('common:Schedule')}</Title>
                        <Row>
                            <Col span={12}>
                                <Title level={3}>{t('common:Open')}</Title>
                                <OpenDateInput />
                            </Col>
                            <Col span={12}>
                                <Title level={3}>{t('common:Close')}</Title>
                                <CloseDateInput />
                            </Col>
                        </Row>
                        <EligibleVotersTable
                            initialVoters={election?.eligibleVoters}
                            onUpload={uploadEligibleVotersCallback}
                        />
                        <Title level={2}>{t('common:Verification')}</Title>
                        <Row>
                            <Col>
                                <ElectionPasswordInput />
                            </Col>
                        </Row>
                        <IsAutomaticCheckbox />
                        <SaveElectionButton hasInitial={initialElection ? true : false} />
                    </Form>
                </Col>
                <Col span={12} className="ballot-section">
                    <Title level={2}>{t('common:Ballots')}</Title>
                    <PreviewList initialElection={initialElection} />
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

// inspired by https://www.benmvp.com/blog/conditional-react-props-typescript/
type CreateElectionProps =
    | { initialElection: IElection; onUpdate: (election: IElection) => void }
    | { initialElection: undefined; onUpdate?: never }
