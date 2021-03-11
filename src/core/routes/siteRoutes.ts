interface IBaseRoutes {
    admin: string
    public: string
    voter: string
}
interface IAdminRoutes {
    dashboard: string
    elections: {
        view: string
        viewId: string
        create: string
        inProgress: string
    }
    customize: string
    settings: string
}
interface IPublicRoutes {
    landing: string
    register: string
    login: string
    joinElection: string
}

interface IVoterRoutes {
    room: string
}

const routePrefixes = {
    pub: '/',
    admin: '/admin/',
    voter: '/voter/',
}

export const getBaseRoute = (): IBaseRoutes => {
    const { pub, admin, voter } = routePrefixes
    return {
        admin,
        public: pub,
        voter,
    }
}

export const getAdminRoute = (): IAdminRoutes => {
    const { admin } = routePrefixes
    return {
        dashboard: `${admin}dashboard`,
        elections: {
            view: `${admin}elections`,
            viewId: `${admin}elections/:id`,
            create: `${admin}create-election`,
            inProgress: `${admin}in-progress/:id`,
        },
        customize: `${admin}customize`,
        settings: `${admin}settings`,
    }
}

export const getPublicRoute = (): IPublicRoutes => {
    const { pub } = routePrefixes
    return {
        landing: `${pub}`,
        register: `${pub}register`,
        login: `${pub}login`,
        joinElection: `${pub}join`,
    }
}

export const getVoterRoute = (): IVoterRoutes => {
    const { voter } = routePrefixes
    return {
        room: `${voter}room`,
    }
}
