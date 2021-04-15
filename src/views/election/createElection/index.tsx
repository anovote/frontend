import { Col, Form, Row } from 'antd'
import { Content } from 'antd/lib/layout/layout'
import Title from 'antd/lib/typography/Title'
import { AlertList } from 'components/alert/AlertList'
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
import { AnovoteAlertState, useAlert } from 'core/hooks/useAlert'
import { IBallot } from 'core/models/ballot/IBallot'
import { IEligibleVoter } from 'core/models/ballot/IEligibleVoter'
import { ElectionStatus } from 'core/models/election/ElectionStatus'
import { IElection } from 'core/models/election/IElection'
import { IElectionEntity } from 'core/models/election/IElectionEntity'
import { getAdminRoute } from 'core/routes/siteRoutes'
import { ElectionService } from 'core/service/election/ElectionService'
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
    const [t] = useTranslation(['translation', 'common', 'election'])
    const [eligibleVoters, setEligibleVoters] = useState<IEligibleVoter[]>([])
    const [election, setElection] = useState<IElection | undefined>(
        initialElection ? initialElection : ({} as IElection),
    )

    const [alertState, alertDispatch] = useAlert([{ message: '', alertType: undefined }])

    const history = useHistory<AnovoteAlertState>()
    const [form] = Form.useForm<IElection>()

    /**
     * Validates a form and returns an error if the form is not filled out correctly
     * @param form The form we want to validate
     */
    const formValidated = async (form: IElection) => {
        try {
            form.status = ElectionStatus.NotStarted
            form.isLocked = false
            form.eligibleVoters = eligibleVoters
            if (election && election.ballots) {
                form.ballots = election?.ballots
            }
            await electionService.createElection(form)
            alertDispatch({
                type: 'add',
                alertType: 'success',
                message: 'Election created',
                description: 'The election was created successfully',
            })
            history.push(getAdminRoute().elections.view, alertState[0])
        } catch (error) {
            if (error instanceof AuthorizationError) {
                alertDispatch({
                    type: 'add',
                    alertType: 'error',
                    message: 'Election organizer not logged in',
                    description: 'The election organizer needs to be logged in to create an election',
                })
            } else {
                alertDispatch({
                    type: 'add',
                    alertType: 'error',
                    message: 'Something went wrong',
                    description: 'Please try again later',
                })
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
                <AlertList alertProps={alertState} />
            </div>
        </Content>
    )
}

// inspired by https://www.benmvp.com/blog/conditional-react-props-typescript/
type CreateElectionProps =
    | { initialElection: IElectionEntity; onUpdate: (election: IElectionEntity) => void }
    | { initialElection: undefined; onUpdate?: never }
