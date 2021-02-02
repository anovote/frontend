import axios from 'axios'
import { AppConfig } from './config'

const JSON_MIME = 'application/json'

/**
 * Backend API HTTP client
 * Accepts JSON as default
 */
export const BackendAPI = axios.create({
    baseURL: `${AppConfig.API_URI}:${AppConfig.API_PORT}`,
    headers: { Accept: JSON_MIME },
})

// Other Endpoints handlers can be defined here
