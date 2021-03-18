import Title from 'antd/lib/typography/Title'
import BallotsQueue from 'components/queue/BallotsQueue'
import BallotModal from 'containers/modal/BallotModal'
import { IBallotEntity } from 'core/models/ballot/IBallotEntity'
import { IElectionDetails } from 'core/service/election/IElectionDetails'
import { useSocket } from 'core/state/websocket/useSocketHook'
import { ballotInstance } from 'dummy/ballotEntity'
import { voteStats } from 'dummy/ballotVoteStats'
import React, { ReactElement, useEffect, useState } from 'react'

export function ElectionInProgressView({ election }: { election: IElectionDetails }): ReactElement {
    const [socket] = useSocket()
    const [stats, setStats] = useState(voteStats)

    useEffect(() => {
        socket.connect()

        socket.on('connection', () => {
            console.log(socket.id)
        })
        return () => {
            socket.disconnect()
        }
    }, [socket])

    const ballots = election.ballots
        ? election.ballots.map((ballot, index) => ({ id: index, ...ballot } as IBallotEntity))
        : new Array<IBallotEntity>()

    return (
        <>
            <Title level={1}>{election.title}</Title>
            <BallotsQueue dataSource={ballots} />
            <BallotModal
                showModal={true}
                ballotEntity={ballotInstance}
                ballotStats={stats}
                close={() => console.log('close clicked')}
                controls={{
                    next: () => {
                        console.log('next clicked')
                    },
                    previous: () => {
                        console.log('previous clicked')
                    },
                }}
            />
        </>
    )
}
