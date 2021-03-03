import { PlusOutlined } from '@ant-design/icons'
import { Alert, AlertProps, Button, Form, Input, List, Switch } from 'antd'
import Modal from 'antd/lib/modal/Modal'
import Title from 'antd/lib/typography/Title'
import SelectBallotType from 'components/ballot/selectBallotTypes/SelectBallotType'
import SelectResultType from 'components/ballot/SelectResultType'
import PreviewItem from 'components/previewList/PreviewItem'
import { IBallot } from 'core/models/ballot/IBallot'
import React, { MutableRefObject, ReactElement, useReducer, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

type CandidateState = Array<string>
type CandidateAction =
    | { type: 'add'; payload: string }
    | { type: 'remove'; payload: number }
    | { type: 'update'; payload: { index: number; value: string } }

export default function CreateBallotModal({
    showModal,
    close,
    initialBallot,
    onSubmitted,
}: {
    showModal: boolean
    close: () => void
    initialBallot?: IBallot
    onSubmitted: (ballot: IBallot) => void
}): ReactElement {
    const [alertMessage, setAlertMessage] = React.useState<AlertProps>()
    const [t] = useTranslation(['translation', 'common', 'form', 'profile'])
    const [editCandidate, setEditCandidate] = useState<{ id: number } | undefined>(undefined)
    const [addNew, setAddNew] = useState(false)
    const candidatesInitialState: CandidateState =
        initialBallot?.candidates.flatMap((candidate) => candidate.candidate) || []
    const candidateTextInput: MutableRefObject<Input | null> = useRef(null)
    const ballotText = t('common:Ballot')
    const modalTitle = initialBallot
        ? t('common:Edit', { value: ballotText.toLowerCase() })
        : t('common:Create', { value: ballotText.toLowerCase() })

    function candidateReducer(state: Array<string>, action: CandidateAction): Array<string> {
        switch (action.type) {
            case 'add':
                return [...state, action.payload]
            case 'remove': {
                const newState = Object.assign([], state) as CandidateState
                newState.splice(action.payload, 1)
                return newState
            }
            case 'update': {
                const newState = Object.assign([], state) as CandidateState
                newState[action.payload.index] = action.payload.value
                return newState
            }
            default:
                return state
        }
    }

    const [candidatesList, setCandidatesList] = useReducer(candidateReducer, candidatesInitialState)

    const submitForm = async (formData: IBallot) => {
        onSubmitted(formData)
    }

    function clearCandidateInput() {
        setEditCandidate(undefined)
        setAddNew(false)
    }

    const onCancel = () => {
        clearCandidateInput()
    }

    const onDelete = (index: number) => {
        setCandidatesList({ type: 'remove', payload: index })
    }

    const onEdit = (id: number) => {
        clearCandidateInput()
        setEditCandidate({ id })
    }

    const onAdd = () => {
        clearCandidateInput()
        setAddNew(true)
    }

    const onCandidateInputKeydown = (event: React.KeyboardEvent<HTMLInputElement>, index: number | undefined) => {
        event.stopPropagation()
        event.nativeEvent.stopImmediatePropagation()
        if (event.key == 'Enter') {
            event.preventDefault()
            saveCandidateField(index)
        }
        if (event.key == 'Escape') {
            event.preventDefault()
            clearCandidateInput()
        }
    }
    const saveCandidateField = (index?: number) => {
        const candidate: string = candidateTextInput.current?.state.value
        if (candidate) {
            if (index == undefined) {
                setCandidatesList({ type: 'add', payload: candidate })
            } else {
                setCandidatesList({ type: 'update', payload: { index: index, value: candidate } })
            }
        }
        clearCandidateInput()
    }
    const candidateInputField = (index?: number) => (
        <div className="is-flex-row width-100 mb-10">
            <Input
                className="mr-10 pl-10"
                autoFocus={true}
                ref={candidateTextInput}
                onKeyDown={(event) => onCandidateInputKeydown(event, index)}
                defaultValue={index != undefined ? candidatesList[index] : ''}
            ></Input>
            <Button className="mr-10" onClick={() => saveCandidateField(index)}>
                {index != undefined ? t('common:Update') : t('common:Add')}
            </Button>
            <Button onClick={() => onCancel()}>{t('common:Cancel')}</Button>
        </div>
    )
    return (
        <>
            <Modal
                width={'100vw'}
                title={modalTitle}
                footer={null}
                visible={showModal}
                onCancel={close}
                className="modal-display-large"
            >
                <Form onFinish={submitForm} layout={'vertical'} className="is-flex-row split-view">
                    {!!alertMessage && (
                        <Alert
                            message={alertMessage?.message}
                            description={alertMessage?.description}
                            type={alertMessage?.type}
                            onClose={() => {
                                setAlertMessage(undefined)
                            }}
                            showIcon
                            closable
                        />
                    )}
                    <div className={'split-view-left'}>
                        <Title level={3}>{modalTitle}</Title>
                        <Form.Item
                            name="title"
                            initialValue={initialBallot?.title}
                            rules={[
                                {
                                    required: true,
                                    message: t('form:Is required'),
                                },
                            ]}
                        >
                            <Input placeholder={t('common:Title')} />
                        </Form.Item>

                        <Form.Item name="description" initialValue={initialBallot?.description}>
                            <Input.TextArea placeholder={t('common:Description')} />
                        </Form.Item>
                        <SelectBallotType label={t('ballot:Select type')} initialValue={initialBallot?.type} />
                        <SelectResultType
                            label={t('ballot:Result type')}
                            initialValue={initialBallot?.resultDisplayType}
                        />
                        <Form.Item label={t('ballot:Display vote count')}>
                            <Switch defaultChecked={initialBallot?.displayResultCount}></Switch>
                        </Form.Item>
                        <Button type="primary" htmlType="submit">
                            {t('common:Save')}
                        </Button>
                    </div>
                    <div className="split-view-right">
                        <Form.Item
                            name="candidates"
                            label={t('common:Candidate', { count: 2 })}
                            className={candidatesList.length == 0 ? 'no-input' : ''}
                            rules={[
                                {
                                    validator: (_, value) => {
                                        if (candidatesList.length > 0) {
                                            return Promise.resolve()
                                        }
                                        return Promise.reject(
                                            t('form:Must have at least one', {
                                                field: t('common:Candidate').toLowerCase(),
                                            }),
                                        )
                                    },
                                },
                            ]}
                        >
                            <List
                                locale={{ emptyText: <></> }}
                                dataSource={candidatesList}
                                renderItem={(item, index) => (
                                    <>
                                        <PreviewItem
                                            onEdit={() => onEdit(index)}
                                            onDelete={() => onDelete(index)}
                                            id={index}
                                            itemTitle={item}
                                        />
                                        {editCandidate && editCandidate.id == index && candidateInputField(index)}
                                    </>
                                )}
                            ></List>
                        </Form.Item>
                        {addNew && candidateInputField()}
                        <div className="is-flex justify-content-center width-100 mt-10">
                            <Button
                                className="add-preview-button"
                                type="text"
                                shape="circle"
                                icon={<PlusOutlined className="btn-icon" />}
                                size="large"
                                onClick={onAdd}
                            />
                        </div>
                    </div>
                </Form>
            </Modal>
        </>
    )
}
