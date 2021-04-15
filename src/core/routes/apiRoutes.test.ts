import { apiRoutes } from './apiRoutes'

it('should start routes with forward slash', () => {
    const adminRoute = apiRoutes.admin.get
    const voterRoute = apiRoutes.voter.get
    const publicRoute = apiRoutes.public.get

    expect(adminRoute[0]).toBe('/')
    expect(voterRoute[0]).toBe('/')
    expect(publicRoute[0]).toBe('/')
})
