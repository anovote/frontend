interface IAdminRoutes {
    myElections: string
}

const adminRoutePrefix = '/admin/'
export const getAdminRoute = (): IAdminRoutes => {
    return {
        myElections: `${adminRoutePrefix}elections`,
    }
}

interface IVoterRoutes {
    joinElection: string
}
const voterRoutePrefix = '/'
export const getVoterRoute = (): IVoterRoutes => {
    return {
        joinElection: `${voterRoutePrefix}join`,
    }
}
