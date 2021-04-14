import { PlusOutlined } from '@ant-design/icons'
import { Alert, Button, Col, Dropdown, Form, FormInstance, Input, List, Menu, Row, Space, Upload } from 'antd'
import Title from 'antd/lib/typography/Title'
import { convertTwoDimArrayToOneDimArray } from 'core/helpers/array'
import { isValidEmail } from 'core/helpers/validation'
import { IEligibleVoter } from 'core/models/ballot/IEligibleVoter'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { createListOfEligibleVoters } from '../../core/helpers/eligibleVoter'
import { FileParser } from './FileParser'

export default function EligibleVotersTable({
    onChange,
    initialVoters,
    formContext,
}: {
    onChange: (eligibleVoters: IEligibleVoter[]) => void
    formContext: FormInstance
    initialVoters?: IEligibleVoter[]
}): React.ReactElement {
    const [t] = useTranslation(['parsing', 'error'])
    const [errorMessage, setErrorMessage] = React.useState('')
    const [duplicateErrorMessage, setDuplicateErrorMessage] = React.useState('')
    const [invalidEmailErrorMessage, setInvalidEmailErrorMessage] = React.useState('')
    const [voters, setVoters] = React.useState<IEligibleVoter[]>(
        initialVoters ? initialVoters : new Array<IEligibleVoter>(),
    )
    const [addByManual, setAddByManual] = useState(false)

    useEffect(() => {
        onChange(voters)
    }, [voters])

    const fileParser = new FileParser()

    const NEW_VOTER = 'new_voter'

    /**
     * Parses a CSV or JSON file, where the CSV or JSON
     * needs to be in a specific "email" format.
     * @param file The file we want to parse
     */
    // todo #183 make sure that if there already exists voters that there are no duplicates between existing list and uploaded list
    const parseFile = async (file: File): Promise<void> => {
        let arrays: { invalidEmails: string[]; noDuplicates: string[]; eligibleVoters: IEligibleVoter[] } = {
            invalidEmails: [],
            noDuplicates: [],
            eligibleVoters: [],
        }
        if (file.type === 'text/csv' || file.type === 'application/vnd.ms-excel') {
            try {
                const parsedCsv = await fileParser.parseCsv<string>(file)
                arrays = createListOfEligibleVoters(convertTwoDimArrayToOneDimArray(parsedCsv))
            } catch (e) {
                setErrorMessage(t('parsing:Something went wrong in the parsing'))
            }
        } else if (file.type === 'application/json') {
            const parsedJson = await fileParser.parseJson<{ emails: { email: string }[] }>(file)
            const emails = parsedJson.emails.map((email) => email.email)
            arrays = createListOfEligibleVoters(emails)
        } else {
            setErrorMessage(t('error:The-file-is-not-CSV-or-JSON'))
            return
        }
        checkInputArrays(arrays)
        const newEligibleVoters = arrays.eligibleVoters
        const copyOfVoters = [...voters]
        copyOfVoters.push(...newEligibleVoters)
        setVoters(copyOfVoters)
        onChange(copyOfVoters)
    }

    function checkInputArrays(arrays: {
        invalidEmails: string[]
        noDuplicates: string[]
        eligibleVoters: IEligibleVoter[]
    }): void {
        if (arrays.invalidEmails.length != 0) {
            setInvalidEmailErrorMessage(t('parsing:Removed the following invalid emails') + ': ' + arrays.invalidEmails)
        }

        if (arrays.noDuplicates.length > arrays.eligibleVoters.length) {
            setDuplicateErrorMessage(t('parsing:Removed duplicate entries'))
        }
    }

    const addManualInputField = () => {
        setAddByManual(true)
    }

    const handleAddNewVoterByEnter = (e: React.SyntheticEvent<HTMLInputElement>) => {
        e.preventDefault()
        const voterIdentification = e.currentTarget.value
        handleAddNewVoter(voterIdentification)
    }

    /**
     * Adds a voter to the list if all checks pass.
     * Display error if something is wrong
     * @param voterIdentification
     * @returns
     */
    const handleAddNewVoter = (voterIdentification: string) => {
        if (!isValidEmail(voterIdentification)) {
            throw new Error(t('error:not-valid-email'))
        }

        const newVoter: IEligibleVoter = { identification: voterIdentification }
        if (isDuplicate(newVoter)) {
            formContext.setFields([{ name: NEW_VOTER, errors: [t('error:Email-is-duplicate')] }])
            throw new Error(t('error:duplicate-email'))
        }

        setVoters([...voters, newVoter])
        formContext.resetFields([NEW_VOTER])
    }

    const isDuplicate = (newVoter: IEligibleVoter) => {
        return voters.find((voter) => {
            return voter.identification === newVoter.identification
        })
    }

    const handleAddNewVoterByButtonClick = () => {
        const voterIdentification = formContext.getFieldValue(NEW_VOTER)
        try {
            handleAddNewVoter(voterIdentification)
        } catch (err) {
            console.log(err.message)
        }
    }

    /**
     * Aims to close the input field.
     * Will first handle the input values if there is any.
     * @returns
     */
    const handleDone = async () => {
        const addNewVoterInput = formContext.getFieldInstance(NEW_VOTER)
        const voterIdentification = addNewVoterInput.state.value
        if (!voterIdentification) {
            setAddByManual(false)
            return
        }

        try {
            handleAddNewVoter(voterIdentification)
            await formContext.validateFields([NEW_VOTER])
            setAddByManual(false)
        } catch (err) {
            console.log(err.message) // this could be done silently as antd takes care of displaying the error
        }
    }

    const ImportFileMenu = (): React.ReactElement => {
        return (
            <Menu className="import-voters-menu">
                <Menu.Item>
                    <span className="manual-button" role="button" onClick={addManualInputField}>
                        {t('form:Add manually')}
                    </span>
                </Menu.Item>
                <Menu.Item>
                    <Upload className="upload-button" beforeUpload={parseFile} accept=".csv">
                        CSV
                    </Upload>
                </Menu.Item>
                <Menu.Item>
                    <Upload className="upload-button" beforeUpload={parseFile} accept=".json">
                        JSON
                    </Upload>
                </Menu.Item>
            </Menu>
        )
    }

    return (
        <div>
            <Row>
                <Col span={12}>
                    <Title level={2}>{t('common:Eligible voters')}</Title>
                </Col>
                <Col span={12}>
                    <Space align="end" direction="vertical" className="width-100">
                        <Dropdown
                            className="import-voters-dropdown"
                            overlay={<ImportFileMenu />}
                            placement="bottomRight"
                            arrow
                        >
                            <Button type="primary" icon={<PlusOutlined />} size="large" shape="circle"></Button>
                        </Dropdown>
                    </Space>
                </Col>
            </Row>
            <List
                id="voters-list"
                dataSource={voters}
                renderItem={(item) => <List.Item>{item.identification}</List.Item>}
            />
            {addByManual && (
                <Row>
                    <Form.Item
                        name="new_voter"
                        validateTrigger={['onBlur', 'onChange']}
                        rules={[{ type: 'email', message: 'Not an valid email' }]}
                    >
                        <Input placeholder="add new email" onPressEnter={handleAddNewVoterByEnter}></Input>
                    </Form.Item>
                    <Button onClick={handleAddNewVoterByButtonClick}>Add</Button>
                    <Button onClick={handleDone}>Done</Button>
                </Row>
            )}
            <div>
                {!!errorMessage && <Alert message={errorMessage} type={'warning'} showIcon closable />}
                {!!duplicateErrorMessage && (
                    <Alert message={duplicateErrorMessage} type={'warning'} showIcon closable />
                )}
                {!!invalidEmailErrorMessage && (
                    <Alert message={invalidEmailErrorMessage} type={'warning'} showIcon closable />
                )}
            </div>
        </div>
    )
}
