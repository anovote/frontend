import { PlusOutlined } from '@ant-design/icons'
import { Button, Form, Input, List, Space } from 'antd'
import Modal from 'antd/lib/modal/Modal'
import Title from 'antd/lib/typography/Title'
import SelectBallotType from 'components/ballot/selectBallotTypes/SelectBallotType'
import SelectResultType from 'components/ballot/SelectResultType'
import { CancelButton } from 'components/buttons/CancelButton'
import SaveElectionButton from 'components/buttons/SaveElectionButton'
import PreviewItem from 'components/previewList/PreviewItem'
import { IBallot, IBallotInList } from 'core/models/ballot/IBallot'
import { ICandidate } from 'core/models/ballot/ICandidate'
import React, { MutableRefObject, ReactElement, useReducer, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

type CandidateState = Array<ICandidate>
type CandidateAction =
    | { type: 'add'; payload: ICandidate }
    | { type: 'remove'; payload: number }
    | { type: 'update'; payload: { index: number; value: ICandidate } }
    | { type: 'clear' }

export default function CreateBallotModal({
    showModal,
    close,
    initialBallot,
    onSubmitted,
}: {
    showModal: boolean
    close: () => void
    initialBallot?: IBallotInList
    onSubmitted: (ballot: IBallot, indexInList?: number) => void
}): ReactElement {
    const [t] = useTranslation(['translation', 'common', 'form', 'profile', 'ballot'])
    const [editCandidate, setEditCandidate] = useState<{ id: number } | undefined>(undefined)
    const [addNew, setAddNew] = useState(false)

    const candidatesInitialState: CandidateState = initialBallot?.candidates || []

    const candidateTextInput: MutableRefObject<Input | null> = useRef(null)
    const ballotText = t('common:Ballot')
    const modalTitle = initialBallot
        ? t('common:Edit', { value: ballotText.toLowerCase() })
        : t('common:Create', { value: ballotText.toLowerCase() })

    function candidateReducer(state: Array<ICandidate>, action: CandidateAction): Array<ICandidate> {
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
            case 'clear': {
                return []
            }
            default:
                return state
        }
    }

    const [candidatesList, setCandidatesList] = useReducer(candidateReducer, candidatesInitialState)

    const submitForm = async (formData: IBallot) => {
        formData.candidates = candidatesList
        const index = initialBallot?.index
        onSubmitted(formData, index)
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
                setCandidatesList({ type: 'add', payload: { candidate } })
            } else {
                setCandidatesList({ type: 'update', payload: { index: index, value: { candidate } } })
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
                defaultValue={index != undefined ? candidatesList[index].candidate : ''}
            ></Input>
            <Button className="mr-10" onClick={() => saveCandidateField(index)}>
                {index != undefined ? t('common:Update') : t('common:Add')}
            </Button>
            <Button onClick={() => onCancel()}>{t('common:Cancel')}</Button>
        </div>
    )

    const resetFormData = () => {
        setCandidatesList({ type: 'clear' })
    }

    return (
        <>
            <Modal
                width={'100%'}
                title={modalTitle}
                footer={null}
                visible={showModal}
                onCancel={close}
                className="modal-display-large"
                afterClose={resetFormData}
                destroyOnClose={true}
            >
                <Form onFinish={submitForm} layout={'vertical'}>
                    <div className="split-view">
                        <div className={'split-view-left'}>
                            <Form.Item
                                name="title"
                                label={t('common:Title')}
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

                            <Form.Item
                                name="description"
                                label={t('common:Description')}
                                initialValue={initialBallot?.description}
                            >
                                <Input.TextArea placeholder={t('common:Description')} />
                            </Form.Item>
                            <SelectBallotType label={t('common:Select type')} initialValue={initialBallot?.type} />
                            <SelectResultType
                                label={t('ballot:Result type')}
                                initialValue={initialBallot?.resultDisplayType}
                            />
                            {/* todo #157 implement logic to make displaying vote count toggle-able
                        <Form.Item label={t('ballot:Display vote count')}>
                            <Switch defaultChecked={initialBallot?.displayResultCount}></Switch>
                        </Form.Item>*/}
                        </div>
                        <div className="split-view-right">
                            <Form.Item
                                name="candidates"
                                label={t('common:Candidate', { count: 2 })}
                                rules={[
                                    {
                                        validator: () => {
                                            if (addNew) return
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
                                    locale={{ emptyText: t('ballot:No candidates') }}
                                    dataSource={candidatesList}
                                    renderItem={(item, index) => (
                                        <>
                                            <PreviewItem
                                                onEdit={() => onEdit(index)}
                                                onDelete={() => onDelete(index)}
                                                id={index}
                                            >
                                                {item.candidate}
                                            </PreviewItem>
                                            {editCandidate && editCandidate.id == index && candidateInputField(index)}
                                        </>
                                    )}
                                >
                                    {addNew && candidateInputField()}
                                </List>
                            </Form.Item>
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
                    </div>
                    <Space align="baseline">
                        <Button type="primary" htmlType="submit" onClick={() => setAddNew(false)}>
                            {t('common:Save')}
                        </Button>
                        <CancelButton onAbort={close}></CancelButton>
                    </Space>
                </Form>
            </Modal>
        </>
    )
}
