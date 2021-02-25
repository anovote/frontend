interface IAdminRoutes {
    myElections: string
}

const adminRoutePrefix = '/admin/'
export const getAdminRoute = (): IAdminRoutes => {
    return {
        myElections: `${adminRoutePrefix}elections`,
    }
}

interface IPublicRoutes {
    joinElection: string
}
const publicRoutePrefix = '/'
export const getPublicRoute = (): IPublicRoutes => {
    return {
        joinElection: `${publicRoutePrefix}join`,
    }
}
