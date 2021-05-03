import { PlusOutlined } from '@ant-design/icons'
import { Button, Dropdown, Form, FormInstance, Input, List, Menu, Space, Upload } from 'antd'
import FormItem from 'antd/lib/form/FormItem'
import { AlertList } from 'components/alert/AlertList'
import { EligibleVoterListItem } from 'components/EligibleVoterListItem'
import { convertTwoDimArrayToOneDimArray } from 'core/helpers/array'
import { isValidEmail } from 'core/helpers/validation'
import { useAlert } from 'core/hooks/useAlert'
import { IEligibleVoter } from 'core/models/ballot/IEligibleVoter'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { createListOfEligibleVoters } from '../../core/helpers/eligibleVoter'
import { FileParser } from './FileParser'

export default function EligibleVotersList({
    onChange,
    initialVoters,
    formContext,
}: {
    onChange: (eligibleVoters: IEligibleVoter[]) => void
    formContext: FormInstance
    initialVoters?: IEligibleVoter[]
}): React.ReactElement {
    const [t] = useTranslation(['parsing', 'error'])
    const [voters, setVoters] = React.useState<IEligibleVoter[]>(
        initialVoters ? initialVoters : new Array<IEligibleVoter>(),
    )
    const [addByManual, setAddByManual] = useState(false)
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        onChange(voters)
    }, [voters])

    const { alertStates, dispatchAlert } = useAlert()

    const fileParser = new FileParser()

    const NEW_VOTER = 'new_voter'

    /**
     * Parses a CSV or JSON file, where the CSV or JSON
     * needs to be in a specific "email" format.
     * @param file The file we want to parse
     */
    const parseFile = async (file: File): Promise<void> => {
        setVisible(false)

        let parsedEmails: string[] = []
        if (file.type === 'text/csv' || file.type === 'application/vnd.ms-excel') {
            try {
                const parsedCsv = await fileParser.parseCsv<string>(file)
                parsedEmails = convertTwoDimArrayToOneDimArray(parsedCsv)
            } catch (e) {
                dispatchAlert({
                    type: 'add',
                    level: 'error',
                    message: t('parsing:something went wrong in the parsing'),
                })
            }
        } else if (file.type === 'application/json') {
            const parsedJson = await fileParser.parseJson<{ emails: { email: string }[] }>(file)
            parsedEmails = parsedJson.emails.map((email) => email.email)
        } else {
            dispatchAlert({ type: 'add', level: 'error', message: t('parsing:The-file-is-not-CSV-or-JSON') })
            return
        }

        const filteredVoters = createListOfEligibleVoters([
            ...parsedEmails,
            ...voters.map((voter) => voter.identification),
        ])

        checkInputArrays(filteredVoters)
        setVoters(filteredVoters.eligibleVoters)
        onChange(filteredVoters.eligibleVoters)
    }

    function checkInputArrays(arrays: {
        invalidEmails: string[]
        noDuplicates: string[]
        eligibleVoters: IEligibleVoter[]
    }): void {
        if (arrays.invalidEmails.length != 0) {
            dispatchAlert({
                type: 'add',
                level: 'warning',
                message: t('parsing:Removed the following invalid emails') + arrays.invalidEmails,
            })
        }

        if (arrays.noDuplicates.length > arrays.eligibleVoters.length) {
            dispatchAlert({ type: 'add', level: 'warning', message: t('parsing:Removed duplicate entries') })
        }
    }

    const addManualInputField = () => {
        setAddByManual(true)
        setVisible(false)
    }

    const handleAddNewVoterByEnter = (e: React.SyntheticEvent<HTMLInputElement>) => {
        e.preventDefault()
        const voterIdentification = e.currentTarget.value
        handleAddNewVoter(voterIdentification)
    }

    const handleVisibleChange = (flag: boolean) => {
        setVisible(flag)
    }

    /**
     * Adds a voter to the list if all checks pass.
     * Display error if something is wrong
     * @param voterIdentification
     * @returns
     */
    const handleAddNewVoter = (voterIdentification: string) => {
        if (!isValidEmail(voterIdentification)) {
            throw new Error(t('error:not valid email'))
        }

        const newVoter: IEligibleVoter = { identification: voterIdentification }
        if (isDuplicate(newVoter)) {
            formContext.setFields([{ name: NEW_VOTER, errors: [t('error:Email is duplicate')] }])
            throw new Error(t('error:duplicate email'))
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

    const handleEligibleVoterDelete = (voterIdentity: string) => {
        const newVoters = voters.filter((voter) => voter.identification !== voterIdentity)
        setVoters(newVoters)
    }

    const ImportFileMenu = (): React.ReactElement => {
        return (
            <Menu className="import-voters-menu">
                <Menu.Item key="1" onClick={addManualInputField}>
                    {t('form:Add manually')}
                </Menu.Item>
                <Menu.Item key="2">
                    <Upload beforeUpload={parseFile} accept=".csv" className="upload">
                        CSV
                    </Upload>
                </Menu.Item>
                <Menu.Item key="3">
                    <Upload beforeUpload={parseFile} accept=".json" className="upload">
                        JSON
                    </Upload>
                </Menu.Item>
            </Menu>
        )
    }

    return (
        <div>
            <FormItem
                className="eligible-voters-list"
                label={t('common:Eligible voters')}
                tooltip={t('election:Eligible voters tooltip description')}
            >
                <Space align="end" direction="vertical" className="width-100">
                    <Dropdown
                        className="import-voters-dropdown"
                        overlay={<ImportFileMenu />}
                        placement="bottomRight"
                        trigger={['click']}
                        onVisibleChange={handleVisibleChange}
                        visible={visible}
                        arrow
                    >
                        <Button type="primary" icon={<PlusOutlined />} size="large" shape="circle"></Button>
                    </Dropdown>
                </Space>
                <List
                    id="voters-list"
                    dataSource={voters}
                    locale={{ emptyText: t('election:No eligible voters') }}
                    renderItem={(item) => (
                        <List.Item>
                            <EligibleVoterListItem
                                voterIdentity={item.identification}
                                onDelete={handleEligibleVoterDelete}
                            />
                        </List.Item>
                    )}
                />
                {addByManual && (
                    <>
                        <Form.Item
                            name="new_voter"
                            validateTrigger={['onBlur', 'onChange']}
                            rules={[{ type: 'email', message: t('error:not valid email') }]}
                            normalize={(val) => val.trim()}
                        >
                            <Input placeholder="ola.nordmann@gmail.com" onPressEnter={handleAddNewVoterByEnter}></Input>
                        </Form.Item>
                        <Space>
                            <Button onClick={handleAddNewVoterByButtonClick}>{t('common:Add')}</Button>
                            <Button onClick={handleDone}>{t('common:Done')}</Button>
                        </Space>
                    </>
                )}
                <div>
                    <AlertList
                        alerts={alertStates}
                        onRemove={(index) => dispatchAlert({ type: 'remove', index: index })}
                    />
                </div>
            </FormItem>
        </div>
    )
}
