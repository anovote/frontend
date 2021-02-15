import { BackendAPI } from '../../api'
import { ElectionOrganizerService } from './ElectionOrganizerService '
test('Check that password matches criteria', async () => {
    const es = new ElectionOrganizerService(BackendAPI)
    let password = 'test123'
    await expect(es.changePassword(password)).resolves.toBe(undefined)
    password = ''
    await expect(es.changePassword(password)).rejects.toThrowError()
})
