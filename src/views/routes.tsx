import React from 'react'
import { Route, Switch } from 'react-router-dom'
import NotFound from '../components/routeDefaults/NotFound'
import { ProtectedRoute } from '../containers/router/ProtectedRoute'
import { AuthLevel } from '../core/state/app/appState'
import { useAppState } from '../core/state/app/AppStateContext'
import ChangePassword from './changePassword/ChangePassword'
import Home from './home'
import LoginView from './login'
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
                <LoginView />
            </Route>
            <Route path="/change-password">
                <ChangePassword />
            </Route>
            <Route path="/login">
                <LoginView />
            </Route>

            <ProtectedRoute
                isLoggedIn={isLoggedIn}
                authLevel={authLevel}
                allowedLevels={[AuthLevel.authorizer]}
                path="/protected"
            >
                (this route is protected)
            </ProtectedRoute>
            <Route>
                <NotFound />
            </Route>
        </Switch>
    )
}
