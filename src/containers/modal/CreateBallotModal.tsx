import { PlusOutlined } from '@ant-design/icons'
import { Alert, AlertProps, Button, List, Col, Form, Input, Row, Space, Switch } from 'antd'
import Modal from 'antd/lib/modal/Modal'
import { spawn } from 'child_process'
import SelectBallotType from 'components/ballot/selectBallotTypes/SelectBallotType'
import SelectResultType from 'components/ballot/SelectResultType'
import PreviewItem from 'components/previewList/PreviewItem'
import PreviewList from 'components/previewList/PreviewList'
import { IBallotEntity } from 'core/models/ballot/IBallotEntity'
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
}: {
    showModal: boolean
    close: () => void
    initialBallot?: IBallotEntity
}): ReactElement {
    const [alertMessage, setAlertMessage] = React.useState<AlertProps>()
    const [t] = useTranslation(['translation', 'common', 'form', 'profile'])
    const [editCandidate, setEditCandidate] = useState<{ id: number } | undefined>(undefined)
    const candidatesInitialState: CandidateState = []
    const candidateTextInput: MutableRefObject<Input | null> = useRef(null)
    const [addNew, setAddNew] = useState(false)

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

    const submitForm = async (formData: { email: string }) => {
        setAlertMessage({ type: 'error', message: 'LOGIC NOT IMPLEMENTED' })
    }

    function clearCandidateInput() {
        setEditCandidate(undefined)
        setAddNew(false)
    }

    const onCancel = (index: number | undefined) => {
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
                setAddNew(false)
                setCandidatesList({ type: 'add', payload: candidate })
            } else {
                setCandidatesList({ type: 'update', payload: { index: index, value: candidate } })
            }
        }
        clearCandidateInput()
    }
    const candidateInputField = (index?: number) => (
        <div className="is-flex-row width-100">
            <Input
                className="mr-10"
                autoFocus={true}
                ref={candidateTextInput}
                onKeyDown={(event) => onCandidateInputKeydown(event, index)}
                defaultValue={index != undefined ? candidatesList[index] : ''}
            ></Input>
            <Button className="mr-10" onClick={() => saveCandidateField(index)}>
                {index != undefined ? t('common:Update') : t('common:Add')}
            </Button>
            <Button onClick={() => onCancel(index)}>{t('common:Cancel')}</Button>
        </div>
    )
    return (
        <>
            <Modal
                width={'100vw'}
                title={'Create ballot'}
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
                        <Form.Item
                            name="title"
                            rules={[
                                {
                                    required: true,
                                    message: t('form:Is required'),
                                },
                            ]}
                        >
                            <Input placeholder={t('common:Title')} />
                        </Form.Item>

                        <Form.Item>
                            <Input.TextArea placeholder={t('common:Description')} />
                        </Form.Item>
                        <SelectBallotType label={'Select type'} />
                        <SelectResultType label={'Result type'} />
                        <Form.Item label={'Display vote count'}>
                            <Switch></Switch>
                        </Form.Item>
                        <Button type="primary" htmlType="submit" className="">
                            {t('common:Save')}
                        </Button>
                    </div>
                    <div className="split-view-right">
                        <List
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
