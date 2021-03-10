import { CheckOutlined, FrownOutlined, LoadingOutlined } from '@ant-design/icons'
import { Alert, Layout } from 'antd'
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
    additionalInfo?: string
    icon: ReactElement | ReactNode
}

export default function VerifyVoterView(): ReactElement {
    const [socket] = useSocket()
    const [t] = useTranslation(['voter'])
    const query = useQuery()
    const codeToVerify = query.get('code')

    const initialVerificationState: IVerificationState = {
        label: t('voter:Verifying code'),
        additionalInfo: t('voter:Please do not close this window'),
        icon: <LoadingOutlined />,
    }
    const [statusState, setStatusState] = useState(initialVerificationState)

    const integrityVerifiedEvent = (data: IIntegrityVerification) => {
        if (data.statusCode === StatusCodes.OK) {
            setStatusState({
                icon: <CheckOutlined className="color-success-contrasting scale-up-center" />,
                label: t('voter:Voter verification succeeded'),
                additionalInfo: t('voter:This browser tab can ble closed'),
            })
        } else {
            setStatusState({
                icon: <FrownOutlined className="color-danger-contrasting scale-up-center" />,
                label: t('voter:Voter verification failed'),
                additionalInfo: t('voter:Verification failed suggestion'),
            })
        }
    }

    useEffect(() => {
        if (codeToVerify) {
            const verificationPayload: IVerificationParams = {
                code: codeToVerify,
            }

            socket.connect()
            // Trigger this only once, as we do not need it after we get a response.
            socket.once(Events.join.receive.voterIntegrityVerified, integrityVerifiedEvent)
            socket.emit(Events.join.send.verifyVoterIntegrity, verificationPayload)
        } else {
            setStatusState({
                icon: <FrownOutlined className="color-danger-contrasting scale-up-center" />,
                label: t('voter:Verification code is missing'),
                additionalInfo: undefined,
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
                        {(!!statusState.additionalInfo && (
                            <div className="mt-20 is-flex has-content-center-center">
                                <Alert type="info" showIcon={true} message={statusState.additionalInfo}></Alert>
                            </div>
                        )) || <></>}
                    </VoterContent>
                </Content>
                <VoterFooter />
            </Layout>
        </CenterView>
    )
}
