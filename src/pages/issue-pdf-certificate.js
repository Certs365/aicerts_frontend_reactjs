import React, { useState, useEffect } from 'react';
import Button from '../../shared/button/button';
import { Container, Form, Row, Col, Card, Modal, InputGroup, ProgressBar } from 'react-bootstrap';
import fileDownload from 'react-file-download';
import DatePicker from 'react-datepicker';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import { PDFDocument } from 'pdf-lib';
import AWS from "../config/aws-config"
import axios from 'axios';
import Image from 'next/image';
import { UpdateLocalStorage } from '../utils/UpdateLocalStorage';
import issuance from '../services/issuanceServices';
const apiUrl = process.env.NEXT_PUBLIC_BASE_URL_admin;
const generalError = process.env.NEXT_PUBLIC_BASE_GENERAL_ERROR;

const IssueNewCertificate = () => {
    const [pdfBlob, setPdfBlob] = useState(null);
    const [show, setShow] = useState(false);
    const [now, setNow] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [token, setToken] = useState(null);
    const [email, setEmail] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isDownloading, setIsDownloading] = useState(false);
    const [uploadedFile, setUploadedFile] = useState();
    const [details, setDetails] = useState(null);
    const [formData, setFormData] = useState({
        email: '',
        certificateNumber: '',
        name: '',
        course: '',
        grantDate: null,
        expirationDate: null,
        file: null,
    });

    const generatePresignedUrl = async (key) => {
        const s3 = new AWS.S3({
            accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
            region: process.env.NEXT_PUBLIC_AWS_REGION
        });
        const params = {
            Bucket: process.env.NEXT_PUBLIC_BUCKET,
            Key: key,
            Expires: 360000,
        };

        try {
            const url = await s3.getSignedUrlPromise('getObject', params);
            return url;
        } catch (error) {
            console.error('Error generating pre-signed URL:', error);
            return null;
        }
    }

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));

        if (storedUser && storedUser.JWTToken) {
            setToken(storedUser.JWTToken);
            setEmail(storedUser.email)
        } else {
        }
    }, []);

    const hasErrors = () => {
        const errorFields = Object.values(errors);
        return errorFields.some((error) => error !== '');
    };

    function formatDate(date) {
        return `${(date?.getMonth() + 1).toString().padStart(2, '0')}/${date?.getDate().toString().padStart(2, '0')}/${date?.getFullYear()}`;;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        if (hasErrors()) {
            setShow(false);
            // setIsLoading(false);
            return;
        }

        // Check if the issued date is smaller than the expiry date
        if (formData.grantDate >= formData.expirationDate) {
            setErrorMessage('Issued date must be smaller than expiry date');
            setShow(true);
            // setIsLoading(false);
            return;
        }


        
        setSuccessMessage("")
        setErrorMessage("")
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
            setNow(0); // Progress complete
        };

        startProgress();

        try {
            if(!isDownloading) {
            const formDataWithFile = new FormData();
            formDataWithFile.append('email', email);
            formDataWithFile.append('certificateNumber', formData.certificateNumber);
            formDataWithFile.append('name', formData.name);
            formDataWithFile.append('course', formData.course);
            formDataWithFile.append('grantDate', formatDate(formData.grantDate));
            formDataWithFile.append('expirationDate', formatDate(formData.expirationDate));
            formDataWithFile.append('file', formData.file);
            debugger
            const response = await fetch(`${apiUrl}/api/issue-pdf/`, {
                method: 'POST',
                body: formDataWithFile,
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            });
            // Log the contents of FormData
            // console.log("Logging FormData entries:");
            // for (let [key, value] of formDataWithFile.entries()) {
            //   console.log(`${key}:`, value);  // This will show both the key and value in the FormData
            // }
            // issuance.issuePdf(formDataWithFile, async (response)=>{
            //     debugger
            //     console.log(response);
            //     console.log(response.data);
            //     const responseData = response.data;
            //     if(response.status === "SUCCESS"){
            //     // if (response && response.ok) {
            //     debugger
            //     const blob = await responseData.blob();
                
                
            //     setPdfBlob(blob);
            //     setSuccessMessage("Certificate Successfully Generated")
            //     setShow(true);
            //     await UpdateLocalStorage()
            //     } else if (response) {
            //         const responseBody = response.error.response.data;
            //         const errorMessage = responseBody && responseBody.message ? responseBody.message : generalError;
            //         console.error('API Error:' ,errorMessage);
            //         // console.error('API Error:' || generalError);
            //         setErrorMessage(errorMessage);
            //         setShow(true);
            //     } else {
            //         console.error('No response received from the server.');
            //     }
            // })
            if (response && response.ok) {
                const blob = await response.blob();
                setPdfBlob(blob);
                setSuccessMessage("Certificate Successfully Generated")
                setShow(true);
                await UpdateLocalStorage()

                } else if (response) {
                    const responseBody = await response.json();
                    const errorMessage = responseBody && responseBody.message ? responseBody.message : generalError;
                    console.error('API Error:' || generalError);
                    setErrorMessage(errorMessage);
                    setShow(true);
                } else {
                    console.error('No response received from the server.');
                }
            }
        } catch (error) {
            console.error('Error during API request:', error);
        } finally {
            stopProgress();
            setIsLoading(false)
        }
    };

    const handleClose = () => {
        setShow(false);
        setErrorMessage("")
    };

    const handleDownload = (e) => {
        e.preventDefault();
        setIsDownloading(true)
        if (pdfBlob) {
            const fileData = new Blob([pdfBlob], { type: 'application/pdf' });
            fileDownload(fileData, `Certificate_${formData.certificateNumber}.pdf`);
        }
    };

    const handleDateChange = (name, value) => {

        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const fileName = file.name;
            const fileType = fileName.split('.').pop(); // Get the file extension
            const fileSize = file.size / 1024; // Convert bytes to KB

            if (
                fileType.toLowerCase() === 'pdf' &&
                fileSize >= 250 &&
                fileSize <= 500
            ) {
                setFormData({
                    ...formData,
                    file: file,
                });
            } else {
                let message = '';
                if (fileType.toLowerCase() !== 'pdf') {
                    message = 'Only PDF files are supported.';
                } else if (fileSize < 250) {
                    message = 'File size should be at least 250KB.';
                } else if (fileSize > 500) {
                    message = 'File size should be less than or equal to 500KB.';
                }
                // Reset the file input field
                e.target.value = null;
                // Notify the user with the appropriate message
                setErrorMessage(message);
                setShow(true);
            }
            setUploadedFile(true)
        } else {
            setUploadedFile(false)
        }
    };



    const [errors, setErrors] = useState({
        certificateNumber: '',
        name: '',
        course: '',
    });

    const handleRedirect = ((e) => {
        e.preventDefault()
        window.location.href = '/issue-pdf-certificate'
    })

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

    return (
        <>
            <div className='page-bg'>
                <div className='position-relative h-100'>
                    <div className='register issue-new-certificate'>
                        <div className='vertical-center'>
                            <Container className='mt-5 mt-md-0'>
                                <h2 className='title'>Issue New Certification</h2>
                                <Form className='register-form' onSubmit={pdfBlob ? handleRedirect : handleSubmit} encType="multipart/form-data">
                                    <Card>
                                        <Card.Body>
                                            <Card.Title>Certification Details</Card.Title>

                                            <div className='input-elements'>
                                                <Row className="justify-content-md-center">
                                                    <Col md={{ span: 4 }} xs={{ span: 12 }}>
                                                        <Form.Group controlId="name" className='mb-3'>
                                                            <Form.Label >Name of Candidate<span className='text-danger'>*</span></Form.Label>
                                                            <InputGroup>
                                                                <Form.Control
                                                                    type="text"
                                                                    name='name'
                                                                    value={formData.name}
                                                                    onChange={(e) => handleChange(e, /^[a-zA-Z0-9\s]+$/, 0, 30, 'Name')}
                                                                    required
                                                                    maxLength={30} // Limit the input to 30 characters
                                                                />
                                                                <InputGroup.Text>{formData.name.length}/30</InputGroup.Text> {/* Display character count */}
                                                            </InputGroup>
                                                        </Form.Group>
                                                        <Form.Group controlId="certificateNumber" className='mb-3'>
                                                            <Form.Label>Certification Number <span className='text-danger'>*</span></Form.Label>
                                                            <Form.Control
                                                                type="text"
                                                                name='certificateNumber'
                                                                value={formData.certificateNumber}
                                                                onChange={(e) => handleChange(e, /^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]+$/, 12, 20, 'Certificate Number')}
                                                                maxLength={20}
                                                                required
                                                            />
                                                            <div style={{ marginTop: "7px" }} className="error-message small-p">{errors.certificateNumber}</div>
                                                        </Form.Group>
                                                    </Col>
                                                    <Col md={{ span: 4 }} xs={{ span: 12 }}>
                                                        <Form.Group controlId="date-of-issue" className='mb-3'>
                                                            <Form.Label>Date of Issue <span className='text-danger'>*</span></Form.Label>
                                                            {/* <input
                                                                name='date-of-issue'
                                                                type='date'
                                                                className='form-control'
                                                                selected={formData.grantDate}
                                                                onChange={(e) => handleDateChange('grantDate', e.target.value)}
                                                                min={new Date().toISOString().split('T')[0]}
                                                                max={formData.expirationDate || '9999-12-31'} // Maximum date is either expirationDate or 2099-12-31
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

                                                        <Form.Group controlId="date-of-expiry" className='mb-3 d-block d-md-none'>
                                                            <Form.Label>Date of Expiry  <span className='text-danger'>*</span></Form.Label>
                                                            {/* <input
                                                                name='date-of-expiry'
                                                                type='date'
                                                                className='form-control'
                                                                selected={formData.expirationDate}
                                                                onChange={(e) => handleDateChange('expirationDate', e.target.value)}
                                                                min={formData.grantDate || new Date().toISOString().split('T')[0]} // Minimum date is either grantDate or today
                                                                max={'9999-12-31'}
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
                                                        </Form.Group>
                                                    </Col>
                                                    <Col md={{ span: 4 }} xs={{ span: 12 }}>
                                                        <Form.Group controlId="date-of-expiry" className='mb-3 d-none d-md-block'>
                                                            <Form.Label>Date of Expiry  <span className='text-danger'>*</span></Form.Label>
                                                            {/* <input
                                                                name='date-of-expiry'
                                                                type='date'
                                                                className='form-control'
                                                                selected={formData.expirationDate}
                                                                onChange={(e) => handleDateChange('expirationDate', e.target.value)}
                                                                min={formData.grantDate || new Date().toISOString().split('T')[0]} // Minimum date is either grantDate or today
                                                                max={'9999-12-31'}
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
                                                </Row>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                    <Card>
                                        <Card.Body>
                                            <Card.Title>Upload Template  <span className='text-danger'>*</span>
                                                <p className='mb-0 mt-2 font-monospace small-p text-black-100'>PDF dimensions should less than or equal to width:(340-360)mm and height:(240-260)mm</p>
                                                <p className='mb-0 mt-2 font-monospace small-p text-black-100'>PDF File size should be 250KB - 500KB</p>
                                            </Card.Title>

                                            <div className='input-elements'>
                                                <Row className="justify-content-md-center">
                                                    <Col md={{ span: 4 }} xs={{ span: 12 }}>
                                                        <Form.Group controlId="formFile">
                                                            <Form.Control name="formFile" type="file" onChange={handleFileChange} accept=".pdf" />
                                                        </Form.Group>
                                                    </Col>
                                                </Row>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                    <div className='text-center d-block d-md-flex justify-content-center'>
                                        <Button type="submit" label="Issue Certification" className="golden mx-2"
                                            disabled={
                                                !formData.name ||
                                                !formData.certificateNumber ||
                                                !formData.grantDate ||
                                                !formData.course ||
                                                !formData.expirationDate ||
                                                !uploadedFile
                                            }
                                        />

                                        {pdfBlob && (
                                            <Button onClick={(e) => { handleDownload(e) }} label="Download Certification" className="golden" disabled={isLoading} />
                                        )}
                                    </div>
                                </Form>
                            </Container>
                        </div>
                    </div>
                </div>
            </div>
            <div className='page-footer-bg'></div>
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
                    <div className='text'>Issuing certification.</div>
                    <ProgressBar now={now} label={`${now}%`} />
                </Modal.Body>
            </Modal>

            <Modal onHide={handleClose} className='loader-modal text-center' show={show} centered>
                <Modal.Body>
                    {errorMessage !== '' ? (
                        <>
                            <div className='error-icon success-image'>
                                <Image
                                    src="/icons/invalid-password.gif"
                                    layout='fill'
                                    objectFit='contain'
                                    alt='Loader'
                                />
                            </div>
                            <div className='text' style={{ color: '#ff5500' }}>{errorMessage}</div>
                            {details && (
                                <div className='details'>
                                    <p>Certificate Number: {details.certificateNumber}</p>
                                    <p>Expiration Date: {details.expirationDate}</p>
                                </div>
                            )}
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
                            <div className='text' style={{ color: '#CFA935' }}>{successMessage}</div>
                            <button className='success' onClick={handleClose}>Ok</button>
                        </>
                    )}
                </Modal.Body>
            </Modal>
        </>
    );
}

export default IssueNewCertificate;
