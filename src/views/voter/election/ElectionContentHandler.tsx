import { CoffeeOutlined, HourglassOutlined, LockOutlined } from '@ant-design/icons'
import BallotDisplayHandler from 'containers/BallotDisplayHandler/BallotDisplayHandler'
import SquareIconContainer from 'components/iconContainer/SquareIconContainer'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { DisplayAction, ElectionState } from './electionReducer'
import { IBallot } from 'core/models/ballot/IBallot'

/**
 * This modules is responsible for providing the correct components for an election based on the state
 * of the election.
 */
export default function ElectionContentHandler({ state }: { state: ElectionState }): ReactElement {
    const [t] = useTranslation(['election', 'common'])
    let renderComponent: ReactElement
    switch (state.displayAction) {
        case DisplayAction.Locked:
            {
                renderComponent = (
                    <SquareIconContainer
                        icon={<LockOutlined className="wobble-animation" />}
                        label={t('election:Election opens', { date: state.election?.openDate?.toLocaleDateString() })}
                    />
                )
            }

            break
        case DisplayAction.Waiting:
            {
                let waitingFor = ''
                if (!state.election) waitingFor = t('common:Election')
                else if (!state.ballot && !state.result) waitingFor = t('common:Ballot')
                else if (state.ballot && !state.result) waitingFor = t('common:Result')

                renderComponent = (
                    <SquareIconContainer
                        icon={<HourglassOutlined className="rotate-animation" />}
                        label={t('election:Waiting for', { what: waitingFor.toLocaleLowerCase() })}
                    />
                )
            }

            break
        case DisplayAction.NotStarted:
            {
                let notStartedLabel = t('election:Election has not started yet')
                if (state.election?.openDate) {
                    notStartedLabel = t('election:Election starts', {
                        date: state.election?.openDate?.toLocaleDateString(),
                    })
                }
                renderComponent = (
                    <SquareIconContainer
                        icon={<CoffeeOutlined className="wobble-animation" />}
                        label={notStartedLabel}
                    />
                )
            }
            break
        case DisplayAction.Ballot:
            {
                renderComponent = <BallotDisplayHandler ballot={state.ballot as IBallot} />
            }
            break
        default:
            renderComponent = <></>
            break
    }
    return renderComponent
}
