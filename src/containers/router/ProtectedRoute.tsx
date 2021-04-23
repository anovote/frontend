import { getBaseRoute } from 'core/routes/siteRoutes'
import React, { ReactElement, ReactNode } from 'react'
import { Redirect, Route, RouteComponentProps, RouteProps } from 'react-router-dom'
import { AuthLevel } from '../../core/service/authentication/AuthLevel'
/**
 * Inspiration for protected route component
 * https://stackoverflow.com/questions/47747754/how-to-rewrite-the-protected-private-route-using-typescript-and-react-router-4-a
 */
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
     * flag for the currently logged in user. Should be true
     * if logged in, else false.
     */
    isLoggedIn: boolean
}

/**
 * Component to protect a route. The protected route requires that the user is logged in, and
 * meets the passed levels for the route. If not logged in the user is redirected to login page.
 * If logged in in but not meets the requirements, we display an error component.
 * @param props route props
 */
export const ProtectedRoute = (props: IPrivateRouteProps): ReactElement | null => {
    const { component: Component, children, isLoggedIn, authLevel, path, ...rest } = props
    const hasLevel = props.allowedLevels.some((level) => level === authLevel)
    const canRoute = hasLevel && isLoggedIn

    /**
     * Determines the render component to use for the route based on authentication permissions and
     * if is authenticated.
     * If the user is not authenticated, redirect them to login. If they are authenticated, but lack
     * the right permissions, block the route.
     * If they are logged in, and have access proceed with the route
     * @param routeProps props for the route we are going to
     */
    function getRenderComponent(routeProps: RouteComponentProps) {
        let renderComponent: ReactElement | ReactNode | null | undefined
        let redirectPath = '/login'

        if (path?.includes(getBaseRoute().admin)) {
            redirectPath = '/login'
        }
        if (path?.includes(getBaseRoute().voter)) {
            redirectPath = '/join'
        }

        renderComponent = <Redirect to={{ pathname: redirectPath, state: { from: routeProps.location } }} />

        if (canRoute) renderComponent = Component ? <Component {...routeProps} /> : children
        else if (isLoggedIn) renderComponent = <div>You don not have access</div>

        return renderComponent
    }

    return <Route {...rest} render={(routeProps) => getRenderComponent(routeProps)} />
}
