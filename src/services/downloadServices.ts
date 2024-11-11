import API from "./index";
import { serverConfig } from "../config/server-config";
import { encryptData } from "@/utils/reusableFunctions";

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


/**
 * Function to register a user
 * @param data - The data to be sent in the registration request
 * @param callback - Callback function to handle the registration response
 */

const downloadImage = (data: any, callback: (response: Response) => void) => {
    const encryptedData = encryptData(data);
    
    API({
      method: "POST",
      url: `${APP_URL}/api/downloadImage`,
      data: { data: encryptedData },
    })
      .then((response) => {
        callback({ status: "SUCCESS", data: response.data });
      })
      .catch((error) => {
        callback({ status: "ERROR", error: error });
      });
  }

  const apidownloadImage = (data: any, callback: (response: Response) => void) => {
    const encryptedData = encryptData(data);
    
    API({
      method: "POST",
      url: `${ADMIN_API_URL}/api/downloadImage`,
      data: { data: encryptedData },
    })
      .then((response) => {
        debugger
        callback({ status: "SUCCESS", data: response.data });
      })
      .catch((error) => {
        callback({ status: "ERROR", error: error });
      });
  }

  const imageAvailability = (data: any, callback: (response: Response) => void) => {
    const url = data;
    API({
      method: "GET",
      url: url,
    })
      .then((response) => {
        callback({ status: "SUCCESS", data: response.data });
      })
      .catch((error) => {
        callback({ status: "ERROR", error: error });
      });
  }

const download = {
    downloadImage,
    apidownloadImage
}

export default download;