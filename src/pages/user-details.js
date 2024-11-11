import React, { useEffect, useState } from 'react';
import profileData from '../data/profileData.json';
import { Container, Row, Col, Card, Modal, ProgressBar } from "react-bootstrap";
import Image from 'next/legacy/image';
import Button from '../../shared/button/button';
import { useRouter } from 'next/router';
import { encryptData } from '../utils/reusableFunctions';
import user from '@/services/userServices';
const apiUrl_Admin = process.env.NEXT_PUBLIC_BASE_URL_admin;
const apiUrl = process.env.NEXT_PUBLIC_BASE_URL_USER;
const secretKey = process.env.NEXT_PUBLIC_BASE_ENCRYPTION_KEY;

const ProfileDetails = () => {
    const [editable, setEditable] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [token, setToken] = useState(null);
    const [show, setShow] = useState(false);
    const [now, setNow] = useState(0);
    const [loginError, setLoginError] = useState('');
    const [loginSuccess, setLoginSuccess] = useState('');
    // const dynamicHeight = '5px';
    // const profile = profileData[0];
    const [email, setEmail] = useState("")
    const [username, setUsername] = useState("")
    const router = useRouter();
    // State for form data
    const [formData, setFormData] = useState({
        id: "",
        organization: '',
        address: '',
        country: '',
        organizationType: '',
        city: '',
        zip: '',
        industrySector: '1', // Default value for the dropdown
        state: '',
        websiteLink: '',
        name: '',
        phoneNumber: '',
        designation: '',
    });

    useEffect(() => {
        // Check if the token is available in localStorage
        const storedUser = JSON.parse(localStorage.getItem('user'));

        if (storedUser && storedUser.JWTToken) {
            // If token is available, set it in the state
            setToken(storedUser.JWTToken);
            fetchData(storedUser.email);

        } else {
            // If token is not available, redirect to the login page
            router.push('/');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchData = async (email) => {

        const data = {
            email: email
        };

        setIsLoading(true);
        setNow(10)

        let progressInterval;
        const startProgress = () => {
            progressInterval = setInterval(() => {
                setNow((prev) => {
                    if (prev < 90) return prev + 5;
                    return prev;
                });
            }, 100);
        };

        const stopProgress = () => {
            clearInterval(progressInterval);
            setNow(100); // Progress complete
        };

        startProgress();
        // const encryptedData = encryptData(data);

        try {
            // const response = await fetch(`${apiUrl_Admin}/api/get-issuer-by-email`, {
            //     method: "POST",
            //     headers: {
            //         'Content-Type': 'application/json',
            //         'Authorization': `Bearer ${token}`,
            //     },
            //     body: JSON.stringify({
            //         data:encryptedData
            //     })
            // });
            user.getIssuerByEmail(data, async (response)=>{
            const userData = response.data;
            const userDetails = userData?.data;
            setEmail(userDetails.email || "")
            setUsername(userDetails.username || "")


            // Assuming response is in JSON format
            setFormData({
                id: userDetails?.issuerId,
                organization: userDetails.organization || "",
                address: userDetails.address || "",
                country: userDetails.country || "",
                organizationType: userDetails.organizationType || "",
                city: userDetails.city || "",
                zip: userDetails.zip || "",
                industrySector: userDetails.industrySector || "",
                state: userDetails.state || "",
                websiteLink: userDetails.websiteLink || "",
                name: userDetails.name || "",
                phoneNumber: userDetails.phoneNumber || "",
                designation: userDetails.designation || ""
            });

            const storedUser = JSON.parse(localStorage.getItem('user'));
            localStorage.setItem('user', JSON.stringify({
                ...storedUser,
                // Update the necessary fields with the new data
                id: userDetails?._id,
                organization: userDetails.organization || "",
                address: userDetails.address || "",
                country: userDetails.country || "",
                organizationType: userDetails.organizationType || "",
                city: userDetails.city || "",
                zip: userDetails.zip || "",
                industrySector: userDetails.industrySector || "",
                state: userDetails.state || "",
                websiteLink: userDetails.websiteLink || "",
                name: userDetails.name || "",
                phoneNumber: userDetails.phoneNumber || "",
                designation: userDetails.designation || "",

            }));
            })
            // const userData = await response.json();
            // const userDetails = userData?.data;
            // setEmail(userDetails.email || "")
            // setUsername(userDetails.username || "")


            // // Assuming response is in JSON format
            // setFormData({
            //     id: userDetails?.issuerId,
            //     organization: userDetails.organization || "",
            //     address: userDetails.address || "",
            //     country: userDetails.country || "",
            //     organizationType: userDetails.organizationType || "",
            //     city: userDetails.city || "",
            //     zip: userDetails.zip || "",
            //     industrySector: userDetails.industrySector || "",
            //     state: userDetails.state || "",
            //     websiteLink: userDetails.websiteLink || "",
            //     name: userDetails.name || "",
            //     phoneNumber: userDetails.phoneNumber || "",
            //     designation: userDetails.designation || ""
            // });

            // const storedUser = JSON.parse(localStorage.getItem('user'));
            // localStorage.setItem('user', JSON.stringify({
            //     ...storedUser,
            //     // Update the necessary fields with the new data
            //     id: userDetails?._id,
            //     organization: userDetails.organization || "",
            //     address: userDetails.address || "",
            //     country: userDetails.country || "",
            //     organizationType: userDetails.organizationType || "",
            //     city: userDetails.city || "",
            //     zip: userDetails.zip || "",
            //     industrySector: userDetails.industrySector || "",
            //     state: userDetails.state || "",
            //     websiteLink: userDetails.websiteLink || "",
            //     name: userDetails.name || "",
            //     phoneNumber: userDetails.phoneNumber || "",
            //     designation: userDetails.designation || "",

            // }));

        } catch (error) {
            console.error('Error Verifying Certificate:', error);
            // Handle error
        } finally {
            stopProgress();
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setShow(false);

    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    };

    const handleEditToggle = () => {
        setEditable(!editable);
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        setNow(10)

        let progressInterval;
        const startProgress = () => {
            progressInterval = setInterval(() => {
                setNow((prev) => {
                    if (prev < 90) return prev + 5;
                    return prev;
                });
            }, 100);
        };

        const stopProgress = () => {
            clearInterval(progressInterval);
            setNow(100); // Progress complete
        };

        startProgress();
      const data = {email, ...formData};
        try {
            // const response = await fetch(`${apiUrl}/api/update-issuer`, {
            //     method: "POST",
            //     headers: {
            //         'Content-Type': 'application/json',
            //         'Authorization': `Bearer ${token}`,
            //     },
            //     body: JSON.stringify({
            //         data:encryptedData 
            //     })
            // });
            user.updateIssuer(data, async (response)=>{
            const userData = response.data;
            const userDetails = userData?.data;
            setLoginSuccess("Details Updated Successfully")
            setShow(true)
            setEditable(false);
            // Assuming response is in JSON format
            setFormData({
                id: userDetails.issuerId,
                // organization: userDetails.organization || "",
                address: userDetails.address || "",
                country: userDetails.country || "",
                // organizationType: userDetails.organizationType || "",
                city: userDetails.city || "",
                zip: userDetails.zip || "",
                industrySector: userDetails.industrySector || "",
                state: userDetails.state || "",
                websiteLink: userDetails.websiteLink || "",
                name: userDetails.name || "",
                phoneNumber: userDetails.phoneNumber || "",
                designation: userDetails.designation || "",
            });
            })
            // const userData = await response.json();
            // const userDetails =
            // setLoginSuccess("Details Updated Successfully")
            // setShow(true)
            // setEditable(false);
            // // Assuming response is in JSON format
            // setFormData({
            //     id: userDetails.issuerId,
            //     // organization: userDetails.organization || "",
            //     address: userDetails.address || "",
            //     country: userDetails.country || "",
            //     // organizationType: userDetails.organizationType || "",
            //     city: userDetails.city || "",
            //     zip: userDetails.zip || "",
            //     industrySector: userDetails.industrySector || "",
            //     state: userDetails.state || "",
            //     websiteLink: userDetails.websiteLink || "",
            //     name: userDetails.name || "",
            //     phoneNumber: userDetails.phoneNumber || "",
            //     designation: userDetails.designation || "",
            // });

        } catch (error) {
            console.error('Error Verifying Certificate:', error);
            // Handle error
        } finally {
            stopProgress();
            setIsLoading(false);
        }
    };
    return (
        <>
            <div className='page-bg'>
                <div className='user-details'>
                    <Container className="my-5">
                        <Row>
                            <Col xs={12} md={4}>
                                <Card>
                                    <Card.Body>
                                        <div className="d-flex flex-column align-items-center text-center">
                                            <div className="rounded-circle p-1 bg-primary text-center" >

                                                {formData?.name?.split(' ')?.slice(0, 2)?.map(word => word[0])?.join('')}
                                            </div>

                                            <div className="mt-3">
                                                <h4 className='name'>{formData?.name || ""}</h4>
                                                <p className="role mb-1">{formData?.designation || ""}</p>
                                                <p className="address">{formData?.address || ""}</p>
                                            </div>
                                        </div>
                                        <hr className="my-4" />
                                        <ul className="list-group list-group-flush">
                                            <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap ps-0 pe-0">
                                                <div className="icons d-flex align-items-center" style={{ columnGap: "8px" }}>
                                                    Email
                                                </div>
                                                <span className="lead-info" style={{ color: email ? 'inherit' : 'gray', fontSize: email ? 'inherit' : 'small' }}>
                                                    {email || "Not Set"}
                                                </span>
                                            </li>
                                            <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap ps-0 pe-0">
                                                <div className="icons d-flex align-items-center" style={{ columnGap: "8px" }}>
                                                    Username
                                                </div>
                                                <span className="lead-info" style={{ color: username ? 'inherit' : 'gray', fontSize: username ? 'inherit' : 'small' }}>
                                                    {username || "Not Set"}
                                                </span>

                                            </li>
                                            <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap ps-0 pe-0">
                                                <div className="icons d-flex align-items-center" style={{ columnGap: "8px" }}>
                                                    Phone Number
                                                </div>
                                                <span className="lead-info" style={{ color: formData?.phoneNumber ? 'inherit' : 'gray', fontSize: formData?.phoneNumber ? 'inherit' : 'small' }}>
                                                    {formData?.phoneNumber || "Not Set"}
                                                </span>
                                            </li>
                                            <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap ps-0 pe-0">
                                                <div className="icons d-flex align-items-center" style={{ columnGap: "8px" }}>
                                                    Website
                                                </div>
                                                <span className="lead-info" style={{ color: formData?.websiteLink ? 'inherit' : 'gray', fontSize: formData?.websiteLink ? 'inherit' : 'small' }}>
                                                    {formData?.websiteLink || "Not Set"}
                                                </span>
                                            </li>
                                            <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap ps-0 pe-0">
                                                <div className="icons d-flex align-items-center" style={{ columnGap: "8px" }}>
                                                    Organization
                                                </div>
                                                <span className="lead-info" style={{ color: formData?.organization ? 'inherit' : 'gray', fontSize: formData?.organization ? 'inherit' : 'small' }}>
                                                    {formData?.organization || "Not Set"}
                                                </span>
                                            </li>
                                        </ul>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col xs={12} md={8}>
                                <Card>
                                    <Card.Body>
                                        <Row className="mb-3">
                                            <Col className="col-sm-3">
                                                <h6 className="mb-0 icons">Name</h6>
                                            </Col>
                                            <div className="col-sm-9 text-secondary">
                                                <input value={formData.name} onChange={handleInputChange} name='name' type="text" className="form-control" placeholder="" disabled={!editable} />

                                            </div>
                                        </Row>
                                        {/* <div className="row mb-3">
                                            <div className="col-sm-3">
                                                <h6 className="mb-0 icons">Username</h6>
                                            </div>
                                            <div className="col-sm-9 text-secondary">
                                                <input type="text" className="form-control" value={username} onChange={handleInputChange} name='username' disabled={!editable}/>
                                            </div>
                                        </div> */}
                                        {/* <div className="row mb-3">
                                            <div className="col-sm-3">
                                                <h6 className="mb-0 icons">Email</h6>
                                            </div>
                                            <div className="col-sm-9 text-secondary">
                                                <input type="text" className="form-control" value={email} onChange={handleInputChange} name='email' disabled={!editable}/>
                                            </div>
                                        </div> */}
                                        <div className="row mb-3">
                                            <div className="col-sm-3">
                                                <h6 className="mb-0 icons">Phone</h6>
                                            </div>
                                            <div className="col-sm-9 text-secondary">
                                                <input type="text" className="form-control" value={formData.phoneNumber} onChange={handleInputChange} name='phoneNumber' disabled={!editable} />
                                            </div>
                                        </div>
                                        <div className="row mb-3">
                                            <div className="col-sm-3">
                                                <h6 className="mb-0 icons">Address</h6>
                                            </div>
                                            <div className="col-sm-9 text-secondary">
                                                <input type="text" className="form-control" value={formData.address} onChange={handleInputChange} name='address' disabled={!editable} />
                                            </div>
                                        </div>
                                        <div className="row mb-3">
                                            <div className="col-sm-3">
                                                <h6 className="mb-0 icons">City</h6>
                                            </div>
                                            <div className="col-sm-9 text-secondary">
                                                <input type="text" className="form-control" value={formData.city} onChange={handleInputChange} name='city' disabled={!editable} />
                                            </div>
                                        </div>
                                        <div className="row mb-3">
                                            <div className="col-sm-3">
                                                <h6 className="mb-0 icons">State</h6>
                                            </div>
                                            <div className="col-sm-9 text-secondary">
                                                <input type="text" className="form-control" value={formData.state} onChange={handleInputChange} name='state' disabled={!editable} />
                                            </div>
                                        </div>
                                        <div className="row mb-3">
                                            <div className="col-sm-3">
                                                <h6 className="mb-0 icons">Country</h6>
                                            </div>
                                            <div className="col-sm-9 text-secondary">
                                                <input type="text" className="form-control" value={formData.country} onChange={handleInputChange} name='country' disabled={!editable} />
                                            </div>
                                        </div>
                                        <div className="row mb-3">
                                            <div className="col-sm-3">
                                                <h6 className="mb-0 icons">Zip</h6>
                                            </div>
                                            <div className="col-sm-9 text-secondary">
                                                <input type="text" className="form-control" value={formData.zip} onChange={handleInputChange} name='zip' disabled={!editable} />
                                            </div>
                                        </div>
                                        <div className="row mb-3">
                                            <div className="col-sm-3">
                                                <h6 className="mb-0 icons">Industry Sector</h6>
                                            </div>
                                            <div className="col-sm-9 text-secondary">
                                                <input type="text" className="form-control" value={formData.industrySector} onChange={handleInputChange} name='industrySector' disabled={!editable} />
                                            </div>
                                        </div>
                                        <div className="row mb-3">
                                            <div className="col-sm-3">
                                                <h6 className="mb-0 icons">Website Link</h6>
                                            </div>
                                            <div className="col-sm-9 text-secondary">
                                                <input type="text" className="form-control" value={formData.websiteLink} onChange={handleInputChange} name='websiteLink' disabled={!editable} />
                                            </div>
                                        </div>
                                        <div className="row mb-3">
                                            <div className="col-sm-3">
                                                <h6 className="mb-0 icons">Organization Type</h6>
                                            </div>
                                            <div className="col-sm-9 text-secondary">
                                                <input type="text" className="form-control" value={formData.organizationType} onChange={handleInputChange} name='organizationType' disabled={!editable} />
                                            </div>
                                        </div>
                                        <div className="row mb-3">
                                            <div className="col-sm-3">
                                                <h6 className="mb-0 icons">Designation</h6>
                                            </div>
                                            <div className="col-sm-9 text-secondary">
                                                <input type="text" className="form-control" value={formData.designation} onChange={handleInputChange} name='designation' disabled={!editable} />
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-center justify-content-center" style={{ columnGap: "10px" }}>
                                            {editable ? (
                                                <Button label="Cancel" className="outlined pe-3 ps-3 py-2" onClick={handleEditToggle} />
                                            ) : (
                                                <Button label="Edit" className="golden pe-3 ps-3 py-2" onClick={handleEditToggle} />
                                            )}
                                            {editable && (
                                                <Button label="Save Changes" className="golden pe-3 ps-3 py-2" onClick={handleSubmit} />
                                            )}
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </Container>
                </div>
            </div>
            <div className='page-footer-bg'></div>

            {/* Loading Modal for API call */}
            <Modal className='loader-modal' show={isLoading} centered>
                <Modal.Body>
                    <div className='certificate-loader'>
                        <Image
                            src="/backgrounds/login-loading.gif"
                            layout='fill'
                            objectFit='contain'
                            alt='Loader'
                        />
                    </div>
                    <div className='text'>Loading user details</div>
                    <ProgressBar now={now} label={`${now}%`} />
                </Modal.Body>
            </Modal>

            <Modal onHide={handleClose} className='loader-modal text-center' show={show} centered>
                <Modal.Body>
                    {loginError !== '' ? (
                        <>
                            <div className='error-icon success-image'>
                                <Image
                                    src="/icons/invalid-password.gif"
                                    layout='fill'
                                    objectFit='contain'
                                    alt='Loader'
                                />
                            </div>
                            <div className='text' style={{ color: '#ff5500' }}>{loginError}</div>
                            <button className='warning' onClick={handleClose}>Ok</button>
                        </>
                    ) : (
                        <>
                            <div className='error-icon success-image'>
                                <Image
                                    src="/icons/success.gif"
                                    layout='fill'
                                    objectFit='contain'
                                    alt='Loader'
                                />
                            </div>
                            <div className='text' style={{ color: '#CFA935' }}>{loginSuccess}</div>
                            <button className='success' onClick={handleClose}>Ok</button>
                        </>
                    )}


                </Modal.Body>
            </Modal>
        </>
    );
}

export default ProfileDetails;
