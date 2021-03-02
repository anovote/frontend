import { Alert, AlertProps, Button, Col, Form, Input, Row, Switch } from 'antd'
import Modal from 'antd/lib/modal/Modal'
import SelectBallotType from 'components/ballot/selectBallotTypes/SelectBallotType'
import SelectResultType from 'components/ballot/SelectResultType'
import PreviewList from 'components/previewList/PreviewList'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

export default function CreateBallotModal({
    showModal,
    close,
}: {
    showModal: boolean
    close: () => void
}): ReactElement {
    const [alertMessage, setAlertMessage] = React.useState<AlertProps>()
    const [t] = useTranslation(['translation', 'common', 'form', 'profile'])
    const submitForm = async (formData: { email: string }) => {
        console.info(formData)
        setAlertMessage({ type: 'error', message: 'LOGIC NOT IMPLEMENTED' })
    }
    const onDelete = () => {
        console.log('Delete')
    }
    const onEdit = () => {
        console.log('On edit')
    }
    return (
        <>
            <Modal
                width={'100vw'}
                // TODO Add status ICON implementation here when merged
                title={'Create ballot'}
                footer={null}
                visible={showModal}
                onCancel={close}
                className="modal-display-large"
            >
                <Form onFinish={submitForm} layout={'vertical'} className="is-flex-row split-view">
                    {!!alertMessage && (
                        <Alert
                            message={alertMessage?.message}
                            description={alertMessage?.description}
                            type={alertMessage?.type}
                            onClose={() => {
                                setAlertMessage(undefined)
                            }}
                            showIcon
                            closable
                        />
                    )}
                    <div className={'split-view-left'}>
                        <Form.Item
                            name="title"
                            rules={[
                                {
                                    required: true,
                                    message: t('form:Is required'),
                                },
                            ]}
                        >
                            <Input placeholder={t('common:Title')} />
                        </Form.Item>

                        <Form.Item>
                            <Input.TextArea placeholder={t('common:Description')} />
                        </Form.Item>
                        <SelectBallotType label={'Select type'} />
                        <SelectResultType label={'Result type'} />
                        <Form.Item label={'Display vote count'}>
                            <Switch></Switch>
                        </Form.Item>
                        <Button type="primary" htmlType="submit" className="">
                            {t('common:Save')}
                        </Button>
                    </div>
                    <div className="split-view-right">
                        <PreviewList onDelete={onDelete} onEdit={onEdit}></PreviewList>
                    </div>
                </Form>
            </Modal>
        </>
    )
}
