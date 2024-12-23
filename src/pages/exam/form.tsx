// components/CertificateDisplayPage.tsx
import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { Container, Row, Col, Card } from 'react-bootstrap';
import Image from 'next/legacy/image';
import PrimaryButton from '@/common/button/primaryButton';
import SecondaryButton from '@/common/button/secondaryButton';
import { toast } from 'react-toastify';
import ShowImages from '@/components/exam/showImages';
import responseAPI from './response.json';

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
    const uploadToS3 = async (blob: Blob): Promise<string | null> => {
        const timestamp = new Date().toISOString(); // Generate a timestamp
        const originalFileName = blob.name || 'file'; // Get the original name or use 'file' as a fallback
        const dynamicFileName = `${originalFileName.split('.')[0]}_${timestamp}.png`; // Append timestamp to name
    
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
            const formData = new FormData();
            formData.append('email', 'basit@aicerts.io'); // Replace with dynamic email if necessary
            formData.append('excelFile', selectedFile);
    
            // Simulate API response for batch data and details
            // const response = await fetch('http://10.2.3.55:2010/api/jg-issuance', {
            //     method: 'POST',
            //     headers: {
            //         'Accept': 'application/json',
            //     },
            //     body: formData,
            // });
    
            // if (!response.ok) {
            //     throw new Error('Failed to process the Excel file');
            // }
    
            // const responseData = await response.json();
            const responseData = responseAPI; // Simulated response for testing
    
            if (!responseData?.data || !responseData?.details) {
                throw new Error('Invalid response data structure');
            }
    
            const newS3Urls = [];
    
            // Iterate over the data and details
            for (let i = 0; i < responseData.data.length; i++) {
                const currentData = responseData.data[i];
                const currentDetails = responseData.details[i];
    
                // Merge details with data
                const mergedDetails = mergeDetailsWithData(currentData, currentDetails);
    
                // Generate the image blob for the certificate
                const blob = await fetchBlobForCertificate(mergedDetails);
    
                // Upload the blob to S3
                const s3Url = await uploadToS3(blob);
    
                if (s3Url) {
                    newS3Urls.push(s3Url);
                }
            }
    
            setS3Urls((prevUrls) => [...prevUrls, ...newS3Urls]); // Add new S3 URLs to state
            setIsImagesReady(true); // Flag indicating images are ready
            debugger
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
