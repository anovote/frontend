import * as React from 'react'
import { Table, Upload, Button, Menu, Dropdown, Alert, Col, Row } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { FileParser } from './FileParser'
import { useTranslation } from 'react-i18next'

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
                setMappedCsvArray(parseArrayToObjectArray(parsedCsv))
            } catch (e) {
                setErrorMessage(t('Something went wrong in the parsing'))
            }
        } else if (file.type === 'application/json') {
            const parsedJson = await fileParser.parseJson<{ emails: string[] }>(file)
            createListOfEligibleVoters(parsedJson.emails)
            const emails = parseArrayToObjectArray(parsedJson.emails)
            setMappedCsvArray(emails)
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

    // https://stackoverflow.com/questions/14824283/convert-a-2d-javascript-array-to-a-1d-array/14824303
    function convertTwoDimArrayToOneDimArray(twoDimArray: string[]) {
        let newArr: string[] = []

        for (let i = 0; i < twoDimArray.length; i++) {
            newArr = newArr.concat(twoDimArray[i])
        }
        return newArr
    }

    function createListOfEligibleVoters(listOfIdentifications: string[]) {
        const unique = listOfIdentifications.filter(function (elem, index, self) {
            return index === self.indexOf(elem)
        })

        const eligibleVoters: IEligibleVoter[] = []
        for (let i = 0; i < unique.length; i++) {
            eligibleVoters.push({ identification: unique[i] })
        }

        onUpload(eligibleVoters)
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
            <div>{!!errorMessage && <Alert message={errorMessage} type={'warning'} showIcon closable />}</div>
        </div>
    )
}

export interface IEligibleVoter {
    identification: string
}
