import { Divider } from 'antd'
import Layout, { Content } from 'antd/lib/layout/layout'
import CenterView from 'components/centerView/CenterView'
import VoterContent from 'components/voterContent/VoterContent'
import VoterFooter from 'components/voterFooter/VoterFooter'
import VoterHeader from 'components/voterHeader/VoterHeader'
import { useSocket } from 'core/state/websocket/useSocketHook'
import React, { ReactElement, useEffect, useReducer } from 'react'
import ElectionContentHandler from './ElectionContentHandler'
import ElectionInfoHandler from './ElectionInfoHandler'
import { electionReducer, initialElectionState } from './electionReducer'
import { electionSocketEventBinder, electionSocketEventCleanup } from './electionSocketEventBinder'
export default function VoterElectionView(): ReactElement {
    const [electionState, electionDispatch] = useReducer(electionReducer, initialElectionState)
    const [socket] = useSocket()
    useEffect(() => {
        electionSocketEventBinder(socket, electionDispatch)

        return () => {
            electionSocketEventCleanup()
        }
    }, [])
    return (
        <CenterView>
            <Layout className="small-container">
                <VoterHeader slogan="Anovote" />
                <Content className="voter-election-layout-content">
                    <ElectionInfoHandler state={electionState} />
                    <Divider />
                    <VoterContent>
                        <ElectionContentHandler state={electionState} />
                    </VoterContent>
                </Content>
                <VoterFooter />
            </Layout>
        </CenterView>
    )
}
