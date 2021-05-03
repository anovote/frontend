import { Button, Space } from 'antd'
import { CheckboxValueType } from 'antd/lib/checkbox/Group'
import { RadioChangeEvent } from 'antd/lib/radio'
import Title from 'antd/lib/typography/Title'
import { AlertList } from 'components/alert/AlertList'
import BallotTypeDisplay from 'components/BallotTypeDisplay/BallotTypeDisplay'
import CandidateList from 'components/CandidateList/CandidateList'
import { BackendAPI } from 'core/api'
import { ErrorCodeResolver } from 'core/error/ErrorCodeResolver'
import { Events } from 'core/events'
import { useAlert } from 'core/hooks/useAlert'
import { useSocket } from 'core/hooks/useSocket'
import { BallotType } from 'core/models/ballot/BallotType'
import { IBallotEntity } from 'core/models/ballot/IBallotEntity'
import { ICandidate, ICandidateEntity } from 'core/models/ballot/ICandidate'
import { reducer } from 'core/reducers/ballotReducer'
import { AuthenticationService } from 'core/service/authentication/AuthenticationService'
import { LocalStorageService } from 'core/service/storage/LocalStorageService'
import { StorageKeys } from 'core/service/storage/StorageKeys'
import { WebsocketEvent } from 'core/socket/EventHandler'
import { ElectionAction } from 'core/state/election/electionReducer'
import React, { Dispatch, ReactElement, useEffect, useReducer, useState } from 'react'
import { useTranslation } from 'react-i18next'

const initialState = {
    selected: 0,
    selection: {
        single: null,
        multiple: [],
    },
}

export default function BallotDisplayHandler({
    ballot,
    electionDispatch,
}: {
    ballot: IBallotEntity
    electionDispatch: Dispatch<ElectionAction>
}): ReactElement {
    const [{ selected, selection }, dispatch] = useReducer(reducer, initialState)

    const [t] = useTranslation(['common', 'ballot', 'error'])
    const [socket] = useSocket()

    const { alertStates, dispatchAlert } = useAlert()

    const [ballotState, setBallotState] = useState<IBallotEntity>(ballot)

    useEffect(() => {
        const candidates = addBlankCandidate(ballot.candidates)
        setBallotState({ ...ballot, candidates })
    }, [ballot])

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
        const storageService = new AuthenticationService(BackendAPI, new LocalStorageService<StorageKeys>())
        const voter = storageService.getDecodedToken()
        switch (ballot.type) {
            case BallotType.SINGLE: {
                if (!socket.connected) {
                    dispatchAlert({
                        type: 'add',
                        level: 'error',
                        message: t('common:Could not connect to the server'),
                    })
                } else if (selected === 0) {
                    dispatchAlert({
                        type: 'add',
                        level: 'error',
                        message: t('common:You need to select a candidate'),
                    })
                } else {
                    socket.emit(
                        Events.client.vote.submit,
                        {
                            candidate: selection.single && selection.single >= 0 ? selection.single : null,
                            ballot: ballot.id,
                            voter: voter?.id,
                            submitted: new Date(),
                        },
                        WebsocketEvent({
                            dataHandler: () => {
                                dispatchAlert({
                                    type: 'add',
                                    level: 'success',
                                    message: t('common:Your vote was submitted'),
                                })
                                electionDispatch({ type: 'waiting' })
                            },
                            errorHandler: (error) => {
                                const errorCodeResolver = new ErrorCodeResolver(t)
                                dispatchAlert({
                                    type: 'add',
                                    level: 'error',
                                    message: t('error:Unable to submit vote'),
                                    description: errorCodeResolver.resolve(error.code),
                                })
                            },
                        }),
                    )
                }
                break
            }
            case BallotType.MULTIPLE: {
                break
            }

            case BallotType.RANKED: {
                break
            }
            // TODO add submit vote handling for the different ballot types
            default:
                console.error('The vote could not be submitted...')
        }
    }

    /**
     * Adds a blank candidate alternative to the candidate list.
     * @param candidates the list of candidates
     * @returns new list of candidate with a blank alternative
     */
    const addBlankCandidate = (candidates: ICandidateEntity[]) => {
        const blankCandidate: ICandidateEntity = {
            id: -1,
            candidate: t('ballot:Blank'),
        }
        if (checkForDuplicateBlank(candidates)) {
            return candidates
        }
        candidates.push(blankCandidate)
        return candidates
    }

    /**
     * Checks a list of candidates to see if it has a blank alternative
     * @param candidates the list of candidates
     * @returns true or false
     */
    const checkForDuplicateBlank = (candidates: ICandidate[]) => {
        return candidates.find((candidate) => candidate.candidate === 'blank' || candidate.candidate === null)
    }

    return (
        <div className="voter-display">
            <BallotTypeDisplay type={ballotState.type} />
            <Space className="width-100 spread">
                <Title level={5}>
                    {t('common:Candidate_plural')}: {ballotState.candidates.length}
                </Title>
                <Title level={5}>
                    {t('common:Selected')} ({selected})
                </Title>
                <Button onClick={clearSelection} type="text" danger={true} style={{ opacity: !selected ? 0 : 1 }}>
                    {t('common:Clear')}
                </Button>
            </Space>
            <CandidateList
                typeOfSelection={ballotState.type}
                candidates={ballotState.candidates as ICandidateEntity[]}
                onChange={onChange}
                selection={ballotState.type == BallotType.SINGLE ? selection.single : selection.multiple}
            />
            <Button type="primary" shape="round" onClick={submitVote}>
                {t('common:Submit vote')}
            </Button>
            <div className="alert-field">
                <AlertList alerts={alertStates} onRemove={(index) => dispatchAlert({ type: 'remove', index: index })} />
            </div>
        </div>
    )
}
