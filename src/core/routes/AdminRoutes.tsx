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
                    <Route exact path={adminRoute.elections.view}>
                        <ElectionsView />
                    </Route>
                    <Route exact path={adminRoute.elections.viewId}>
                        <ElectionView />
                    </Route>
                    <Route exact path={adminRoute.elections.create}>
                        <CreateElectionView initialElection={undefined} />
                    </Route>
                </div>
            }
        />
    )
}
