import Title from 'antd/lib/typography/Title'
import BallotsQueue from 'components/queue/BallotsQueue'
import BallotModal from 'containers/modal/BallotModal'
import { useSocket } from 'core/hooks/useSocket'
import { BallotEntity } from 'core/models/ballot/BallotEntity'
import { IBallotEntity } from 'core/models/ballot/IBallotEntity'
import { IElection } from 'core/models/election/IElection'
import { voteStats } from 'dummy/ballotVoteStats'
import React, { ReactElement, useEffect, useState } from 'react'

export function ElectionInProgressView({ election }: { election: IElection }): ReactElement {
    const [socket] = useSocket()
    const [modal, setModal] = useState(false)
    const [active, setActive] = useState(0)

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

    const showModal = (id: number) => {
        setModal(true)
        console.log(id)
        setActive(id)
    }

    const closeModal = () => {
        setModal(false)
    }

    const hasNext = () => {
        if (ballots[active + 1]) {
            setActive(active + 1)
        }
    }

    const hasPrevious = () => {
        if (ballots[active - 1]) {
            setActive(active - 1)
        }
    }

    return (
        <>
            <Title level={1}>{election.title}</Title>
            <BallotsQueue dataSource={ballots} stats={voteStats} expandBallot={showModal} />
            <BallotModal
                showModal={modal}
                ballotEntity={new BallotEntity(ballots[active])}
                ballotStats={voteStats[active]}
                close={closeModal}
                controls={{
                    next: () => {
                        hasNext()
                    },
                    previous: () => {
                        hasPrevious()
                    },
                }}
            />
        </>
    )
}
