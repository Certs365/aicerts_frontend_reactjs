import API from "./index";
import { serverConfig } from "../config/server-config";
import { encryptData } from "@/utils/reusableFunctions";
import { getTokenFromLocalStorage } from '../services/getToken';
// Define the expected response structure for the registration API call
interface Response {
  status: "SUCCESS" | "ERROR";
  data?: any;
  error?: any;
  message?: any;
}

// Set the base URL for the app server using the configuration
const APP_URL = serverConfig.appServerUrl;
const APP_URL_TS = serverConfig.appServerUrlts;
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
    method: "GET",
    url: `${APP_URL_TS}/api/get-issuers-log/${data?.email}`,
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

  API({
    method: "POST",
    url: `${APP_URL}/api/issue-dynamic-cert`,
    data: { data: encryptedData },
    // data: data ,
  })
    .then((response) => {
      callback({ status: "SUCCESS", data: response.data });

    })
    .catch((error) => {
      callback({ status: "ERROR", error: error });
    });
}

const IssueDynamicCertByFetch = async (data: any, callback: (response: any) => void) => {

  const token = getTokenFromLocalStorage();
  const response = await fetch(`${ADMIN_API_URL}/api/issue-dynamic-cert`, {
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

const dynamicBatchIssue = async (data: any, callback: (response: any) => void) => {
  // const encryptedData = encryptData(data);
  // API({
  //   method: "POST",
  //   url: `${ADMIN_API_URL}/api/dynamic-batch-issue`,
  //   // data: { data: encryptedData },
  //   data: data ,
  // })
  //   .then((response) => {
  //     callback({ status: "SUCCESS", data: response.data });
  //   })
  //   .catch((error) => {
  //     callback({ status: "ERROR", error: error });
  //   });
  const token = getTokenFromLocalStorage();
  const response = await fetch(`${ADMIN_API_URL}/api/dynamic-batch-issue`, {
    method: 'POST',
    body: data,
    headers: {
      'Authorization': `Bearer ${token}`,
      // 'Content-Type': 'application/json',
    },
  });
  callback(response);
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

const issueDynamicPdf = async (data: any, callback: (response: any) => void) => {
  // const encryptedData = encryptData(data);

  // API({
  //   method: "POST",
  //   url: `${ADMIN_API_URL}/api/issue-dynamic-pdf`,
  //   data: data,
  //   // data: { data: encryptedData },
  // })
  //   .then((response) => {
  //     callback({ status: "SUCCESS", data: response.data });
  //   })
  //   .catch((error) => {
  //     callback({ status: "ERROR", error: error });
  //   });
  const token = getTokenFromLocalStorage();
  const response = await fetch(`${ADMIN_API_URL}/api/issue-dynamic-pdf`, {
    method: 'POST',
    body: data,
    headers: {
      'Authorization': `Bearer ${token}`,
      // 'Content-Type': 'application/json',
    },
  });
  callback(response);
}

const provideInputs = (data: any, callback: (response: Response) => void) => {
  // const encryptedData = encryptData(data);

  API({
    method: "POST",
    url: `${ADMIN_API_URL}/api/provide-inputs`,
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
      callback({ status: "ERROR", data: error?.response?.data });
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

const issuePdf = async (data: any, callback: (response: Response) => void) => {

  try {
    // Fetch token from localStorage
    const localStorageData = JSON.parse(localStorage?.getItem("user") || "{}");
    const token = localStorageData?.JWTToken;

    // Prepare headers
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    // Perform the fetch request
    fetch(`${ADMIN_API_URL}/api/issue-pdf/`, {
      method: 'POST',
      body: data,  // Assuming `data` is your FormData
      headers: headers,
    })
      .then(response => {

        if (response.ok) {
          // If successful, send the response with status "SUCCESS" and parsed data
          // return response.json().then(data => {
          callback({ status: "SUCCESS", data: response });
          // });
        } else {
          // If response is not ok, parse the error message and pass it
          // return response.json().then(errorData => {
          // callback({ status: "ERROR", data: error });
          // });
          console.log("Failed to parse response")
        }
      })
      .catch(error => {
        // Catch fetch-related errors and pass them with status "ERROR"
        callback({ status: "ERROR", error });
      });
  } catch (error) {
    // Handle any other errors and pass them to the callback with status "ERROR"
    callback({ status: "ERROR", error });
  }

  // const encryptedData = encryptData(data);

  //   API({
  //     method: "POST",
  //     url: `${ADMIN_API_URL}/api/issue-pdf`,
  //     // data: { data: encryptedData },
  //     data: data,
  //   })
  //     .then((response) => {
  //        
  //       callback( response.data );
  //     })
  //     .catch((error) => {
  //       callback({ status: "ERROR", error: error });
  //     });

};



const issuance = {
  appIssuersLog,
  dynamicBatchIssue,
  IssueDynamicCert,
  IssueDynamicCertByFetch,
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