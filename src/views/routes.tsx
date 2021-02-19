import React from 'react'
import { Route, Switch } from 'react-router-dom'
import NotFound from '../components/routeDefaults/NotFound'
import ChangePassword from './changePassword/ChangePassword'
import Home from './home'
import LoginView from './login'
import CreateElectionView from './election/createElection'
import RegisterView from './register'

/**
 * Router view
 * sets up routes for the application.
 * @returns router view for application
 */
export default function RouterView(): React.ReactElement {
    return (
        <Switch>
            <Route exact path="/">
                <Home />
            </Route>
            <Route path="/register">
                <RegisterView />
            </Route>
            <Route path="/change-password">
                <ChangePassword />
            </Route>
            <Route path="/login">
                <LoginView />
            </Route>
            <Route path="/election/createElection">
                <CreateElectionView />
            </Route>
            <Route>
                <NotFound />
            </Route>
        </Switch>
    )
}
