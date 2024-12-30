import API from "./index";
import { serverConfig } from "../config/server-config";
import { encryptData } from "@/utils/reusableFunctions";
import { getTokenFromLocalStorage } from "./getToken";

// Define the expected response structure for the registration API call
interface Response {
    status: "SUCCESS" | "ERROR";
    data?: any;
    error?: any;
    message?: any;
}

// Set the base URL for the app server using the configuration
const APP_URL = serverConfig.appServerUrl;
const BASE_URL = serverConfig.appUserUrl;
const ADMIN_API_URL = serverConfig.appApiUrl;

// Define the encryption key from the environment variable
const secretKey = process.env.NEXT_PUBLIC_BASE_ENCRYPTION_KEY;

/**
 * Function to encrypt the payload data
 * @param data - The data to encrypt
 * @param key - The secret key used for encryption
 * @returns Encrypted data as a string
 */

const addEnterpriseSubscription = async (data: any, callback: (response: any) => void) => {

    const token = getTokenFromLocalStorage();
    const response = await fetch(`${ADMIN_API_URL}/api/add-enterprise-subscription-plan`, {
        method: 'POST',
        body: data,
        headers: {
            'Authorization': `Bearer ${token}`,
            // 'Content-Type': 'application/json',
        },
    });
    console.log("from fetch call", response)
    callback(response);
}



const subscription = {
    addEnterpriseSubscription
}

export default subscription;