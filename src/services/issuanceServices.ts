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


const appIssuersLog = (data: any, callback: (response: Response) => void) => {
    const encryptedData = encryptData(data);
    
    API({
      method: "POST",
      url: `${APP_URL}/api/get-issuers-log`,
      data: { data: encryptedData },
    })
      .then((response) => {
        callback({ status: "SUCCESS", data: response.data });
      })
      .catch((error) => {
        callback({ status: "ERROR", error: error });
      });
  }

  const IssueDynamicCert = (data: any, callback: (response: Response) => void) => {
    const encryptedData = encryptData(data);
    debugger
    API({
      method: "POST",
      url: `${APP_URL}/api/issue-dynamic-cert`,
      data: { data: encryptedData },
      // data: data ,
    })
      .then((response) => {
        callback({ status: "SUCCESS", data: response.data });
        debugger
      })
      .catch((error) => {
        callback({ status: "ERROR", error: error });
      });
  }

  const dynamicBatchIssue = (data: any, callback: (response: Response) => void) => {
    // const encryptedData = encryptData(data);
    API({
      method: "POST",
      url: `${ADMIN_API_URL}/api/dynamic-batch-issue`,
      // data: { data: encryptedData },
      data: data ,
    })
      .then((response) => {
        callback({ status: "SUCCESS", data: response.data });
      })
      .catch((error) => {
        callback({ status: "ERROR", error: error });
      });
  }

  const bulkBatchIssue = (data: any, callback: (response: Response) => void) => {
    const encryptedData = encryptData(data);
    
    API({
      method: "POST",
      url: `${APP_URL}/api/bulk-batch-issue`,
      data: { data: encryptedData },
    })
      .then((response) => {
        callback({ status: "SUCCESS", data: response.data });
      })
      .catch((error) => {
        callback({ status: "ERROR", error: error });
      });
  }

  const issueDynamicPdf = (data: any, callback: (response: Response) => void) => {
    // const encryptedData = encryptData(data);
    
    API({
      method: "POST",
      url: `${ADMIN_API_URL}/api/issue-dynamic-pdf`,
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

  const provideInputs = (data: any, callback: (response: Response) => void) => {
    // const encryptedData = encryptData(data);
    
    API({
      method: "POST",
      url: `${ADMIN_API_URL}/api/provide-inputs`,
      data: data ,
      // data: { data: encryptedData },
    })
      .then((response) => {
        callback({ status: "SUCCESS", data: response.data });
      })
      .catch((error) => {
        callback({ status: "ERROR", error: error });
      });
  }
  
  const adminFilteredIssues = (data: any, callback: (response: Response) => void) => {
    // const encryptedData = encryptData(data);
    
    API({
      method: "POST",
      url: `${APP_URL}/api/admin-filtered-issues`,
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
  
  const filteredIssues = (data: any, callback: (response: Response) => void) => {
    const encryptedData = encryptData(data);
    
    API({
      method: "POST",
      url: `${APP_URL}/api/get-filtered-issues`,
      data: { data: encryptedData },
    })
      .then((response) => {
        callback({ status: "SUCCESS", data: response.data });
      })
      .catch((error) => {
        callback({ status: "ERROR", error: error });
      });
  }
  
  const getbulkFiles = (data: any, callback: (response: Response) => void) => {
    const encryptedData = encryptData(data);
    
    API({
      method: "POST",
      url: `${APP_URL}/api/get-bulk-files`,
      data: { data: encryptedData },
    })
      .then((response) => {
        callback({ status: "SUCCESS", data: response.data });
      })
      .catch((error) => {
        callback({ status: "ERROR", error: error });
      });
  }
  
  const getIssue = (data: any, callback: (response: Response) => void) => {
    const encryptedData = encryptData(data);
    
    API({
      method: "POST",
      url: `${APP_URL}/api/get-issue`,
      data: { data: encryptedData },
    })
      .then((response) => {
        callback({ status: "SUCCESS", data: response.data });
      })
      .catch((error) => {
        callback({ status: "ERROR", error: error });
      });
  }

  const issue = (data: any, callback: (response: Response) => void) => {
    // const encryptedData = encryptData(data);
    // const url = isDesign?"api/issue-dynamic-cert" : "api/issue"
    API({
      method: "POST",
      url: `${ADMIN_API_URL}/api/issue`,
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

  const issueDynamicWithPdf = (data: any, callback: (response: Response) => void) => {
    // const encryptedData = encryptData(data);
    
    API({
      method: "POST",
      url: `${ADMIN_API_URL}/api/issue-dynamic-cert`,
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
  
  const issuePdf = (data: any, callback: (response: Response) => void) => {
    // const encryptedData = encryptData(data);
    
    API({
      method: "POST",
      url: `${ADMIN_API_URL}/api/issue-pdf`,
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



const issuance = {
    appIssuersLog,
    dynamicBatchIssue,
    IssueDynamicCert,
    bulkBatchIssue,
    issueDynamicPdf,
    provideInputs,
    adminFilteredIssues,
    filteredIssues,
    getbulkFiles,
    getIssue,
    issue,
    issuePdf,
    issueDynamicWithPdf
}

export default issuance;