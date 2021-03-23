import { AlertProps, Button, Space, Alert } from 'antd'
import { CheckboxValueType } from 'antd/lib/checkbox/Group'
import { RadioChangeEvent } from 'antd/lib/radio'
import Title from 'antd/lib/typography/Title'
import BallotTypeDisplay from 'components/BallotTypeDisplay/BallotTypeDisplay'
import CandidateList from 'components/CandidateList/CandidateList'
import { BallotType } from 'core/models/ballot/BallotType'
import { IBallotEntity } from 'core/models/ballot/IBallotEntity'
import { ICandidateEntity } from 'core/models/ballot/ICandidate'
import { reducer } from 'core/reducers/ballotReducer'
import React, { ReactElement, useReducer, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSocket } from 'core/state/websocket/useSocketHook'
import { Events } from 'core/events'

const initialState = {
    selected: 0,
    selection: {
        single: null,
        multiple: [],
    },
}

export default function BallotDisplayHandler({ ballot }: { ballot: IBallotEntity }): ReactElement {
    const [{ selected, selection }, dispatch] = useReducer(reducer, initialState)

    const [t] = useTranslation(['common'])
    const [socket] = useSocket()
    const [alertProps, setAlertProps] = useState<AlertProps>()

    /**
     * Handles the change of clicked candidate(s) according to
     * the type of the ballot
     * @param change the selected change of candidate(s)
     */
    const onChange = (change: RadioChangeEvent | CheckboxValueType[]) => {
        switch (ballot.type) {
            case BallotType.SINGLE: {
                const radio = change as RadioChangeEvent
                dispatch({ type: 'select', payload: { single: radio.target.value, multiple: [] } })
                break
            }
            case BallotType.MULTIPLE: {
                const checked = change as number[]
                onSelectionMultiple(checked)
                break
            }

            default:
                console.error('Ballot type not handled')
        }
    }

    /**
     * Dispatches the correct update of state when
     * a multiple selection is fired. It will either increment or decrement the selected count of the state
     * and the selection according to the provided checked elements.
     * If the length of the checked elements are greater than the current selected candidates, it will
     * dispatch a select action to the state. If it is less, it will deselect
     * @param checked the checked elements of candidates
     */
    const onSelectionMultiple = (checked: number[]) => {
        if (checked.length > selected) {
            dispatch({ type: 'select', payload: { single: null, multiple: checked } })
        }
        if (checked.length < selected) {
            dispatch({ type: 'deselect', payload: { single: null, multiple: checked } })
        }
    }

    /**
     * Clears the selected/selection of candidates and resets the selected
     * counter
     */
    const clearSelection = () => {
        dispatch({ type: 'reset', payload: { single: 0, multiple: [] } })
    }

    const submitVote = () => {
        socket.connect()

        switch (ballot.type) {
            case BallotType.SINGLE: {
                if (selected === 0) {
                    const newAlertProps: AlertProps = {
                        message: t('You need to select a candidate'),
                        type: 'error',
                    }
                    setAlertProps(newAlertProps)
                } else {
                    socket.emit(
                        Events.client.vote.submit,
                        {
                            candidate: selection.single,
                            submitted: new Date(),
                            voter: 1,
                            ballot: ballot,
                        },
                        () => {
                            console.log('Callback handled here')
                        },
                    )
                    const newAlertProps: AlertProps = {
                        message: t('Your vote was submitted!'),
                        type: 'success',
                    }
                    setAlertProps(newAlertProps)
                }
                break
            }
            // TODO add submit vote handling for the different ballot types
            default:
                console.error('The vote could not be submitted...')
        }
    }

    return (
        <div className="voter-display">
            <BallotTypeDisplay type={ballot.type} />
            <Space className="width-100 spread">
                <Title level={5}>
                    {t('common:Candidate_plural')}: {ballot.candidates.length}
                </Title>
                <Title level={5}>
                    {t('common:Selected')} ({selected})
                </Title>
                <Button onClick={clearSelection} type="text" danger={true} style={{ opacity: !selected ? 0 : 1 }}>
                    {t('common:Clear')}
                </Button>
            </Space>
            <CandidateList
                typeOfSelection={ballot.type}
                candidates={ballot.candidates as ICandidateEntity[]}
                onChange={onChange}
                selection={ballot.type == BallotType.SINGLE ? selection.single : selection.multiple}
            />
            <Button type="primary" shape="round" onClick={submitVote}>
                {t('common:Submit vote')}
            </Button>
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
        </div>
    )
}
