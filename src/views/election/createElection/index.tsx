import { Alert, AlertProps, Col, Form, Row } from 'antd'
import { Content } from 'antd/lib/layout/layout'
import Title from 'antd/lib/typography/Title'
import CloseDateInput from 'components/election/CloseDateInput'
import ElectionDescriptionInput from 'components/election/ElectionDescriptionInput'
import ElectionPasswordInput from 'components/election/ElectionPasswordInput'
import ElectionTitleInput from 'components/election/ElectionTitleInput'
import OpenDateInput from 'components/election/OpenDateInput'
import SaveElectionButton from 'components/election/SaveElectionButton'
import EligibleVotersTable from 'components/importVoters/EligibleVotersTable'
import PreviewList from 'components/previewList/PreviewList'
import { BackendAPI } from 'core/api'
import { AuthorizationError } from 'core/errors/AuthorizationError'
import { DuplicateError } from 'core/errors/DuplicateError'
import { IBallot } from 'core/models/ballot/IBallot'
import { IEligibleVoter } from 'core/models/ballot/IEligibleVoter'
import { ElectionStatus } from 'core/models/election/ElectionStatus'
import { IElection } from 'core/models/election/IElection'
import { IElectionEntity } from 'core/models/election/IElectionEntity'
import { getAdminRoute } from 'core/routes/siteRoutes'
import { ElectionService } from 'core/service/election/ElectionService'
import { AlertState } from 'core/state/AlertState'
import * as React from 'react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router'

/**
 * The main view used for creating and updating an election
 */
export default function CreateElectionView({
    initialElection = undefined,
    onUpdate,
}: CreateElectionProps): React.ReactElement {
    const electionService = new ElectionService(BackendAPI)
    const [t] = useTranslation(['translation', 'common', 'election', 'error'])
    const [alertProps, setAlertProps] = useState<AlertProps>()
    const [eligibleVoters, setEligibleVoters] = useState<IEligibleVoter[]>([])
    const [election, setElection] = useState<IElection | undefined>(
        initialElection ? initialElection : ({} as IElection),
    )

    const history = useHistory<AlertState>()
    const [form] = Form.useForm<IElection>()

    /**
     * Validates a form and returns an error if the form is not filled out correctly
     * @param formData The form we want to validate
     */
    const formValidated = async (formData: IElection) => {
        try {
            formData.status = ElectionStatus.NotStarted
            formData.isLocked = false
            formData.eligibleVoters = eligibleVoters
            if (election && election.ballots) {
                formData.ballots = election?.ballots
            }
            await electionService.createElection(formData)
            const alertProps: AlertProps = {
                message: t('election:Election created'),
                description: t('election:The election was created successfully'),
                type: 'success',
                closable: true,
            }
            history.push(getAdminRoute().elections.view, { alertProps })
        } catch (error) {
            const newAlertProps: AlertProps = {
                message: '',
                type: 'error',
            }

            if (error instanceof DuplicateError) {
                newAlertProps.message = error.message
                newAlertProps.description = t('error:All elections must be unique')
                setAlertProps(newAlertProps)
                form.setFields([{ name: 'title', errors: [t('error:Please provide an unique title')] }])
            } else if (error instanceof AuthorizationError) {
                newAlertProps.message = t('error:Election Organizer not logged in')
                newAlertProps.description = t(
                    'error:The election organizer needs to be logged in to create an election',
                )
                setAlertProps(newAlertProps)
            } else {
                newAlertProps.message = t('error:Something went wrong')
                newAlertProps.description = t('error:Please try again later')
                setAlertProps(newAlertProps)
            }
        }
    }

    const uploadEligibleVotersCallback = (eligibleVoters: IEligibleVoter[]) => {
        setEligibleVoters(eligibleVoters)

        if (election) {
            setElection({ ...election, eligibleVoters })
        }
    }

    const onBallotsChangeHandler = (ballots: IBallot[]) => {
        if (ballots.length < 1) return
        if (!election) {
            throw new Error('no election')
        }
        setElection({ ...election, ballots })
    }

    const onFinishedHandler = async (form: IElection) => {
        if (initialElection && onUpdate) {
            const { id, electionOrganizer, createdAt, updatedAt } = initialElection
            const updateElection: IElectionEntity = {
                ...form,
                id,
                electionOrganizer,
                createdAt,
                updatedAt,
                eligibleVoters,
            }
            if (election && election.ballots) {
                updateElection.ballots = election.ballots
            }
            onUpdate(updateElection)
        } else {
            formValidated(form)
        }
    }

    // todo #134 the form cant be populated with election containing dates. This is due to how antd handles dates. We should switch to momentJs for dates.
    return (
        <Content>
            <Row gutter={[32, 0]}>
                <Col span={12}>
                    <Title level={1}>
                        {initialElection ? t('election:Edit election') : t('common:Create new election')}
                    </Title>
                    <Form
                        form={form}
                        className="is-flex-column"
                        layout="vertical"
                        name="description-form"
                        onFinish={onFinishedHandler}
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
                            onChange={uploadEligibleVotersCallback}
                            formContext={form}
                        />
                        <Title level={2}>{t('common:Verification')}</Title>
                        <Row>
                            <Col>
                                <ElectionPasswordInput />
                            </Col>
                        </Row>
                        {/* todo #160 implement logic to toggle is automatic
                        <IsAutomaticCheckbox />*/}
                        <SaveElectionButton hasInitial={initialElection ? true : false} />
                        {/* todo #154 There should be a cancel button*/}
                    </Form>
                </Col>
                <Col span={12} className="ballot-section">
                    <Title level={2}>{t('common:Ballots')}</Title>
                    <PreviewList initialElection={initialElection} onChange={onBallotsChangeHandler} />
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
    | { initialElection: IElectionEntity; onUpdate: (election: IElectionEntity) => void }
    | { initialElection: undefined; onUpdate?: never }
