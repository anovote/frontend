import { Layout } from 'antd'
import { Content } from 'antd/lib/layout/layout'
import CenterView from 'components/centerView/CenterView'
import IconMessage from 'components/iconMessage/IconMessage'
import { IIconMessage } from 'components/iconMessage/IIconMessage'
import useIconMessageState from 'components/iconMessage/UseIconMessage'
import VoterContent from 'components/voterContent/VoterContent'
import VoterFooter from 'components/voterFooter/VoterFooter'
import VoterHeader from 'components/voterHeader/VoterHeader'
import { Events } from 'core/events'
import { useQuery } from 'core/hooks/useQuery'
import { useSocket } from 'core/state/websocket/useSocketHook'
import { StatusCodes } from 'http-status-codes'
import React, { ReactElement, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

type ValidationCode = string

interface IVerificationParams {
    code: ValidationCode
}
interface IIntegrityVerification {
    statusCode: StatusCodes
}

export default function VerifyVoterView(): ReactElement {
    const [socket] = useSocket()
    const [t] = useTranslation(['voter', 'common'])
    const query = useQuery()
    const codeToVerify = query.get('code')
    const verificationSuccessMessage: IIconMessage = {
        label: t('voter:Voter verification succeeded'),
        alertMessage: t('voter:This browser tab can ble closed'),
        alertLevel: 'success',
    }
    const verificationMessage: IIconMessage = {
        label: t('voter:Verifying code'),
        alertMessage: t('voter:Please do not close this window'),
        alertLevel: 'warning',
    }
    const verificationFailedMessage: IIconMessage = {
        label: t('voter:Voter verification failed'),
        alertMessage: t('voter:Verification failed suggestion'),
        alertLevel: 'error',
    }
    const connectionFailedMessage: IIconMessage = {
        label: t('voter:Voter verification failed'),
        alertMessage: t('common:Unexpected error'),
        alertLevel: 'error',
    }
    const verificationCodeMissingMessage: IIconMessage = {
        label: t('voter:Verification code is missing'),
    }

    const [statusState, setStatusState] = useIconMessageState(verificationMessage)

    const integrityVerifiedEvent = (data: IIntegrityVerification) => {
        if (data.statusCode === StatusCodes.OK) {
            setStatusState(verificationSuccessMessage)
        } else {
            setStatusState(verificationFailedMessage)
        }
    }

    useEffect(() => {
        if (codeToVerify) {
            const verificationPayload: IVerificationParams = {
                code: codeToVerify,
            }
            socket.on(Events.standard.socket.connectError, () => {
                setStatusState(connectionFailedMessage)
            })
            socket.on(Events.standard.socket.connect, () => {
                socket.emit(Events.client.auth.verify.voterIntegrity, verificationPayload, integrityVerifiedEvent)
            })
            socket.connect()
        } else {
            setStatusState(verificationCodeMissingMessage)
        }
    }, [])

    return (
        <CenterView>
            <Layout className="small-container">
                <VoterHeader slogan="Anovote" />
                <Content className="voter-election-layout-content">
                    <VoterContent>
                        <IconMessage
                            label={statusState.label}
                            alertLevel={statusState.alertLevel}
                            alertMessage={statusState.alertMessage}
                            icon={statusState.icon}
                        />
                    </VoterContent>
                </Content>
                <VoterFooter />
            </Layout>
        </CenterView>
    )
}
