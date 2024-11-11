import { encryptData } from "./reusableFunctions";
import user from '@/services/userServices';
const secretKey = process.env.NEXT_PUBLIC_BASE_ENCRYPTION_KEY;

async function UpdateLocalStorage() {
    const apiUrl = process.env.NEXT_PUBLIC_BASE_URL_admin;
    const storedUserString = localStorage.getItem('user');
    let storedUser = storedUserString ? JSON.parse(storedUserString) : null;

    if (!storedUser || !storedUser.JWTToken || !storedUser.email) {
        console.error('Stored user data is missing or invalid.');
        return; // Exit early if the stored user is invalid
    }
    const payload = { email: storedUser.email }
    // const encryptedData = encryptData(payload);

    try {
        // const resp = await fetch(`${apiUrl}/api/get-issuer-by-email`, {
        //     method: "POST",
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'Authorization': `Bearer ${storedUser.JWTToken}`,
        //     },
        //     body: JSON.stringify({ data:encryptedData })
        // });
        user.getIssuerByEmail(payload,async (response)=>{
            if(response?.data?.status != "SUCCESS"){
            // if (!response.ok) {
                console.error(`Failed to fetch issuer data: ${response?.data?.statusText}`);
                return; // Exit if the API call fails
            }
    
            const userData = response;
            const userDetails = userData?.data;
    
            if (userDetails && typeof userDetails.certificatesIssued === 'number') {
                storedUser.certificatesIssued = userDetails.certificatesIssued;
                localStorage.setItem("user", JSON.stringify(storedUser));
            } else {
                console.error('Invalid data received from API.');
            }
        })

        // if (!resp.ok) {
        //     console.error(`Failed to fetch issuer data: ${resp.statusText}`);
        //     return; // Exit if the API call fails
        // }

        // const userData = await resp.json();
        // const userDetails = userData?.data;

        // if (userDetails && typeof userDetails.certificatesIssued === 'number') {
        //     storedUser.certificatesIssued = userDetails.certificatesIssued;
        //     localStorage.setItem("user", JSON.stringify(storedUser));
        // } else {
        //     console.error('Invalid data received from API.');
        // }
    } catch (error) {
        console.error('Error occurred while updating local storage:', error);
    }
}

export { UpdateLocalStorage };
