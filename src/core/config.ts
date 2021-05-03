/**
 * Application wide config
 */

const httpProtocol = process.env.REACT_APP_HTTP_PROTOCOL
const apiUri = process.env.REACT_APP_API_URI
const apiPort = process.env.REACT_APP_API_PORT
const apiPrefix = process.env.REACT_APP_API_PREFIX
const wsUri = process.env.REACT_APP_WS_URI
const wsPort = process.env.REACT_APP_WS_PORT

const config = {
    API_URI: apiUri,
    API_PORT: apiPort,
    API_PREFIX: apiPrefix,
    API_URL: '',
    WS_URL: '',
}
if (process.env.NODE_ENV === 'development') {
    config.API_URL = `${httpProtocol}://${apiUri}:${apiPort}/${apiPrefix}`
    config.WS_URL = `${httpProtocol}://${wsUri}:${wsPort}`
} else if (process.env.NODE_ENV === 'production') {
    config.API_URL = `${httpProtocol}://${apiUri}/${apiPrefix}`
    config.WS_URL = `${httpProtocol}://${wsUri}`
} else if (process.env.NODE_ENV === 'test') {
    config.API_URL = `${httpProtocol}://${apiUri}:${apiPort}/${apiPrefix}`
}

export const AppConfig = {
    ...config,
}
