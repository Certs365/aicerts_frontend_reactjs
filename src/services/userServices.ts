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
const register = (data: any, callback: (response: Response) => void) => {
  const encryptedData = encryptData(data);

  API({
    method: "POST",
    url: `${BASE_URL}/api/signup`,
    data: { data: encryptedData },
  })
    .then((response) => {
      callback({ status: "SUCCESS", data: response.data });
    })
    .catch((error) => {
      callback({ status: "ERROR", error: error });
    });
};

const verifyOtp = (data: any, callback: (response: Response) => void) => {
  const encryptedData = encryptData(data);

  API({
    method: "POST",
    url: `${BASE_URL}/api/verify-issuer`,
    data: { data: encryptedData },
  })
    .then((response) => {
      callback({ status: "SUCCESS", data: response.data });
    })
    .catch((error) => {
      callback({ status: "ERROR", error: error?.response });
    });
};

const sendLink = (data: any, callback: (response: Response) => void) => {
  const encryptedData = encryptData({ email: data });

  API({
    method: "POST",
    url: `${BASE_URL}/api/forgot-password`,
    data: { data: encryptedData },
  })
    .then((response) => {
      callback({ status: "SUCCESS", data: response.data });
    })
    .catch((error) => {
      callback({ status: "ERROR", error: error });
    });
};

const changePassword = (data: any, callback: (response: Response) => void) => {
  const encryptedData = encryptData(data);

  API({
    method: "POST",
    url: `${BASE_URL}/api/reset-password`,
    data: { data: encryptedData },
  })
    .then((response) => {
      callback({ status: "SUCCESS", data: response.data });
    })
    .catch((error) => {
      callback({ status: "ERROR", error: error });
    });
};

const refreshToken = (data: any, callback: (response: Response) => void) => {
  const encryptedData = encryptData({ token: data?.refreshToken, email: data?.email });

  API({
    method: "POST",
    url: `${APP_URL}/api/refresh`,
    data: { data: encryptedData },
  })
    .then((response) => {
      callback({ status: "SUCCESS", data: response.data });
    })
    .catch((error) => {
      callback({ status: "ERROR", error: error });
    });
};

const creditLimit = (data: any, callback: (response: Response) => void) => {
  // const encryptedData = encryptData(data);
  
  API({
    method: "POST",
    url: `${APP_URL}/api/get-credits-by-email`,
    data: data,
  })
    .then((response) => {
      callback({ status: "SUCCESS", data: response.data });
    })
    .catch((error) => {
      callback({ status: "ERROR", error: error });
    });
}

const login = (data: any, callback: (response: Response) => void) => {
  const encryptedData = encryptData(data);
  
  API({
    method: "POST",
    url: `${BASE_URL}/api/login`,
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

const twoFactorAuth = (data: any, callback: (response: Response) => void) => {
  // const encryptedData = encryptData(data);
  
  API({
    method: "POST",
    url: `${APP_URL}/api/two-factor-auth`,
    data: data,
  })
    .then((response) => {
      callback({ status: "SUCCESS", data: response.data });
    })
    .catch((error) => {
      callback({ status: "ERROR", error: error });
    });
}

const verifyIssuer = (data: any, callback: (response: Response) => void) => {
  // const encryptedData = encryptData(data);
  
  API({
    method: "POST",
    url: `${APP_URL}/api/verify-issuer`,
    data: data,
  })
    .then((response) => {
      callback({ status: "SUCCESS", data: response.data });
    })
    .catch((error) => {
      callback({ status: "ERROR", error: error });
    });
}

const loginWithPhone = (data: any, callback: (response: Response) => void) => {
  const encryptedData = encryptData(data);
  
  API({
    method: "POST",
    url: `${APP_URL}/api/login-with-phone`,
    data: { data: encryptedData },
  })
    .then((response) => {
      callback({ status: "SUCCESS", data: response.data });
    })
    .catch((error) => {
      callback({ status: "ERROR", error: error });
    });
}

const createValidateIssuer = (data: any, callback: (response: Response) => void) => {
  const encryptedData = encryptData(data);
  
  API({
    method: "POST",
    url: `${APP_URL}/api/create-validate-issuer`,
    data: { data: encryptedData },
  })
    .then((response) => {
      callback({ status: "SUCCESS", data: response.data });
    })
    .catch((error) => {
      callback({ status: "ERROR", error: error });
    });
}

const getIssuerByEmail = (data: any, callback: (response: Response) => void) => {
  const encryptedData = encryptData(data);
  
  API({
    method: "POST",
    url: `${ADMIN_API_URL}/api/get-issuer-by-email`,
    data: { data: encryptedData },
  })
    .then((response) => {
      callback({ status: "SUCCESS", data: response.data });
    })
    .catch((error) => {
      callback({ status: "ERROR", error: error });
    });
}

const updateIssuer = (data: any, callback: (response: Response) => void) => {
  const encryptedData = encryptData(data);
  
  API({
    method: "POST",
    url: `${APP_URL}/api/update-issuer`,
    data: { data: encryptedData },
  })
    .then((response) => {
      callback({ status: "SUCCESS", data: response.data });
    })
    .catch((error) => {
      callback({ status: "ERROR", error: error });
    });
}

const upload = (data: any, callback: (response: Response) => void) => {
  // const encryptedData = encryptData(data);
  
  API({
    method: "POST",
    url: `${ADMIN_API_URL}/api/upload`,
    data: data,
  })
    .then((response) => {
      callback({ status: "SUCCESS", data: response.data });
    })
    .catch((error) => {
      callback({ status: "ERROR", error: error });
    });
  }

const user = {
  register,
  verifyOtp,
  sendLink,
  changePassword,
  refreshToken,
  creditLimit,
  login,
  twoFactorAuth,
  verifyIssuer,
  loginWithPhone,
  createValidateIssuer,
  getIssuerByEmail,
  updateIssuer,
  upload,
};

export default user
