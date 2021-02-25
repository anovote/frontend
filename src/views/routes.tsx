import React from 'react'
import { Route, Switch } from 'react-router-dom'
import NotFound from '../components/routeDefaults/NotFound'
import { ProtectedRoute } from '../containers/router/ProtectedRoute'
import { AuthLevel } from '../core/service/authentication/AuthLevel'
import { useAppState } from '../core/state/app/AppStateContext'
import ElectionsView from './elections'
import Home from './home'
import LoginView from './login'

import ElectionView from './election/election'

/**
 * Router view
 * sets up routes for the application.
 * @returns router view for application
 */
export default function RouterView(): React.ReactElement {
    const { isLoggedIn, authLevel } = useAppState()

    return (
        <div className="is-fullscreen">
            <Switch>
                <Route exact path="/">
                    <Home />
                </Route>
                <Route path="/register">
                    <LoginView />
                </Route>
                <Route path="/login">
                    <LoginView />
                </Route>
                <Route path="/elections">
                    <ElectionsView />
                </Route>
                <Route path="/election/:id">
                    <ElectionView />
                </Route>

                <ProtectedRoute
                    // Added as example
                    isLoggedIn={isLoggedIn}
                    authLevel={authLevel}
                    allowedLevels={[AuthLevel.authorizer]}
                    path="/protected"
                >
                    this route is protected
                </ProtectedRoute>
                <Route>
                    <NotFound />
                </Route>
            </Switch>
        </div>
    )
}
