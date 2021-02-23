import React from 'react'
import { Route, Switch } from 'react-router-dom'
import NotFound from '../components/routeDefaults/NotFound'
import ChangePassword from './changePassword/ChangePassword'
import ElectionsView from './elections'
import Home from './home'
import LoginView from './login'

/**
 * Router view
 * sets up routes for the application.
 * @returns router view for application
 */
export default function RouterView(): React.ReactElement {
    return (
        <div className="is-fullscreen">
            <Switch>
                <Route exact path="/">
                    <Home />
                </Route>
                <Route path="/register">
                    <LoginView />
                </Route>
                <Route path="/change-password">
                    <ChangePassword />
                </Route>
                <Route path="/login">
                    <LoginView />
                </Route>
                <Route path="/elections">
                    <ElectionsView />
                </Route>
                <Route>
                    <NotFound />
                </Route>
            </Switch>
        </div>
    )
}
