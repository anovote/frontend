// TODO Refactor this
export const apiRoute = {
    authentication: '/public/auth/login',
    createElection: '/admin/elections',
    getElection: '/admin/elections/',
    electionOrganizer: '/admin/electionOrganizer',
    registration: '/public/auth/register',
    ballots: '/ballots',
    joinElection: '/join',
}

/**
 * Admin routes
 */
const adminPrefix = 'admin'
const adminRoute = () => {
    function create(path: string) {
        return `/${adminPrefix}/${path}`
    }
    return {
        election: {
            getById: (id: number) => create(`elections/${id}`),
        },
    }
}

/**
 * Voter routes
 */
const voterPrefix = 'voter'
const voterRoute = () => {
    function create(path: string) {
        return `/${voterPrefix}/${path}`
    }
    return {
        elections: {
            getById: (id: number) => create(`elections/${id}`),
        },
    }
}

/**
 * Public routes
 */
const publicPrefix = 'public'
const publicRoute = () => {
    function create(path: string) {
        return `/${publicPrefix}/${path}`
    }
    return {}
}

export const apiRoutes = {
    admin: adminRoute(),
    voter: voterRoute(),
    public: publicRoute(),
}
