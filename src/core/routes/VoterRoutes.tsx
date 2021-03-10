import React, { ReactElement } from 'react'
import { Route } from 'react-router'
import VoterElectionView from 'views/voter/election'
import { getVoterRoute } from './siteRoutes'

export default function VoterRoutes(): ReactElement {
    return (
        <>
            <Route path={getVoterRoute().election}>
                <VoterElectionView />
            </Route>
        </>
    )
}
