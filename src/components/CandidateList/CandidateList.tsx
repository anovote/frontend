import { Checkbox, Radio, RadioChangeEvent } from 'antd'
import { CheckboxValueType } from 'antd/lib/checkbox/Group'
import CandidateEntry from 'components/CandidateEntry/CandidateEntry'
import { ICandidateEntity } from 'core/models/ballot/ICandidate'
import React, { ReactElement } from 'react'

type SelectionType = 'single' | 'multiple' | 'ranked'

type RadioValue = number | null
type CheckBoxValue = CheckboxValueType[] | undefined

/**
 * Generates a list of candidates that can be selected, checked or other, according to its typeOfSelection
 * @param candidateList object represents the necessary properties to create a candidate list with typeOfSelection
 * @returns a list of candidates
 */
export default function CandidateList({
    typeOfSelection,
    candidates,
    onChange,
    selection,
}: {
    typeOfSelection: SelectionType | number
    candidates: ICandidateEntity[]
    onChange: (change: RadioChangeEvent | CheckboxValueType[]) => void
    selection: RadioValue | CheckBoxValue
}): ReactElement {
    let renderList

    switch (typeOfSelection) {
        case 'single':
        case 0:
            renderList = (
                <Radio.Group className="width-100" onChange={onChange} value={selection as RadioValue}>
                    {candidates.map(({ id, candidate }, index) => {
                        return (
                            <Radio className="ballot-candidate" value={id} key={index + 1}>
                                <CandidateEntry id={index + 1} name={candidate} />
                            </Radio>
                        )
                    })}
                </Radio.Group>
            )
            break
        case 'multiple':
        case 1:
            renderList = (
                <Checkbox.Group className="width-100" onChange={onChange} value={selection as CheckBoxValue}>
                    {candidates.map(({ id, candidate }, index) => {
                        return (
                            <Checkbox className="ballot-candidate" value={id} key={index + 1}>
                                <CandidateEntry id={index + 1} name={candidate} />
                            </Checkbox>
                        )
                    })}
                </Checkbox.Group>
            )
            break

        default:
            renderList = <div>This typeOfSelection is not implemented</div>
            break
    }

    return <>{renderList}</>
}
