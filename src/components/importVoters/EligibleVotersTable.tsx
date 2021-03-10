import * as React from 'react'
import { Table, Upload, Button, Menu, Dropdown, Alert, Col, Row, Space } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { FileParser } from './FileParser'
import { useTranslation } from 'react-i18next'
import { convertTwoDimArrayToOneDimArray, filterForDuplicates, trimItemsInArray } from 'core/helpers/array'

export interface IEligibleVoter {
    identification: string
}

export default function EligibleVotersTable({
    onUpload,
}: {
    onUpload: (eligibleVoters: IEligibleVoter[]) => void
}): React.ReactElement {
    const columns = [
        {
            dataIndex: 'email',
            key: 'email',
        },
    ]

    const [t] = useTranslation(['parsing'])
    const [errorMessage, setErrorMessage] = React.useState('')
    const [duplicateErrorMessage, setDuplicateErrorMessage] = React.useState('')
    const [invalidEmailErrorMessage, setInvalidEmailErrorMessage] = React.useState('')
    const [mappedObjectArray, setMappedObjectArray] = React.useState<{ key: number; email: string }[]>([])
    const fileParser = new FileParser()

    /**
     * Parses a CSV or JSON file, where the CSV or JSON
     * needs to be in a specific "email" format.
     * @param file The file we want to parse
     */
    const parseFile = async (file: File): Promise<void> => {
        let arrays: any
        if (file.type === 'text/csv' || file.type === 'application/vnd.ms-excel') {
            try {
                const parsedCsv = await fileParser.parseCsv<string>(file)
                arrays = createListOfEligibleVoters(convertTwoDimArrayToOneDimArray(parsedCsv))
            } catch (e) {
                setErrorMessage(t('Something went wrong in the parsing'))
            }
        } else if (file.type === 'application/json') {
            const parsedJson = await fileParser.parseJson<{ emails: string[] }>(file)
            arrays = createListOfEligibleVoters(parsedJson.emails)
        } else {
            setErrorMessage(t('The file is not CSV or JSON!'))
            return
        }
        checkInputArrays(arrays)
        setMappedObjectArray(createObjectArrayFromEligibleVoters(arrays.eligibleVoters))
        onUpload(arrays.eligibleVoters)
    }

    function createObjectArrayFromEligibleVoters(eligibleVoters: IEligibleVoter[]): { key: number; email: string }[] {
        const objectArray: { key: number; email: string }[] = []

        for (let i = 0; i < eligibleVoters.length; i++) {
            objectArray.push({ key: i, email: eligibleVoters[i].identification })
        }

        return objectArray
    }

    /**
     * Creates a list of eligible voters based of a list of emails.
     * First the emails in the list are trimmed, then any duplicates are removed,
     * and then checked if all of the emails are valid. Any invalid emails will be removed.
     * @param arrays
     * @returns
     */
    function createListOfEligibleVoters(
        listOfEmails: string[],
    ): { invalidEmails: string[]; noDuplicates: string[]; eligibleVoters: IEligibleVoter[] } {
        const trimmedList: string[] = trimItemsInArray(listOfEmails)

        const noDuplicates = filterForDuplicates(trimmedList)

        const invalidEmails: string[] = []
        const eligibleVoters: IEligibleVoter[] = []

        for (let i = 0; i < noDuplicates.length; i++) {
            if (isEmailValid(noDuplicates[i])) {
                eligibleVoters.push({ identification: noDuplicates[i] })
            } else {
                invalidEmails.push(noDuplicates[i])
            }
        }

        return {
            invalidEmails,
            noDuplicates,
            eligibleVoters,
        }
    }

    function checkInputArrays(arrays: {
        invalidEmails: string[]
        noDuplicates: string[]
        eligibleVoters: IEligibleVoter[]
    }): void {
        if (arrays.invalidEmails.length != 0) {
            setInvalidEmailErrorMessage(
                t('Email(s)') +
                    ': ' +
                    arrays.invalidEmails +
                    ', ' +
                    t('Removed because strings provided are not being valid emails').toLowerCase(),
            )
        }

        if (arrays.noDuplicates.length > arrays.eligibleVoters.length) {
            setDuplicateErrorMessage(t('There were duplicates in the list, but we have removed these'))
        }
    }

    /**
     * Checks if a given email is valid or not.
     * @param email the email we want to validate
     * @returns true if valid, false if not valid
     */
    function isEmailValid(email: string): boolean {
        const emailFormat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/

        if (email.match(emailFormat)) {
            return true
        } else {
            return false
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
            <Table columns={columns} dataSource={mappedObjectArray} />
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
