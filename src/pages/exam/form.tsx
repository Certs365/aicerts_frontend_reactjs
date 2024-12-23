// components/CertificateDisplayPage.tsx
import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { Container, Row, Col, Card } from 'react-bootstrap';
import Image from 'next/legacy/image';
import PrimaryButton from '@/common/button/primaryButton';
import SecondaryButton from '@/common/button/secondaryButton';
import { toast } from 'react-toastify';
import ShowImages from '@/components/exam/showImages';

const CertificateDisplayPage: React.FC = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [s3Urls, setS3Urls] = useState<string[]>([]);  // To hold the image URLs
    const [isImagesReady, setIsImagesReady] = useState<boolean>(false);  // Flag to track image loading
    const ADMIN_API_URL = process.env.NEXT_PUBLIC_BASE_URL_admin;
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const iconUrl = process.env.NEXT_PUBLIC_BASE_ICON_URL;

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) setSelectedFile(file);
    };

    // Merge details with student data
    const mergeDetailsWithData = (studentData: Record<string, StudentData>, details: CertificateDetail[]): MergedCertificate[] => {
        return details.map((detail) => {
            const enrollmentNumber = detail.enrollmentNumber;
            const student = studentData[enrollmentNumber]; // Get corresponding student data using enrollmentNumber

            if (student) {
                // Merge details and student data
                return {
                    ...detail,
                    studentData: student,  // Adds all student data fields
                };
            }
            return null;  // Return null if no matching data found
        }).filter(item => item !== null) as MergedCertificate[]; // Filter out null items and assert type
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
    const uploadToS3 = async (blob: Blob, certificateNumber: string): Promise<string | null> => {
        const formData = new FormData();
        formData.append('file', blob);
        formData.append('certificateNumber', certificateNumber);
        formData.append('type', '3');

        try {
            const response = await fetch(`${ADMIN_API_URL}/api/upload`, {
                method: 'POST',
                headers: {
                    'accept': 'application/json', // Matches `-H 'accept: application/json'`
                },
                body: formData,
            });
            const result = await response.json();
            return result?.fileUrl || null;
        } catch (error) {
            console.error('Error uploading to S3:', error);
            return null;
        }
    };

    // Handle certificate generation
    const handleGenerateCertificates = async () => {
        if (!selectedFile) {
            toast.error('Please upload a valid file.');
            return;
        }

        setIsLoading(true);

        try {
            // Create a FormData object to send the file in the request
            const formData = new FormData();
            formData.append('email', 'basit@aicerts.io'); // Replace with actual email if dynamic
            formData.append('excelFile', selectedFile);

            // Send the file to the API for processing
            const response = await fetch('http://10.2.3.55:2010/api/jg-issuance', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json', // Ensure correct headers
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to process the Excel file');
            }

            const responseData = await response.json();

            // Send the API response data to /api/downloadMarksCertificate
            const blob = await fetchBlobForCertificate(mergeDetailsWithData(responseData));  // Fetch image blob for the certificate

            // Now upload the blob to S3
            const s3Url = await uploadToS3(blob, responseData.certificateNumber);  // Assume certificateNumber is available in the response

            if (s3Url) {
                // Add the S3 URL to the list of URLs
                setS3Urls((prevUrls) => [...prevUrls, s3Url]);
            }

            setIsImagesReady(true); // Flag indicating images are ready
        } catch (error) {
            console.error('Error during certificate generation:', error);
            toast.error('Error during certificate generation');
        } finally {
            setIsLoading(false);
        }
    };

    // Handle the sample download
    const handleDownloadSample = () => {
        const anchor = document.createElement('a');
        anchor.href = '/download-sample.xlsx';
        anchor.download = 'sample.xlsx';
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
    };

    // Handle file input click
    const handleClick = () => fileInputRef.current?.click();

    return (
        <>
            {isImagesReady ? (
                <ShowImages imageUrls={s3Urls} />  // Render ShowImages component if images are ready
            ) : (
                <div className="page-bg">
                    <div className="position-relative mt-4">
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
                                                        src="https://certs365-live.s3.amazonaws.com/uploads/01_JG%20University.png"
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
