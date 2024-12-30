import API from "./index";
import { serverConfig } from "../config/server-config";
// import { encryptData } from "@/utils/reusableFunctions";

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

const graphData = (data: any, callback: (response: Response) => void) => {
    const selectedYear = data.selectedYear;
    const encodedEmail = data.encodedEmail;
    
    API({
      method: "GET",
      url: `${APP_URL}/api/get-graph-data/${selectedYear}/${encodedEmail}`,
    })
      .then((response:any) => {
        callback({ status: "SUCCESS", data: response.data });
      })
      .catch((error:any) => {
        callback({ status: "ERROR", error: error });
      });
  }

const getStatusGraph = (data: any, callback: (response: Response) => void) => {
    const month = data.month;
    const encodedEmail = decodeURIComponent(data.encodedEmail);
    API({
      method: "GET",
      url: `${APP_URL}/api/get-status-graph-data/${month}/${encodedEmail}`,
    })
      .then((response:any) => {
        callback({ status: "SUCCESS", data: response.data });
      })
      .catch((error:any) => {
        callback({ status: "ERROR", error: error });
      });
  }

  

const chart = {
    graphData,
    getStatusGraph

}

export default chart;