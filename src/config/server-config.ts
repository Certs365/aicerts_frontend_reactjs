// Define a configuration object for the server
export const serverConfig = {
    // Retrieve the app server URL from the environment variable NEXT_PUBLIC_BASE_URL
    appServerUrl: process.env.NEXT_PUBLIC_BASE_URL,
    appUserUrl: process.env.NEXT_PUBLIC_BASE_URL_USER,
    appApiUrl: process.env.NEXT_PUBLIC_BASE_URL_admin
}