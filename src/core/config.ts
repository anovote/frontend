/**
 * Application wide config
 */
export const AppConfig = {
    API_URI: process.env.REACT_APP_API,
    API_PORT: process.env.REACT_APP_API_PORT,
    WS_URI: 'ws://' + process.env.REACT_APP_WS_URL + ':' + process.env.REACT_APP_WS_PORT,
}
