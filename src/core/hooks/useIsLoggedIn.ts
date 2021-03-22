import { BackendAPI } from 'core/api'
import { AuthenticationService } from 'core/service/authentication/AuthenticationService'
import { LocalStorageService } from 'core/service/storage/LocalStorageService'
import { useEffect, useState } from 'react'

export const useIsLoggedIn = (): [boolean] => {
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    useEffect(() => {
        setIsLoggedIn(new AuthenticationService(BackendAPI, new LocalStorageService()).tryLoginWithToken())
    }, [isLoggedIn])

    return [isLoggedIn]
}
