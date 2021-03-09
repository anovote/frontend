import Skeleton from 'components/Skeleton'
import React, { ReactElement } from 'react'
import { Route } from 'react-router-dom'
import CreateElectionView from 'views/election/createElection'
import ElectionView from 'views/election/election'
import ElectionsView from 'views/elections'
import { getAdminRoute } from './siteRoutes'

export default function AdminRoutes(): ReactElement {
    const adminRoute = getAdminRoute()

    return (
        <Skeleton
            content={
                <div className="is-fullscreen">
                    <Route path={adminRoute.elections.view}>
                        <ElectionsView />
                    </Route>
                    <Route path={adminRoute.elections.viewId}>
                        <ElectionView />
                    </Route>
                    <Route path={adminRoute.elections.create}>
                        <CreateElectionView />
                    </Route>
                </div>
            }
        />
    )
}