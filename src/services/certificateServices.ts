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

const updateCertsStatus = (data: any, callback: (response: Response) => void) => {
    const encryptedData = encryptData(data);
    
    API({
      method: "POST",
      url: `${APP_URL}/api/update-cert-status`,
      data: { data: encryptedData },
    })
      .then((response) => {
        callback({ status: "SUCCESS", data: response.data });
      })
      .catch((error) => {
        callback({ status: "ERROR", error: error });
      });
  }

const renewCert = (data: any, callback: (response: Response) => void) => {
    const encryptedData = encryptData(data);
    
    API({
      method: "POST",
      url: `${ADMIN_API_URL}/api/renew-cert`,
      data: { data: encryptedData },
      // data: data,
    })
      .then((response) => {
        callback({ status: "SUCCESS", data: response.data });
      })
      .catch((error) => {
        callback({ status: "ERROR", error: error });
      });
  }

  const uploadCertificate = (data: any, callback: (response: Response) => void) => {
    const encryptedData = encryptData(data);
    
    API({
      method: "POST",
      url: `${APP_URL}/api/upload-certificate`,
      data: { data: encryptedData },
    })
      .then((response) => {
        callback({ status: "SUCCESS", data: response.data });
      })
      .catch((error) => {
        callback({ status: "ERROR", error: error });
      });
  }

  const batchCertificates = (data: any, callback: (response: Response) => void) => {
    const encryptedData = encryptData(data);
    
    API({
      method: "POST",
      url: `${APP_URL}/api/get-batch-certificates`,
      data: { data: encryptedData },
    })
      .then((response) => {
        callback({ status: "SUCCESS", data: response.data });
      })
      .catch((error) => {
        callback({ status: "ERROR", error: error });
      });
  }

  const batchCertificateIssue = (data: any, callback: (response: Response) => void) => {
    // const encryptedData = encryptData(data);
    
    API({
      method: "POST",
      url: `${ADMIN_API_URL}/api/batch-certificate-issue`,
      // data: { data: encryptedData },
      data: data,
    })
      .then((response) => {
        callback({ status: "SUCCESS", data: response.data });
      })
      .catch((error) => {
        callback({ status: "ERROR", error: error });
      });
  }

  const apiuploadCertificate = (data: any, callback: (response: Response) => void) => {
    // const encryptedData = encryptData(data);
    
    API({
      method: "POST",
      url: `${ADMIN_API_URL}/api/upload-certificate`,
      data: data,
      // data: { data: encryptedData },
    })
      .then((response) => {
        callback({ status: "SUCCESS", data: response.data });
      })
      .catch((error) => {
        callback({ status: "ERROR", error: error });
      });
  }

  const getSingleCertificates = (data: any, callback: (response: Response) => void) => {
    const encryptedData = encryptData(data);
    
    API({
      method: "POST",
      url: `${ADMIN_API_URL}/api/get-single-certificates`,
      data: { data: encryptedData },
    })
      .then((response) => {
        callback({ status: "SUCCESS", data: response.data });
      })
      .catch((error) => {
        callback({ status: "ERROR", error: error });
      });
  }
  
  const getBatchCertificateDates = (data: any, callback: (response: Response) => void) => {
    const encryptedData = encryptData(data);
    
    API({
      method: "POST",
      url: `${ADMIN_API_URL}/api/get-batch-certificate-dates`,
      data: { data: encryptedData },
    })
      .then((response) => {
        callback({ status: "SUCCESS", data: response.data });
      })
      .catch((error) => {
        callback({ status: "ERROR", error: error });
      });
  }

  const getCertificatesTemplates = (data: any, callback: (response: Response) => void) => {
    const encryptedData = encryptData(data);
    
    API({
      method: "POST",
      url: `${BASE_URL}/api/get-certificate-templates`,
      data: data,
    })
      .then((response) => {
        callback({ status: "SUCCESS", data: response.data });
      })
      .catch((error) => {
        callback({ status: "ERROR", error: error });
      });
    }
  


const certificate = {
    updateCertsStatus,
    renewCert,
    uploadCertificate,
    batchCertificates,
    batchCertificateIssue,
    apiuploadCertificate,
    getSingleCertificates,
    getBatchCertificateDates,
    getCertificatesTemplates
}

export default certificate;