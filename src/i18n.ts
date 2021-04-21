import i18n from 'i18next'
import Backend from 'i18next-http-backend'
import { initReactI18next } from 'react-i18next'

i18n.use(Backend)

i18n.use(initReactI18next) // passes i18n down to react-i18next
i18n.init({
    backend: {
        // for all available options read the backend repository readme file

        // path to load namespaces from
        loadPath: '/locales/{{lng}}/{{ns}}.json',

        // path to post missing resources, or a function
        // does not work in development mode
        addPath: '/locales/add/{{lng}}/{{ns}}.json',
    },
    // for debugging, easy to see keys not loaded in console
    debug: false,

    lng: 'en',

    // does not work in dev mode
    //saveMissing: true,
    saveMissingTo: 'current',
    // Returns Missing key: string if a key is missing.
    parseMissingKeyHandler: (k) => {
        return `Missing key: ${k}`
    },

    //keySeparator: false, // we do not use keys in form messages.welcome
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
})

export default i18n
