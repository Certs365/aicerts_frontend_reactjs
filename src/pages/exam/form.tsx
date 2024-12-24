// @ts-nocheck
import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Container, Row, Col, Card } from 'react-bootstrap';
import Image from 'next/legacy/image';
import PrimaryButton from '@/common/button/primaryButton';
import SecondaryButton from '@/common/button/secondaryButton';
import { toast } from 'react-toastify';
import responseAPI from './response.json';
import DownloadCertificate from '@/components/exam/downloadCertificate';

const CertificateDisplayPage: React.FC = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [s3Urls, setS3Urls] = useState<string[]>([]);  // To hold the image URLs
    const [isImagesReady, setIsImagesReady] = useState<boolean>(false);  // Flag to track image loading
    const ADMIN_API_URL = process.env.NEXT_PUBLIC_BASE_URL_admin2;
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const iconUrl = process.env.NEXT_PUBLIC_BASE_ICON_URL;
    const [user, setUser] = useState({});

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) setSelectedFile(file);
    };

    // Merge details with student data
    const mergeDetailsWithData = (studentData: Record<string, StudentData>, detail: CertificateDetail): MergedCertificate | null => {
        const enrollmentNumber = detail.enrollmentNumber;
        // Get corresponding student data using enrollmentNumber

        // Merge details and student data
        return {
            ...detail,
            studentData  // Adds all student data fields
        };
        return null;  // Return null if no matching data found
    };


    // Fetch the image blob for the certificate
    const fetchBlobForCertificate = async (data: any): Promise<Blob> => {
        const requestBody = { data };
        const response = await fetch('/api/downloadMarksCertificate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody),
        });

        if (response.ok) {
            return response.blob();
        }

        throw new Error('Failed to fetch blob');
    };

    // Upload the blob to S3 and return the URL
    const uploadToS3 = async (blob: Blob, enrollmentId: string): Promise<string | null> => {
        const timestamp = new Date().toISOString(); // Generate a timestamp
        const dynamicFileName = `${enrollmentId.split('.')[0]}_${timestamp}.png`; // Append timestamp to name

        const renamedBlob = new File([blob], dynamicFileName, { type: blob.type }); // Create a new File with the updated name

        const formData = new FormData();
        formData.append('file', renamedBlob);

        try {
            const response = await fetch(`${ADMIN_API_URL}/api/upload`, {
                method: 'POST',
                headers: {
                    'accept': 'application/json', // Matches `-H 'accept: application/json'`
                },
                body: formData,
            });

            const result = await response.json();
            const fileUrl = result?.fileUrl;

            if (fileUrl) {
                // Make the second API call to update the database with the enrollmentId and S3 URL
                await fetch(`${ADMIN_API_URL}/api/jg-upload`, {
                    method: 'POST',
                    headers: {
                        'accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        id: enrollmentId,
                        url: fileUrl,
                    }),
                });

                return fileUrl; // Return the S3 URL after updating the database
            }

            return null;
        } catch (error) {
            console.error('Error uploading to S3:', error);
            return null;
        }
    };

    useEffect(() => {
        // Check if the token is available in localStorage
        // @ts-ignore: Implicit any for children prop
        const storedUser = JSON.parse(localStorage.getItem('user'));
      
        if (storedUser && storedUser.JWTToken) {
          // If token is available, set it in the state
          setUser(storedUser)
        } else {
     
        }
      }, []);


    // Handle certificate generation
    const handleGenerateCertificates = async () => {
        if (!selectedFile) {
            toast.error('Please upload a valid file.');
            return;
        }

        setIsLoading(true);

        try {
            const formData = new FormData();
            formData.append('email', user?.email); // Replace with dynamic email if necessary
            formData.append('excelFile', selectedFile);

            // Simulate API response for batch data and details
            const response = await fetch(`${ADMIN_API_URL}/api/jg-issuance`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                },
                body: formData,
            });

            if (!response.ok) {
            const responseData = await response.json();
            toast.error(responseData?.message || 'Error during certificate generation');
            }

            const responseData = await response.json();
            // const responseData = responseAPI; // Simulated response for testing
            if (!responseData?.data || !responseData?.details) {
                throw new Error('Invalid response data structure');
            }

            const newS3Urls = [];

            // Iterate over the data and details and collect promises for S3 uploads
            const uploadPromises = responseData.details.map(async (currentDetails, i) => {
                const currentData = responseData.data[currentDetails?.enrollmentNumber];
                // Merge details with data

                const mergedDetails = mergeDetailsWithData(currentData, currentDetails);

                // Generate the image blob for the certificate
                const blob = await fetchBlobForCertificate(mergedDetails);

                // Upload the blob to S3
                const s3Url = await uploadToS3(blob, currentDetails?.enrollmentNumber);

                if (s3Url) {
                    newS3Urls.push({ ...mergedDetails, s3Url });
                }
            });

            // Wait for all S3 uploads to complete
            await Promise.all(uploadPromises);

            setS3Urls((prevUrls) => [...prevUrls, ...newS3Urls]); // Add new S3 URLs to state
            setIsImagesReady(true); // Flag indicating images are ready
        } catch (error) {
            console.error('Error during certificate generation:', error);
        } finally {
            setIsLoading(false);
        }
    };



    // Handle the sample download
    const handleDownloadSample = () => {
        const anchor = document.createElement('a');
        anchor.href = '/student_marks_template.xlsx';
        anchor.download = 'student_marks_template.xlsx';
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
    };

    // Handle file input click
    const handleClick = () => fileInputRef.current?.click();

    return (
        <>
            {isImagesReady ? (
                <DownloadCertificate data={s3Urls} />  // Render ShowImages component if images are ready
            ) : (
                <div className="page-bg">
                    <div className="position-relative mt-7">
                        <div className="dashboard py-5">
                            <Container className="mt-5">
                                <Row className="justify-content-md-center">
                                    <h3 className="title">Batch Issuance</h3>
                                    <Col xs={12} md={4}>
                                        <Card className="p-0">
                                            <Card.Header>Selected Template</Card.Header>
                                            <Card.Body>
                                                <div className="batch-cert-temp">
                                                    <Image
                                                        src="https://certs365-live.s3.amazonaws.com/uploads/01_JG%20University1.png"
                                                        layout="fill"
                                                        objectFit="contain"
                                                        alt="Certificate"
                                                    />
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                    <Col xs={12} md={8}>
                                        <div className="bulk-upload">
                                            <div className="download-sample d-block d-md-flex justify-content-between align-items-center text-center">
                                                <div className="tagline mb-3 mb-md-0">Please refer to our sample file for batch upload.</div>
                                                <PrimaryButton label="Download Sample" onClick={handleDownloadSample} />
                                            </div>
                                            <div style={{ position: 'relative' }} className="browse-file text-center">
                                                <h6 style={{ position: 'absolute', top: '10px', left: '10px', color: 'gray' }}>
                                                    Note: Date should be in format - MM/DD/YYYY
                                                </h6>
                                                <div className="download-icon position-relative">
                                                    <Image
                                                        src={`${iconUrl}/cloud-upload.svg`}
                                                        layout="fill"
                                                        objectFit="contain"
                                                        alt="Upload icon"
                                                    />
                                                </div>
                                                <h4 className="tagline">Upload your batch issue certification file here.</h4>
                                                <input type="file" ref={fileInputRef} onChange={handleFileChange} hidden accept=".xlsx" />
                                                <div className="d-flex justify-content-center align-items-center">
                                                    <SecondaryButton label="Choose File" onClick={handleClick} />
                                                </div>
                                                {selectedFile && (
                                                    <div className="d-flex flex-column justify-content-center align-items-center">
                                                        <p className="mt-4">{selectedFile?.name}</p>
                                                        <PrimaryButton
                                                            label="Validate and Issue"
                                                            onClick={handleGenerateCertificates}
                                                            loading={isLoading}
                                                            loadingText="Generating Certificates..."
                                                        />
                                                    </div>
                                                )}
                                                <div className="restriction-text">Only <strong>XLSX</strong> is supported. <br />(10KB - 50KB)</div>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </Container>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

CertificateDisplayPage.propTypes = {
    cardId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default CertificateDisplayPage;
