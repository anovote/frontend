import { CheckOutlined, FrownOutlined, LoadingOutlined } from '@ant-design/icons'
import { Alert, AlertProps, Layout } from 'antd'
import { Content } from 'antd/lib/layout/layout'
import CenterView from 'components/centerView/CenterView'
import SquareIconContainer from 'components/iconContainer/SquareIconContainer'
import VoterContent from 'components/voterContent/VoterContent'
import VoterFooter from 'components/voterFooter/VoterFooter'
import VoterHeader from 'components/voterHeader/VoterHeader'
import { Events } from 'core/events'
import { useQuery } from 'core/hooks/useQuery'
import { useSocket } from 'core/state/websocket/useSocketHook'
import { StatusCodes } from 'http-status-codes'
import React, { ReactElement, ReactNode, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

type ValidationCode = string

interface IVerificationParams {
    code: ValidationCode
}
interface IIntegrityVerification {
    statusCode: StatusCodes
}
interface IVerificationState {
    label: string
    alert?: AlertProps
    additionalInfo?: string
    icon: ReactElement | ReactNode
}

export default function VerifyVoterView(): ReactElement {
    const [socket] = useSocket()
    const [t] = useTranslation(['voter', 'common'])
    const query = useQuery()
    const codeToVerify = query.get('code')

    const initialVerificationState: IVerificationState = {
        icon: <LoadingOutlined />,
        label: t('voter:Verifying code'),
        alert: {
            message: t('voter:Please do not close this window'),
            type: 'warning',
        },
    }
    const [statusState, setStatusState] = useState(initialVerificationState)

    const integrityVerifiedEvent = (data: IIntegrityVerification) => {
        if (data.statusCode === StatusCodes.OK) {
            setStatusState({
                icon: <CheckOutlined className="color-success-contrasting scale-up-center" />,
                label: t('voter:Voter verification succeeded'),
                alert: {
                    message: t('voter:This browser tab can ble closed'),
                    type: 'success',
                },
            })
        } else {
            setStatusState({
                icon: <FrownOutlined className="color-danger-contrasting scale-up-center" />,
                label: t('voter:Voter verification failed'),
                alert: {
                    message: t('voter:Verification failed suggestion'),
                    type: 'error',
                },
            })
        }
    }

    useEffect(() => {
        if (codeToVerify) {
            const verificationPayload: IVerificationParams = {
                code: codeToVerify,
            }
            socket.on(Events.standard.socket.connectError, () => {
                setStatusState({
                    icon: <FrownOutlined className="color-danger-contrasting scale-up-center" />,
                    label: t('voter:Voter verification failed'),
                    alert: {
                        message: t('common:Unexpected error'),
                        type: 'error',
                    },
                })
            })
            socket.on(Events.standard.socket.connect, () => {
                // Trigger this only once, as we do not need it after we get a response.
                socket.once(Events.join.receive.voterIntegrityVerified, integrityVerifiedEvent)
                socket.emit(Events.join.send.verifyVoterIntegrity, verificationPayload)
            })
            socket.connect()
        } else {
            setStatusState({
                icon: <FrownOutlined className="color-danger-contrasting scale-up-center" />,
                label: t('voter:Verification code is missing'),
            })
        }
    }, [])

    return (
        <CenterView>
            <Layout className="small-container">
                <VoterHeader slogan="Anovote" />
                <Content className="voter-election-layout-content">
                    <VoterContent>
                        <SquareIconContainer icon={statusState.icon} label={statusState.label}></SquareIconContainer>
                        {(!!statusState.alert && (
                            <div className="mt-20 is-flex has-content-center-center">
                                <Alert
                                    type={statusState.alert.type}
                                    showIcon={true}
                                    message={statusState.alert.message}
                                ></Alert>
                            </div>
                        )) || <></>}
                    </VoterContent>
                </Content>
                <VoterFooter />
            </Layout>
        </CenterView>
    )
}
