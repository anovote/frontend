import * as React from 'react'
import { Table, Upload, Button, Menu, Dropdown, Alert, Col, Row } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { FileParser } from './FileParser'
import { useTranslation } from 'react-i18next'
import { convertTwoDimArrayToOneDimArray, filterForDuplicates, trimItemsInArray } from 'core/helpers/array'

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
    const [notEmailErrorMessage, setNotEmailErrorMessage] = React.useState('')
    const [mappedCsvArray, setMappedCsvArray] = React.useState<{ key: number; email: string }[]>([])
    const fileParser = new FileParser()

    /**
     * Parses a CSV or JSON file, where the CSV or JSON
     * needs to be in a specific "email" format.
     * @param file The file we want to parse
     */
    const parseFile = async (file: File): Promise<void> => {
        if (file.type === 'text/csv' || file.type === 'application/vnd.ms-excel') {
            try {
                const parsedCsv = await fileParser.parseCsv<string>(file)
                createListOfEligibleVoters(convertTwoDimArrayToOneDimArray(parsedCsv))
            } catch (e) {
                setErrorMessage(t('Something went wrong in the parsing'))
            }
        } else if (file.type === 'application/json') {
            const parsedJson = await fileParser.parseJson<{ emails: string[] }>(file)
            createListOfEligibleVoters(parsedJson.emails)
        } else {
            setErrorMessage(t('The file is not CSV or JSON!'))
        }
        return
    }

    function parseArrayToObjectArray(array: string[]): { key: number; email: string }[] {
        return array.map((email, index) => {
            return { key: index, email }
        })
    }

    /**
     * Creates a list of eligible voters based of a list of emails.
     * First the emails in the list are trimmed, then any duplicates are removed,
     * and then checked if all of the emails are valid. Any invalid emails will be removed.
     * @param listOfEmails The list we want to use to create an eligible voters list
     * @returns list of eligible voters.
     */
    function createListOfEligibleVoters(listOfEmails: string[]): IEligibleVoter[] {
        const trimmedList: string[] = trimItemsInArray(listOfEmails)

        const unique = filterForDuplicates(trimmedList)

        if (unique.length < trimmedList.length) {
            setDuplicateErrorMessage(t('There were duplicates in the list, but we have removed these'))
        }

        const invalidEmails: string[] = []
        const uniqueRemovedArray: string[] = [...unique]
        const eligibleVoters: IEligibleVoter[] = []

        for (let i = 0; i < unique.length; i++) {
            if (isEmailValid(unique[i])) {
                eligibleVoters.push({ identification: unique[i] })
            } else {
                invalidEmails.push(unique[i])
                delete uniqueRemovedArray[i]
            }
        }

        if (invalidEmails.length != 0) {
            setNotEmailErrorMessage(
                'Email(s): ' + invalidEmails + ', ' + t('were removed due to them not being valid emails'),
            )
        }

        setMappedCsvArray(parseArrayToObjectArray(uniqueRemovedArray))

        onUpload(eligibleVoters)

        return eligibleVoters
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
                    <Dropdown
                        className="import-voters-dropdown"
                        overlay={<ImportFileMenu />}
                        placement="bottomRight"
                        arrow
                    >
                        <Button
                            className="import-voters-button"
                            type="primary"
                            icon={<PlusOutlined />}
                            size="large"
                            shape="circle"
                        ></Button>
                    </Dropdown>
                </Col>
            </Row>
            <Table columns={columns} dataSource={mappedCsvArray} />
            <div>
                {!!errorMessage && <Alert message={errorMessage} type={'warning'} showIcon closable />}
                {!!duplicateErrorMessage && (
                    <Alert message={duplicateErrorMessage} type={'warning'} showIcon closable />
                )}
                {!!notEmailErrorMessage && <Alert message={notEmailErrorMessage} type={'warning'} showIcon closable />}
            </div>
        </div>
    )
}

export interface IEligibleVoter {
    identification: string
}
