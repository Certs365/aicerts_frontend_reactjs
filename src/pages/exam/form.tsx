import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Container, Row, Col, Card } from 'react-bootstrap';
import Image from 'next/legacy/image';
import PrimaryButton from '@/common/button/primaryButton';
import SecondaryButton from '@/common/button/secondaryButton';

const CertificateDisplayPage: React.FC = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [s3Urls, setS3Urls] = useState<string[]>([]);
    const ADMIN_API_URL = process.env.NEXT_PUBLIC_BASE_URL_admin;
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const iconUrl = process.env.NEXT_PUBLIC_BASE_ICON_URL;

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) setSelectedFile(file);
    };

    const dummyApiCall = async () => {
        // Dummy data simulating API response
        return [
            {
                "Name": "Hiren Patel",
                "EnrollmentNo": "J0869750",
                "Programme": "Computer Science",
                "Semester": "7",
                "Examination": "B.Tech",
                "School": "JG University",
                "TotalMarks": "464",
                "TGP": "278",
                "TCr": "18",
                "TCP": "196",
                "Result": "Pass",
                "Max": "80",
                "Min": "20",
                "Subjects": [
                    {
                        "Name": "Data Structures and Algorithms",
                        "Marks": "70",
                        "Grade": "A",
                        "PassingMarks": "36",
                        "Credits": "40",
                        "Weightage": "4"
                    },
                    {
                        "Name": "Database Management Systems",
                        "Marks": "62",
                        "Grade": "B+",
                        "PassingMarks": "36",
                        "Credits": "4",
                        "Weightage": "40"
                    },
                    {
                        "Name": "Operating Systems",
                        "Marks": "75",
                        "Grade": "A",
                        "PassingMarks": "40",
                        "Credits": "40",
                        "Weightage": "2"
                    },
                    {
                        "Name": "Computer Networks",
                        "Marks": "62",
                        "Grade": "B+",
                        "PassingMarks": "28",
                        "Credits": "24",
                        "Weightage": "1"
                    },
                    {
                        "Name": "Software Engineering",
                        "Marks": "76",
                        "Grade": "A",
                        "PassingMarks": "40",
                        "Credits": "40",
                        "Weightage": "2"
                    },
                    {
                        "Name": "DBMS Lab",
                        "Marks": "59",
                        "Grade": "B",
                        "PassingMarks": "22",
                        "Credits": "14",
                        "Weightage": "2"
                    }
                ]
            },
            {
                "Name": "Hiren Patel",
                "EnrollmentNo": "J0869750",
                "Programme": "Computer Science",
                "Semester": "7",
                "Examination": "B.Tech",
                "School": "JG University",
                "TotalMarks": "464",
                "TGP": "278",
                "TCr": "18",
                "TCP": "196",
                "Result": "Pass",
                "Max": "80",
                "Min": "20",
                "Subjects": [
                    {
                        "Name": "Data Structures and Algorithms",
                        "Marks": "70",
                        "Grade": "A",
                        "PassingMarks": "36",
                        "Credits": "40",
                        "Weightage": "4"
                    },
                    {
                        "Name": "Database Management Systems",
                        "Marks": "62",
                        "Grade": "B+",
                        "PassingMarks": "36",
                        "Credits": "4",
                        "Weightage": "40"
                    },
                    {
                        "Name": "Operating Systems",
                        "Marks": "75",
                        "Grade": "A",
                        "PassingMarks": "40",
                        "Credits": "40",
                        "Weightage": "2"
                    },
                    {
                        "Name": "Computer Networks",
                        "Marks": "62",
                        "Grade": "B+",
                        "PassingMarks": "28",
                        "Credits": "24",
                        "Weightage": "1"
                    },
                    {
                        "Name": "Software Engineering",
                        "Marks": "76",
                        "Grade": "A",
                        "PassingMarks": "40",
                        "Credits": "40",
                        "Weightage": "2"
                    },
                    {
                        "Name": "DBMS Lab",
                        "Marks": "59",
                        "Grade": "B",
                        "PassingMarks": "22",
                        "Credits": "14",
                        "Weightage": "2"
                    }
                ]
            },
            {
                "Name": "Hiren Patel",
                "EnrollmentNo": "J0869750",
                "Programme": "Computer Science",
                "Semester": "7",
                "Examination": "B.Tech",
                "School": "JG University",
                "TotalMarks": "464",
                "TGP": "278",
                "TCr": "18",
                "TCP": "196",
                "Result": "Pass",
                "Max": "80",
                "Min": "20",
                "Subjects": [
                    {
                        "Name": "Data Structures and Algorithms",
                        "Marks": "70",
                        "Grade": "A",
                        "PassingMarks": "36",
                        "Credits": "40",
                        "Weightage": "4"
                    },
                    {
                        "Name": "Database Management Systems",
                        "Marks": "62",
                        "Grade": "B+",
                        "PassingMarks": "36",
                        "Credits": "4",
                        "Weightage": "40"
                    },
                    {
                        "Name": "Operating Systems",
                        "Marks": "75",
                        "Grade": "A",
                        "PassingMarks": "40",
                        "Credits": "40",
                        "Weightage": "2"
                    },
                    {
                        "Name": "Computer Networks",
                        "Marks": "62",
                        "Grade": "B+",
                        "PassingMarks": "28",
                        "Credits": "24",
                        "Weightage": "1"
                    },
                    {
                        "Name": "Software Engineering",
                        "Marks": "76",
                        "Grade": "A",
                        "PassingMarks": "40",
                        "Credits": "40",
                        "Weightage": "2"
                    },
                    {
                        "Name": "DBMS Lab",
                        "Marks": "59",
                        "Grade": "B",
                        "PassingMarks": "22",
                        "Credits": "14",
                        "Weightage": "2"
                    }
                ]
            }
        ];
    };

    const handleGenerateCertificates = async () => {
        setIsLoading(true);
        try {
            const data = await dummyApiCall(); // Dummy API call
            const s3UrlsTemp: string[] = [];

            for (let index = 0; index < data.length; index++) {
                const detail = data[index];
                const blob = await fetchBlobForCertificate(detail); // Fetch blob
                const s3Url = await uploadToS3(blob, index); // Pass index instead of certificateNumber
                if (s3Url) s3UrlsTemp.push(s3Url);
            }

            setS3Urls(s3UrlsTemp); // Save S3 URLs in state
            setIsLoading(false);

            // Pass s3UrlsTemp to another component if needed
        } catch (error) {
            console.error('Error during certificate generation:', error);
            setIsLoading(false);
        }
    };

    const handleDownloadSample = () => {
        // Create a new anchor element
        const anchor = document.createElement('a');
        // Set the href attribute to the path of the file to be downloaded
        anchor.href = '/download-sample.xlsx';
        // Set the download attribute to the desired filename for the downloaded file
        anchor.download = 'sample.xlsx';
        // Append the anchor element to the document body
        document.body.appendChild(anchor);
        // Trigger a click event on the anchor element to initiate the download
        anchor.click();
        // Remove the anchor element from the document body
        document.body.removeChild(anchor);
    };

    const fetchBlobForCertificate = async (data: any): Promise<Blob> => {
        const requestBody = {
            data
        }

        const response = await fetch('/api/downloadMarksCertificate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody),
        });
        if (response.ok) return response.blob();
        throw new Error('Failed to fetch blob');
    };

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

    const handleClick = () => fileInputRef.current?.click();
    const certificateUrl = "https://certs365-live.s3.amazonaws.com/uploads/01_JG%20University.png"
    return (
        <>
            <div className="page-bg">
                <div className="position-relative mt-4">
                    <div className='dashboard py-5'>
                        <Container className='mt-5'>
                            <Row className="justify-content-md-center">
                                <h3 className='title'>Batch Issuance</h3>
                                <Col xs={12} md={4}>
                                    <Card className='p-0'>
                                        <Card.Header>Selected Template</Card.Header>
                                        <Card.Body>
                                            <div className='batch-cert-temp'>
                                                <Image
                                                    src={certificateUrl}
                                                    layout='fill'
                                                    objectFit='contain'
                                                    alt={`Certificate`} />
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col xs={12} md={8}>
                                    <div className='bulk-upload'>
                                        <div className='download-sample d-block d-md-flex justify-content-between align-items-center text-center'>
                                            <div className='tagline mb-3 mb-md-0'>Please refer to our sample file for batch upload.</div>
                                            <PrimaryButton label="Download Sample &nbsp; &nbsp;" classes='golden position-relative' onClick={handleDownloadSample} />
                                        </div>
                                        <div style={{ position: "relative" }} className='browse-file text-center'>
                                            <h6 style={{ position: "absolute", top: "10px", left: "10px", color: "gray" }}>
                                                Note: Date should be in format - MM/DD/YYYY
                                            </h6>
                                            <div className='download-icon position-relative'>
                                                <Image
                                                    src={`${iconUrl}/cloud-upload.svg`}
                                                    layout='fill'
                                                    objectFit='contain'
                                                    alt='Upload icon'
                                                />
                                            </div>
                                            <h4 className='tagline'>Upload  your batch issue certification file here.</h4>
                                            <input type="file" ref={fileInputRef} onChange={handleFileChange} hidden accept=".xlsx" />
                                            <SecondaryButton label="Choose File" onClick={handleClick} />
                                            {!selectedFile && (
                                                <div>
                                                    <p className='mt-4'>{selectedFile?.name}</p>
                                                    <PrimaryButton label="Validate and Issue"
                                                        onClick={() =>
                                                            handleGenerateCertificates()
                                                        }
                                                    />
                                                </div>
                                            )}
                                            <div className='restriction-text'>Only <strong>XLSX</strong> is supported. <br />(10KB - 50KB)</div>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </Container>
                    </div>
                </div>
            </div>
        </>
    );
};

CertificateDisplayPage.propTypes = {
    cardId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default CertificateDisplayPage;
