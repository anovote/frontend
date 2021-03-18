import { PlusOutlined } from '@ant-design/icons'
import { Alert, Button, Col, Dropdown, List, Menu, Row, Space, Upload } from 'antd'
import { convertTwoDimArrayToOneDimArray } from 'core/helpers/array'
import { IEligibleVoter } from 'core/models/ballot/IEligibleVoter'
import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { createListOfEligibleVoters } from '../../core/helpers/eligibleVoter'
import { FileParser } from './FileParser'

export default function EligibleVotersTable({
    onUpload,
    initialVoters,
}: {
    onUpload: (eligibleVoters: IEligibleVoter[]) => void
    initialVoters?: IEligibleVoter[]
}): React.ReactElement {
    const [t] = useTranslation(['parsing'])
    const [errorMessage, setErrorMessage] = React.useState('')
    const [duplicateErrorMessage, setDuplicateErrorMessage] = React.useState('')
    const [invalidEmailErrorMessage, setInvalidEmailErrorMessage] = React.useState('')
    const [voters, setVoters] = React.useState<IEligibleVoter[]>(
        initialVoters ? initialVoters : new Array<IEligibleVoter>(),
    )
    const fileParser = new FileParser()

    /**
     * Parses a CSV or JSON file, where the CSV or JSON
     * needs to be in a specific "email" format.
     * @param file The file we want to parse
     */
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
                setErrorMessage(t('Something went wrong in the parsing'))
            }
        } else if (file.type === 'application/json') {
            const parsedJson = await fileParser.parseJson<{ emails: { email: string }[] }>(file)
            const emails = parsedJson.emails.map((email) => email.email)
            arrays = createListOfEligibleVoters(emails)
        } else {
            setErrorMessage(t('The file is not CSV or JSON!'))
            return
        }
        checkInputArrays(arrays)
        setVoters(arrays.eligibleVoters)
        onUpload(arrays.eligibleVoters)
    }

    function checkInputArrays(arrays: {
        invalidEmails: string[]
        noDuplicates: string[]
        eligibleVoters: IEligibleVoter[]
    }): void {
        if (arrays.invalidEmails.length != 0) {
            setInvalidEmailErrorMessage(t('Removed the following invalid emails') + ': ' + arrays.invalidEmails)
        }

        if (arrays.noDuplicates.length > arrays.eligibleVoters.length) {
            setDuplicateErrorMessage(t('Removed duplicate entries'))
        }
    }

    const ImportFileMenu = (): React.ReactElement => {
        return (
            <Menu className="import-voters-menu">
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
                    <h2>{t('common:Eligible voters')}</h2>
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
