import { Button, Space } from 'antd'
import { CheckboxValueType } from 'antd/lib/checkbox/Group'
import { RadioChangeEvent } from 'antd/lib/radio'
import Title from 'antd/lib/typography/Title'
import BallotTypeDisplay from 'components/BallotTypeDisplay/BallotTypeDisplay'
import CandidateList from 'components/CandidateList/CandidateList'
import { BallotType } from 'core/models/ballot/BallotType'
import { IBallot } from 'core/models/ballot/IBallot'
import { ICandidateEntity } from 'core/models/ballot/ICandidate'
import React, { ReactElement, useReducer, useState } from 'react'
import { useTranslation } from 'react-i18next'

type State = {
    selected: number
}

type Action = { type: 'select' } | { type: 'deselect' } | { type: 'reset' }

const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'select':
            return { selected: state.selected + 1 }
        case 'deselect':
            return { selected: state.selected - 1 }
        case 'reset':
            return { selected: 0 }
        default:
    }
    return { selected: state.selected }
}

const initialState = { selected: 0 }

export default function BallotDisplayHandler({ ballot }: { ballot: IBallot }): ReactElement {
    const [state, dispatch] = useReducer(reducer, initialState)
    const [selection, setSelection] = useState<{ single: number | null; multiple: number[] }>({
        single: null,
        multiple: [],
    })

    const [t] = useTranslation(['common'])

    /**
     * Handles the change of clicked candidate(s) according to
     * the type of the ballot
     * @param change the selected change of candidate(s)
     */
    const onChange = (change: RadioChangeEvent | CheckboxValueType[]) => {
        switch (ballot.type) {
            case BallotType.SINGLE: {
                const radio = change as RadioChangeEvent
                if (state.selected != 1) {
                    dispatch({ type: 'select' })
                }
                setSelection({ single: radio.target.value, multiple: [] })
                break
            }
            case BallotType.MULTIPLE: {
                const checked = change as number[]
                if (checked.length > state.selected) {
                    dispatch({ type: 'select' })
                }
                if (checked.length < state.selected) {
                    dispatch({ type: 'deselect' })
                }
                setSelection({ single: null, multiple: checked })
                break
            }

            default:
                console.error('Ballot type not handled')
        }
    }

    /**
     * Clears the selected/selection of candidates and resets the selected
     * counter
     */
    const clearSelection = () => {
        setSelection({ single: null, multiple: [] })
        dispatch({ type: 'reset' })
    }

    return (
        <div className="voter-display">
            <BallotTypeDisplay type={ballot.type} />
            <Space className="width-100 spread">
                <Title level={5}>
                    {t('common:Candidate_plural')}: {ballot.candidates.length}
                </Title>
                <Title level={5}>
                    {t('common:Selected')} ({state.selected})
                </Title>
                <Button onClick={clearSelection} type="text" danger={true} style={{ opacity: !state.selected ? 0 : 1 }}>
                    {t('common:Clear')}
                </Button>
            </Space>
            <CandidateList
                typeOfSelection={ballot.type}
                candidates={ballot.candidates as ICandidateEntity[]}
                onChange={onChange}
                selection={ballot.type == BallotType.SINGLE ? selection.single : selection.multiple}
            />
        </div>
    )
}
