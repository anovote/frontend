import * as React from 'react'
import { Table, Upload, Button, Menu, Dropdown, Alert } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { FileParser } from './FileParser'
import { useTranslation } from 'react-i18next'

export default function EligibleVotersTable(): React.ReactElement {
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
                setMappedCsvArray(parseArrayToObjectArray(parsedCsv))
            } catch (e) {
                setErrorMessage(t('Something went wrong in the parsing'))
            }
        } else if (file.type === 'application/json') {
            const parsedJson = await fileParser.parseJson<{ emails: string[] }>(file)
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

    const ImportFileMenu = (): React.ReactElement => {
        return (
            <Menu>
                <Menu.Item>
                    <Upload beforeUpload={parseFile} accept=".csv">
                        CSV
                    </Upload>
                </Menu.Item>
                <Menu.Item>
                    <Upload beforeUpload={parseFile} accept=".json">
                        JSON
                    </Upload>
                </Menu.Item>
            </Menu>
        )
    }

    return (
        <div className="voters-table-container">
            <Dropdown className="import-voters-dropdown" overlay={<ImportFileMenu />} placement="bottomRight" arrow>
                <Button
                    className="import-voters-button"
                    type="primary"
                    icon={<PlusOutlined />}
                    size="large"
                    shape="circle"
                ></Button>
            </Dropdown>
            <Table columns={columns} dataSource={mappedCsvArray} />
            <div>{!!errorMessage && <Alert message={errorMessage} type={'warning'} showIcon closable />}</div>
        </div>
    )
}
