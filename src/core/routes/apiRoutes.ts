/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export const apiRoute = {
    authentication: '/public/auth/login',
    createElection: '/admin/elections', //
    getElection: '/admin/elections/', //
    electionOrganizer: '/admin/electionOrganizer', //
    registration: '/public/auth/register',
    ballots: '/ballots', //
    joinElection: '/join',
}

/**
 * Creates a path string, and returns an append function
 * that returns a new path creator object and a get function to get the current path.
 * Forward slash is prefixed on create and when appending
 * @param part part to start with
 * @param preSlash prepend path with slash
 * @returns return append function or getter for current path
 */
function createPath(part: string, preSlash = true) {
    const path = `${preSlash ? '/' : ''}${part}`

    // Returns the current path
    function get() {
        return path
    }
    // Appends a new part to the current path and returns a new new path object
    function append(addPart: string | number) {
        return createPath(`${path}/${addPart}`, false)
    }

    return {
        append,
        get,
    }
}
/**
 * Admin routes
 */
const adminPrefix = 'admin'
const adminRoute = () => {
    const path = createPath(`${adminPrefix}`)
    return {
        get: path.get(),
        election: () => {
            const electionPath = path.append('elections')
            return {
                create: electionPath.get(),
                byId: (id: number) => {
                    const electionIdPath = electionPath.append(`${id}`)
                    return {
                        get: electionIdPath.get(),
                        update: electionIdPath.get(),
                        ballots: () => {
                            const ballotsPath = electionIdPath.append('ballots')
                            return {
                                get: ballotsPath.get(),
                            }
                        },
                    }
                },
            }
        },
        organizer: () => {
            const organizerPath = path.append('electionOrganizer')
            return {
                changePassword: organizerPath.append('changePassword').get(),
            }
        },
    }
}
/**
 * Voter routes
 */
const voterPrefix = 'voter'
const voterRoute = () => {
    const path = createPath(voterPrefix)
    return {
        get: path.get(),
        election: () => {
            const electionPath = path.append('elections')
            return {
                byId: (id: number) => {
                    const electionIdPath = electionPath.append(id)
                    return {
                        get: electionIdPath.get(),
                    }
                },
            }
        },
    }
}

/**
 * Public routes
 */
const publicPrefix = 'public'
const publicRoute = () => {
    const path = createPath(publicPrefix)
    return {
        get: path.get(),
        auth: () => {
            const authPath = path.append('auth')
            return {
                register: authPath.append('register').get(),
                login: authPath.append('login').get(),
            }
        },
    }
}

export const apiRoutes = {
    admin: adminRoute(),
    voter: voterRoute(),
    public: publicRoute(),
}
