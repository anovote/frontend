import { Col, Form, Row, Space } from 'antd'
import { Content } from 'antd/lib/layout/layout'
import Title from 'antd/lib/typography/Title'
import { AlertList } from 'components/alert/AlertList'
import SaveElectionButton from 'components/buttons/SaveElectionButton'
import CloseDateInput from 'components/election/CloseDateInput'
import ElectionDescriptionInput from 'components/election/ElectionDescriptionInput'
import ElectionPasswordInput from 'components/election/ElectionPasswordInput'
import ElectionTitleInput from 'components/election/ElectionTitleInput'
import OpenDateInput from 'components/election/OpenDateInput'
import EligibleVotersList from 'components/importVoters/EligibleVotersList'
import BallotPreviewList from 'components/previewList/BallotPreviewList'
import ComponentWithTooltip from 'components/toolTip/ComponentWithTooltip'
import { BackendAPI } from 'core/api'
import { AuthorizationError } from 'core/errors/AuthorizationError'
import { DuplicateError } from 'core/errors/DuplicateError'
import { prepareElection } from 'core/helpers/prepareElection'
import { AlertState, useAlert } from 'core/hooks/useAlert'
import useMessage from 'core/hooks/useMessage'
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
import { CancelButton } from '../../../components/buttons/CancelButton'

/**
 * The main view used for creating and updating an election
 */
export default function CreateElectionView({
    initialElection = undefined,
    onUpdate,
    onAbort,
}: CreateElectionProps): React.ReactElement {
    const electionService = new ElectionService(BackendAPI)

    const [t] = useTranslation(['translation', 'common', 'election', 'error'])

    const [eligibleVoters, setEligibleVoters] = useState<IEligibleVoter[]>([])
    const [election, setElection] = useState<IElection | undefined>(
        initialElection ? prepareElection(initialElection) : ({} as IElection),
    )

    const { alertStates, dispatchAlert } = useAlert()

    const history = useHistory<AlertState>()
    const [form] = Form.useForm<IElection>()
    const { error: danger, success } = useMessage()
    const [isLoading, setIsLoading] = useState(false)

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

            const response = await electionService.createElection(formData)

            if (response) {
                success({ content: t('election:Created election') })
                history.push(getAdminRoute().elections.view)
            }
        } catch (error) {
            danger({ content: t('common:Solve the issues') })

            if (error instanceof AuthorizationError) {
                dispatchAlert({
                    type: 'add',
                    level: 'error',
                    message: t('election:Election organizer not logged in'),
                    description: t('election:The election organizer needs to be logged in to create an election'),
                })
            } else if (error instanceof DuplicateError) {
                dispatchAlert({
                    type: 'add',
                    message: error.message,
                    description: t('error:All elections must be unique'),
                    level: 'error',
                })
            } else {
                dispatchAlert({
                    type: 'add',
                    level: 'error',
                    message: t('common:Something went wrong'),
                    description: t('common:Please try again later'),
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
        setIsLoading(true)
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
        setIsLoading(false)
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
                        data-testid="description-form"
                    >
                        <ElectionTitleInput />
                        <ElectionDescriptionInput />
                        <Title level={2}>{t('common:Schedule')}</Title>
                        <Row>
                            <Col span={12}>
                                <ComponentWithTooltip
                                    component={<Title level={3}>{t('common:Open')}</Title>}
                                    toolTipTitle={t('election:The date and time you want the election to open')}
                                />
                                <OpenDateInput />
                            </Col>
                            <Col span={12}>
                                <ComponentWithTooltip
                                    component={<Title level={3}>{t('common:Close')}</Title>}
                                    toolTipTitle={t('election:The date and time you want the election to close')}
                                />
                                <CloseDateInput />
                            </Col>
                        </Row>
                        <EligibleVotersList
                            initialVoters={election?.eligibleVoters}
                            onChange={uploadEligibleVotersCallback}
                            formContext={form}
                        />
                        <ComponentWithTooltip
                            component={<Title level={2}>{t('common:Verification')}</Title>}
                            toolTipTitle={t('election:Add a password as a verification for your election')}
                        />
                        <Row>
                            <Col>
                                <ElectionPasswordInput />
                            </Col>
                        </Row>
                        {/* todo #160 implement logic to toggle is automatic
                        <IsAutomaticCheckbox />*/}
                        <Row>
                            <Col>
                                <Space align="baseline">
                                    <SaveElectionButton
                                        hasInitial={initialElection ? true : false}
                                        loading={isLoading}
                                    />
                                    <CancelButton onAbort={onAbort}></CancelButton>
                                </Space>
                            </Col>
                        </Row>
                    </Form>
                </Col>
                <Col span={12} className="ballot-section">
                    <Title level={2}>{t('common:Ballots')}</Title>
                    <BallotPreviewList initialElection={initialElection} onChange={onBallotsChangeHandler} />
                </Col>
            </Row>
            <div className="alert-field">
                <AlertList alerts={alertStates} onRemove={(index) => dispatchAlert({ type: 'remove', index: index })} />
            </div>
        </Content>
    )
}

// inspired by https://www.benmvp.com/blog/conditional-react-props-typescript/
type CreateElectionProps =
    | { initialElection: IElectionEntity; onUpdate: (election: IElectionEntity) => void; onAbort: () => void }
    | { initialElection: undefined; onUpdate?: never; onAbort: () => void }
