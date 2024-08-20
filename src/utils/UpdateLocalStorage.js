async function UpdateLocalStorage() {
    const apiUrl = process.env.NEXT_PUBLIC_BASE_URL_admin;
    const storedUserString = localStorage.getItem('user');
    let storedUser = storedUserString ? JSON.parse(storedUserString) : null;

    if (!storedUser || !storedUser.JWTToken || !storedUser.email) {
        console.error('Stored user data is missing or invalid.');
        return; // Exit early if the stored user is invalid
    }

    try {
        const resp = await fetch(`${apiUrl}/api/get-issuer-by-email`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${storedUser.JWTToken}`,
            },
            body: JSON.stringify({ email: storedUser.email })
        });

        if (!resp.ok) {
            console.error(`Failed to fetch issuer data: ${resp.statusText}`);
            return; // Exit if the API call fails
        }

        const userData = await resp.json();
        const userDetails = userData?.data;

        if (userDetails && typeof userDetails.certificatesIssued === 'number') {
            storedUser.certificatesIssued = userDetails.certificatesIssued;
            localStorage.setItem("user", JSON.stringify(storedUser));
        } else {
            console.error('Invalid data received from API.');
        }
    } catch (error) {
        console.error('Error occurred while updating local storage:', error);
    }
}

export { UpdateLocalStorage };
