import AdminRoutes from 'core/routes/AdminRoutes'
import { getBaseRoute, getPublicRoute } from 'core/routes/siteRoutes'
import VoterRoutes from 'core/routes/VoterRoutes'
import React from 'react'
import { Route, Switch } from 'react-router-dom'
import NotFound from '../components/routeDefaults/NotFound'
import { ProtectedRoute } from '../containers/router/ProtectedRoute'
import { AuthLevel } from '../core/service/authentication/AuthLevel'
import { useAppState } from '../core/state/app/AppStateContext'
import Home from './home'
import LoginView from './login'
import RegisterView from './register'
import VerifyVoterView from './voter/verify'
import VoterLoginView from './voter/login/VoterLoginView'
import About from './home/About'

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
                <Route path={getPublicRoute().about}>
                    <About />
                </Route>
                <Route path={getPublicRoute().register}>
                    <RegisterView />
                </Route>
                <Route path={getPublicRoute().login}>
                    <LoginView />
                </Route>
                <Route path={getPublicRoute().verifyVoter}>
                    <VerifyVoterView />
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
                <Route path={getPublicRoute().joinElection}>
                    <VoterLoginView />
                </Route>
                <Route>
                    <NotFound />
                </Route>
            </Switch>
        </>
    )
}
