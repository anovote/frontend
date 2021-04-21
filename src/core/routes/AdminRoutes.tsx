import Skeleton from 'components/Skeleton'
import React, { ReactElement } from 'react'
import { Redirect, Route } from 'react-router-dom'
import CreateElectionView from 'views/election/createElection'
import ElectionView from 'views/election/election'
import ElectionResultView from 'views/election/results'
import ElectionsView from 'views/elections'
import { getAdminRoute, getBaseRoute } from './siteRoutes'

export default function AdminRoutes(): ReactElement {
    const adminRoute = getAdminRoute()

    return (
        <Skeleton
            content={
                <div className="skeleton-admin">
                    <Route exact path={getBaseRoute().admin}>
                        <Redirect to={adminRoute.elections.view} />
                    </Route>
                    <Route exact path={adminRoute.elections.view}>
                        <ElectionsView />
                    </Route>
                    <Route exact path={adminRoute.elections.viewId}>
                        <ElectionView />
                    </Route>
                    <Route exact path={adminRoute.elections.result}>
                        <ElectionResultView />
                    </Route>
                    <Route exact path={adminRoute.elections.create}>
                        <CreateElectionView initialElection={undefined} />
                    </Route>
                </div>
            }
        />
    )
}
