import React from 'react'
import { Route, Switch } from 'react-router-dom'
import NotFound from '../components/routeDefaults/NotFound'
import { ProtectedRoute } from '../containers/router/ProtectedRoute'
import { AuthLevel } from '../core/service/authentication/AuthLevel'
import { useAppState } from '../core/state/app/AppStateContext'
import Home from './home'
import LoginView from './login'
import RegisterView from './register'
import AdminRoutes from 'core/routes/AdminRoutes'
import VoterRoutes from 'core/routes/VoterRoutes'
import { getBaseRoute, getPublicRoute } from 'core/routes/siteRoutes'

/**
 * Router view
 * sets up routes for the application.
 * @returns router view for application
 */
export default function RouterView(): React.ReactElement {
    const { isLoggedIn, authLevel } = useAppState()

    return (
        <>
            <Switch>
                <Route exact path={getPublicRoute().landing}>
                    <Home />
                </Route>
                <Route path={getPublicRoute().register}>
                    <RegisterView />
                </Route>
                <Route path={getPublicRoute().login}>
                    <LoginView />
                </Route>
                <ProtectedRoute
                    // Added as example
                    isLoggedIn={isLoggedIn}
                    authLevel={authLevel}
                    allowedLevels={[AuthLevel.organizer]}
                    path={getBaseRoute().admin}
                >
                    <AdminRoutes />
                </ProtectedRoute>
                <ProtectedRoute
                    isLoggedIn={isLoggedIn}
                    authLevel={authLevel}
                    allowedLevels={[AuthLevel.voter]}
                    path={getBaseRoute().voter}
                >
                    <VoterRoutes />
                </ProtectedRoute>
                <Route>
                    <NotFound />
                </Route>
            </Switch>
        </>
    )
}
