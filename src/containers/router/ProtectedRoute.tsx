import React, { ReactElement } from 'react'
import { Redirect, Route, RouteProps } from 'react-router-dom'
import { AuthLevel } from '../../core/state/app/appState'

interface IPrivateRouteProps extends RouteProps {
    /**
     * Contains all levels that is allowed to access this route.
     */
    allowedLevels: Array<AuthLevel>
    /**
     * the auth level the current user has
     */
    authLevel: AuthLevel
    /**
     * flag for the currently loggedin user. Should be true
     * if logged in, else false.
     */
    isLoggedIn: boolean
}

/**
 * Component to protect a route. The protected route requires that the user is logged in, and
 * meets the passed levels for the route. If not logged in the user is redirected to login page.
 * If logged in in but not meets the requirements, we route back to origin.
 * @param props route props
 */
export const ProtectedRoute = (props: IPrivateRouteProps): ReactElement | null => {
    const { component: Component, children, isLoggedIn, authLevel, ...rest } = props
    const hasLevel = props.allowedLevels.some((level) => level === authLevel)
    const canRoute = hasLevel && isLoggedIn

    return (
        <Route
            {...rest}
            render={(routeProps) => {
                if (canRoute) {
                    return Component ? <Component {...routeProps} /> : children
                } else if (isLoggedIn) {
                    // TODO ! Make a prettier component
                    return <div>You dont have access</div>
                } else {
                    return (
                        <Redirect
                            to={{
                                pathname: '/login',
                                state: { from: routeProps.location },
                            }}
                        />
                    )
                }
            }}
        />
    )
}
