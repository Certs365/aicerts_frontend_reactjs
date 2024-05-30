import React, { useContext, useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import Button from '../../shared/button/button';
import { Form, Row, Col, Card, Modal, InputGroup, Container } from 'react-bootstrap';
import Image from 'next/image';
import CertificateTemplateThree from '../components/certificate3';
import { useRouter } from 'next/router';
import moment from 'moment';
import CertificateContext from '../utils/CertificateContext';
const apiUrl = process.env.NEXT_PUBLIC_BASE_URL;
const adminUrl = process.env.NEXT_PUBLIC_BASE_URL_admin;


const IssueCertificate = () => {
    const router = useRouter();
    const [issuedCertificate, setIssuedCertificate] = useState(null);
    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [show, setShow] = useState(false);
    const [token, setToken] = useState(null);
    const [email, setEmail] = useState(null);
    const [errors, setErrors] = useState({
        certificateNumber: '',
        name: '',
        course: '',
    });

    const [formData, setFormData] = useState({
        email: "",
        certificateNumber: '',
        name: '',
        course: '',
        grantDate: null, // Use null for Date values
        expirationDate: null, // Use null for Date values
    });

    const handleClose = () => {
        setShow(false);
    };  const { badgeUrl, certificateUrl, logoUrl, signatureUrl, issuerName, issuerDesignation, certificatesData, setCertificatesDatasetBadgeUrl, setIssuerName, setissuerDesignation, setCertificatesData, setSignatureUrl, setBadgeUrl, setLogoUrl } = useContext(CertificateContext);

    useEffect(() => {
        // Check if the token is available in localStorage
        const storedUser = JSON.parse(localStorage.getItem('user'));

        if (storedUser && storedUser.JWTToken) {
            // If token is available, set it in the state
            setToken(storedUser.JWTToken);
            setEmail(storedUser.email)
            // Set formData.email with stored email
            setFormData((prevFormData) => ({
                ...prevFormData,
                email: storedUser.email,
            }));

        } else {
            // If token is not available, redirect to the login page
            router.push('/');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const hasErrors = () => {
        const errorFields = Object.values(errors);
        return errorFields.some((error) => error !== '');
    };

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     if (hasErrors()) {
    //         // If there are errors, display them and stop the submission
    //         setShow(false);
    //         setIsLoading(false);
    //         return;
    //     }

    //     // Check if the issued date is smaller than the expiry date
    //     if (formData.grantDate >= formData.expirationDate) {
    //         setMessage('Issued date must be smaller than expiry date');
    //         setShow(true);
    //         setIsLoading(false);
    //         return;
    //     }

    //     setIsLoading(true);
    //     // Format grantDate and expirationDate
    //     const formattedGrantDate = formData?.grantDate;
    //     const formattedExpirationDate = formData?.expirationDate;

    //     try {
    //         const response = await fetch(`${adminUrl}/api/issue/`, {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'Authorization': `Bearer ${token}`,
    //             },
    //             body: JSON.stringify({
    //                 email: formData.email,
    //                 certificateNumber: formData.certificateNumber,
    //                 name: formData.name,
    //                 course: formData.course,
    //                 grantDate: formattedGrantDate,
    //                 expirationDate: formattedExpirationDate,
    //             }),
    //         });
    //         const responseData = await response.json();

    //         if (response && response.ok) {
    //             setMessage(responseData.message || 'Success');
    //             setIssuedCertificate(responseData); // Corrected variable name
    //             const response = await fetch(`${apiUrl}/api/upload`, {
    //                 method: 'POST',
    //                 body: formData
    //               });
                  
    //             // Handle success (e.g., show a success message)
    //         } else if (response) {
    //             console.error('API Error:', responseData.message || 'An error occurred');
    //             setMessage(responseData.message || 'An error occurred');
    //             setShow(true)
    //             // Handle error (e.g., show an error message)
    //         } else {
    //             setMessage(responseData.message || 'No response received from the server.');
    //             console.error('No response received from the server.');
    //             setShow(true)
    //         }
    //     } catch (error) {
    //         setMessage('An error occurred');
    //         // console.error('Error during API request:', error);
    //         setShow(true)
    //     } finally {
    //         setIsLoading(false)
    //     }
    // };

    const handleSubmit = async (e) => {
    e.preventDefault();
    if (hasErrors()) {
        // If there are errors, display them and stop the submission
        setShow(false);
        setIsLoading(false);
        return;
    }

    // Check if the issued date is smaller than the expiry date
    if (formData.grantDate >= formData.expirationDate) {
        setMessage('Issued date must be smaller than expiry date');
        setShow(true);
        setIsLoading(false);
        return;
    }

    setIsLoading(true);
    // Format grantDate and expirationDate

    function formatDate(date) {
        return `${(date?.getMonth() + 1).toString().padStart(2, '0')}/${date?.getDate().toString().padStart(2, '0')}/${date?.getFullYear()}`;;
    }
    try {
        const response = await fetch(`${adminUrl}/api/issue/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                email: formData.email,
                certificateNumber: formData.certificateNumber,
                name: formData.name,
                course: formData.course,
                grantDate: formatDate(formData.grantDate),
                expirationDate: formatDate(formData.grantDate),
            }),
        });
        const responseData = await response.json();

        if (response && response.ok) {
            setMessage(responseData.message || 'Success');
            setIssuedCertificate(responseData); // Corrected variable name
            // Call the function to generate and upload the image
            await generateAndUploadImage(formData, responseData); // Pass formData and responseData
        } else if (response) {
            console.error('API Error:', responseData.message || 'An error occurred');
            setMessage(responseData.message || 'An error occurred');
            setShow(true)
            // Handle error (e.g., show an error message)
        } else {
            setMessage(responseData.message || 'No response received from the server.');
            console.error('No response received from the server.');
            setShow(true)
        }
    } catch (error) {
        setMessage('An error occurred');
        // console.error('Error during API request:', error);
        setShow(true)
    } finally {
        setIsLoading(false)
    }
};

const generateAndUploadImage = async (formData, responseData) => {
    try {
        // Generate the image
        const blob = await handleShowImages(formData, responseData);

        // Upload the image to S3
        const certificateNumber = formData.certificateNumber;
        await uploadToS3(blob, certificateNumber);

    } catch (error) {
        console.error('Error generating or uploading image:', error);
    }
};

const handleShowImages = async (formData, responseData) => {
    const {details,polygonLink,message,status } = responseData;
    try {
        const res = await fetch('/api/downloadImage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ detail:details, message, polygonLink,badgeUrl, status, certificateUrl, logoUrl, signatureUrl, issuerName, issuerDesignation }),
        });

        if (res.ok) {
            const blob = await res.blob();
            return blob; // Return blob for uploading
        } else {
            console.error('Failed to generate image:', res.statusText);
            throw new Error('Image generation failed');
        }
    } catch (error) {
        console.error('Error generating image:', error);
        throw error;
    }
}

const uploadToS3 = async (blob, certificateNumber) => {
    try {
        // Create a new FormData object
        const formCert = new FormData();
        // Append the blob to the form data
        formCert.append('file', blob);
        // Append additional fields
        formCert.append('certificateNumber', certificateNumber);
        formCert.append('type', 2);

        // Make the API call to send the form data
        const uploadResponse = await fetch(`${adminUrl}/api/upload-certificate`, {
            method: 'POST',
            body: formCert
        });

        if (!uploadResponse.ok) {
            throw new Error('Failed to upload certificate to S3');
        }
    } catch (error) {
        console.error('Error uploading to S3:', error);
    }
};


    const handleChange = (e, regex, minLength, maxLength, fieldName) => {
        const { name, value } = e.target;

        // Check if the change is for the "name" field
        if (name === 'name') {
            // If the value is empty, allow update
            if (value === '') {
                setFormData({ ...formData, [name]: value });
                return;
            }
    
            // If the value is not empty and starts with a space, disallow update
            if (value.trimStart() !== value) {
                return;
            }
    
            // Validation for disallowing special characters using regex
            if (!regex.test(value)) {
                return; // Do nothing if the value contains special characters
            }

            // Validation for disallowing numbers
            if (/\d/.test(value)) {
                return; // Do nothing if the value contains numbers
            }
    
            // Other validations such as length checks
            if (value.length < minLength || value.length > maxLength) {
                return; // Do nothing if the length is not within the specified range
            }
        }

        if (name === 'certificateNumber' || name === 'course') {
            // If the value is not empty and starts with a space, disallow update
            if (value.trimStart() !== value) {
                return;
            }
        }

        // Check if the value is empty
        if (value.trim() === '') {
            setFormData((prevFormData) => ({
                ...prevFormData,
                [name]: value,
            }));
            // Clear error message for this field
            setErrors((prevErrors) => ({
                ...prevErrors,
                [name]: '',
            }));
            return;
        }
        const isFormatValid = regex?.test(value);
        const isLengthValid = value.length >= minLength && value.length <= maxLength;

        if (isFormatValid && isLengthValid) {
            setFormData((prevFormData) => ({
                ...prevFormData,
                [name]: value,
            }));
            setErrors((prevErrors) => ({
                ...prevErrors,
                [name]: '',
            }));
        } else {
            setFormData((prevFormData) => ({
                ...prevFormData,
                [name]: value,
            }));
            setErrors((prevErrors) => ({
                ...prevErrors,
                [name]: isFormatValid
                    ? name === 'certificateNumber' && !isLengthValid
                        ? `Input length must be between ${minLength} and ${maxLength} characters`
                        : ''
                    : name === 'certificateNumber'
                        ? 'Certificate Number must be alphanumeric'
                        : `Input length must be between ${minLength} and ${maxLength} characters`,
            }));


        }
    };

    const handleDateChange = (name, value) => {
        
        console.log(value)
            setFormData((prevFormData) => ({
                ...prevFormData,
                [name]: value,
            }));
        };

    return (
        <>
            <div className='page-bg'>
                <div className='position-relative h-100'>
                    <div className='register issue-new-certificate'>
                        <div className='vertical-center'>
                            {issuedCertificate ? (
                                <>
                                    {issuedCertificate && <CertificateTemplateThree certificateData={issuedCertificate} />}
                                </>
                            ) : (
                                <Container>
                                    <h2 className='title'>Issue New Certification</h2>

                                    <Form className='register-form' onSubmit={handleSubmit} encType="multipart/form-data">
                                        <Card>
                                            <Card.Body>
                                                <Card.Title>Certification Details</Card.Title>

                                                <div className='input-elements'>
                                                    <Row className="justify-content-md-center">

                                                        <Col md={{ span: 4 }} xs={{ span: 12 }}>
                                                            <Form.Group controlId="name" className='mb-3'>
                                                                <Form.Label>Name <span className='text-danger'>*</span></Form.Label>
                                                                <InputGroup>
                                                                    <Form.Control
                                                                        type="text"
                                                                        name='name'
                                                                        value={formData.name}
                                                                        onChange={(e) => handleChange(e, /^[a-zA-Z0-9\s]+$/, 1, 30, 'Name')}
                                                                        required
                                                                        maxLength={30} // Limit the input to 30 characters
                                                                    />
                                                                    <InputGroup.Text>{formData.name.length}/30</InputGroup.Text> {/* Display character count */}
                                                                </InputGroup>
                                                                <div style={{ color: "red" }} className="error-message">{errors.name}</div>
                                                            </Form.Group>

                                                            <Form.Group controlId="date-of-issue" className='mb-3'>
                                                                <Form.Label>Date of Issue <span className='text-danger'>*</span></Form.Label>
                                                                {/* <input
                                                                    name='date-of-issue'
                                                                    type='date'
                                                                    className='form-control'
                                                                    selected={formData.grantDate}
                                                                    onChange={(e) => handleDateChange('grantDate', e.target.value)}
                                                                    min={new Date().toISOString().split('T')[0]}
                                                                    max={formData.expirationDate || '2099-12-31'} // Maximum date is either expirationDate or 2099-12-31
                                                                    required
                                                                /> */}
                                                                <DatePicker
    name='date-of-issue'
    className='form-control'
    dateFormat="MM/dd/yyyy"
    showMonthDropdown
    showYearDropdown
    dropdownMode="select"
    selected={formData.grantDate}
    onChange={(date) => handleDateChange('grantDate', date)}
    minDate={new Date()}
    maxDate={formData.expirationDate ? new Date(formData.expirationDate) : new Date('2099-12-31')}
    required
    isClearable
/>

                                                            </Form.Group>
                                                        </Col>
                                                        <Col md={{ span: 4 }} xs={{ span: 12 }}>
                                                            <Form.Group controlId="certificateNumber" className='mb-3'>
                                                                <Form.Label>Certification Number <span className='text-danger'>*</span></Form.Label>
                                                                <Form.Control
                                                                    type="text"
                                                                    name='certificateNumber'
                                                                    value={formData.certificateNumber}
                                                                    onChange={(e) => handleChange(e, /^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]+$/, 12, 20, 'Certificate Number')}
                                                                    required
                                                                    maxLength={20}
                                                                />
                                                                <div style={{ marginTop: "7px" }} className="error-message small-p">{errors.certificateNumber}</div>
                                                            </Form.Group>
                                                            <Form.Group controlId="date-of-expiry" className='mb-3'>
                                                                <Form.Label>Date of Expiry  <span className='text-danger'>*</span></Form.Label>
                                                                {/* <input
                                                                    name='date-of-expiry'
                                                                    type='date'
                                                                    className='form-control'
                                                                    selected={formData.expirationDate}
                                                                    onChange={(e) => handleDateChange('expirationDate', e.target.value)}
                                                                    min={formData.grantDate || new Date().toISOString().split('T')[0]} // Minimum date is either grantDate or today
                                                                    max={'2049-1
                                                                    2-31'}
                                                                /> */}
                                                                <DatePicker
    name="date-of-expiry"
    className='form-control'
    dateFormat="MM/dd/yyyy"
    showMonthDropdown
    showYearDropdown
    dropdownMode="select"
    selected={formData.expirationDate}
    onChange={(date) => handleDateChange('expirationDate', date)}
    minDate={formData.grantDate ? new Date(formData.grantDate) : new Date()}
    maxDate={new Date('2099-12-31')}
    isClearable
/>
                                                            </Form.Group>


                                                        </Col>
                                                        <Col md={{ span: 4 }} xs={{ span: 12 }}>
                                                            <Form.Group controlId="course" className='mb-3'>
                                                                <Form.Label>Course Name <span className='text-danger'>*</span></Form.Label>
                                                                <InputGroup>
                                                                    <Form.Control
                                                                        type="text"
                                                                        name='course'
                                                                        value={formData.course}
                                                                        onChange={(e) => handleChange(e, /^[^\s]+(\s[^\s]+)*$/, 0, 20, 'Course')}
                                                                        required
                                                                        maxLength={20} // Limit the input to 20 characters
                                                                    />
                                                                    <InputGroup.Text>{formData.course.length}/20</InputGroup.Text> {/* Display character count */}
                                                                </InputGroup>
                                                                <div style={{ color: "#ff5500" }} className="error-message">{errors.course}</div>
                                                            </Form.Group>

                                                        </Col>
                                                    </Row>
                                                </div>
                                            </Card.Body>
                                        </Card>
                                        <div className='text-center'>
                                            <Button type="submit" label="Issue Certification" className="golden"
                                                disabled={
                                                    !formData.name ||
                                                    !formData.grantDate ||
                                                    !formData.certificateNumber ||
                                                    !formData.expirationDate ||
                                                    !formData.course
                                                }
                                            />
                                            {message && (
                                                <p className='mt-3 mb-0'>
                                                    {message}
                                                </p>
                                            )}
                                        </div>
                                    </Form>

                                </Container>
                            )}
                        </div>
                    </div>
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
                </Modal.Body>
            </Modal>

            <Modal onHide={handleClose} className='loader-modal text-center' show={show} centered>
                <Modal.Body className='p-5'>
                    {message &&
                        <>
                            <div className='error-icon'>
                                <Image
                                    src="/icons/close.svg"
                                    layout='fill'
                                    objectFit='contain'
                                    alt='Loader'
                                />
                            </div>
                            <h3 style={{ color: 'red' }}> {message}</h3>
                            <button className='warning' onClick={handleClose}>Ok</button>
                        </>
                    }
                </Modal.Body>
            </Modal>
        </>
    );
}

export default IssueCertificate;