import React from 'react'
import { Route, Switch } from 'react-router-dom'
import NotFound from '../components/routeDefaults/NotFound'
import { ProtectedRoute } from '../containers/router/ProtectedRoute'
import { AuthLevel } from '../core/service/authentication/AuthLevel'
import { useAppState } from '../core/state/app/AppStateContext'
import CreateElectionView from './election/createElection'
import Room from './election/room'
import Home from './home'
import LoginView from './login'
import RegisterView from './register'

/**
 * Router view
 * sets up routes for the application.
 * @returns router view for application
 */
export default function RouterView(): React.ReactElement {
    const { isLoggedIn, authLevel } = useAppState()

    return (
        <Switch>
            <Route exact path="/">
                <Home />
            </Route>
            <Route path="/register">
                <RegisterView />
            </Route>
            <Route path="/login">
                <LoginView />
            </Route>
            <Route path="/room">
                <Room />
            </Route>
            <Route path="/create-election">
                <CreateElectionView />
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
    )
}
