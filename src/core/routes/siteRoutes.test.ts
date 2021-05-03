import { getBaseRoute } from './siteRoutes'

it('should return admin base route to be a string with correct pattern', () => {
    expect(getBaseRoute().admin).toBe('/admin/')
})

it('should return voter base route to be a string with correct pattern', () => {
    expect(getBaseRoute().voter).toBe('/voter/')
})

it('should return public base route to be a string with correct pattern', () => {
    expect(getBaseRoute().public).toBe('/')
})
