import React, { useState, useEffect } from 'react';
import JSZip from 'jszip';
import { Button, Modal, Image, Container, Row, Col, Card, Form, Table } from 'react-bootstrap';
import BackIcon from "../../../public/icons/back-icon.svg";
import { useRouter } from 'next/router';
import PrimaryButton from '@/common/button/primaryButton';
import { jsPDF } from 'jspdf';

interface CertificateDetail {
    EnrollmentNo: string;
    name: string;
}

interface DownloadCertificateProps {
    data: {
        details: CertificateDetail[];
        message: string;
        polygonLink: string;
        status: string;
    };
}

const DownloadCertificate: React.FC<DownloadCertificateProps> = ({ data }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [selectAll, setSelectAll] = useState(false);
    const [checkedItems, setCheckedItems] = useState<{ [key: number]: boolean }>({});
    const [searchQuery, setSearchQuery] = useState('');
    const [isGridView, setIsGridView] = useState(true);
    const [detailsArray, setDetailsArray] = useState<CertificateDetail[]>([]);
    const [filteredCertificatesArray, setFilteredCertificatesArray] = useState<CertificateDetail[]>([]);
    const [imageUrlList, setImageUrlList] = useState<string[]>([]);
    const [prevModal, setPrevModal] = useState(false);
    const [imageUrl, setImageUrl] = useState('');
    const [isImageLoading, setIsImageLoading] = useState(true);
    const [loginError, setLoginError] = useState('');
    const [loginSuccess, setLoginSuccess] = useState('');
    const [show, setShow] = useState(false);

    useEffect(() => {
        setFilteredCertificatesArray(data);
    }, [data]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const searchValue = e.target.value;
        setSearchQuery(searchValue);

        const filteredDetails = searchValue.trim() === ""
            ? data.details
            : data.details.filter((detail) =>
                detail.EnrollmentNo.toLowerCase().includes(searchValue.toLowerCase()) ||
                detail.name.toLowerCase().includes(searchValue.toLowerCase())
            );

        setFilteredCertificatesArray(filteredDetails);
    };

    const handleDownload = (s3Url: string, enrollmentNumber: string) => {
        const link = document.createElement('a');
        link.href = s3Url;
        link.download = `Certificate_${enrollmentNumber}.png`;
        document.body.appendChild(link);
        link.click();
        link.remove();
    };


const handleDownloadPDF = async (imageUrl: string) => {
    setIsLoading(true);
    try {
        // Fetch the image from the S3 URL
        const res = await fetch(imageUrl);
        if (!res.ok) {
            throw new Error('Failed to fetch image');
        }

        // Convert the image to a blob
        const imageBlob = await res.blob();
        const imageUrlObject = URL.createObjectURL(imageBlob);

        // Convert the dimensions (px to mm) while maintaining aspect ratio
        const pxToMm = 0.264583; // Conversion factor: 1 px = 0.264583 mm
        const pdfWidth = 722 * pxToMm; // Convert width from px to mm
        const pdfHeight = 893 * pxToMm; // Convert height from px to mm

        // Create a new jsPDF instance with specific dimensions
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: [pdfWidth, pdfHeight],
        });

        // Add the image to the PDF to cover the entire area
        pdf.addImage(imageUrlObject, 'JPEG', 0, 0, pdfWidth, pdfHeight);

        // Save the PDF
        pdf.save('Certification.pdf');

        // Clean up the image URL object
        URL.revokeObjectURL(imageUrlObject);

        setLoginError('');
        setLoginSuccess('Certification Downloaded');
        setShow(true);
    } catch (error) {
        setLoginError('Error downloading PDF');
        setShow(true);
    } finally {
        setIsLoading(false);
    }
};



    const handleDownloadPDFs = async () => {
        setIsLoading(true);
        try {
            const zip = new JSZip();
            const isDesign = new URLSearchParams(window.location.search).get('isDesign');
            const endpoint = isDesign ? '/api/generatePDFBatch' : '/api/generatePDF';

            for (const detail of detailsArray) {
                const bodyData = {
                    detail,
                    certificateUrl: '',
                    logoUrl: '',
                    signatureUrl: '',
                    badgeUrl: '',
                    issuerName: '',
                    issuerDesignation: '',
                };

                const res = await fetch(endpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(bodyData),
                });

                if (res.ok) {
                    const blob = await res.blob();
                    zip.file(`Certificate_${detail.EnrollmentNo}.pdf`, blob);
                } else {
                    setLoginError("Error downloading PDF");
                    setShow(true);
                }
            }

            const zipBlob = await zip.generateAsync({ type: 'blob' });
            const zipUrl = window.URL.createObjectURL(zipBlob);
            const link = document.createElement('a');
            link.href = zipUrl;
            link.setAttribute('download', 'Certificates.zip');
            document.body.appendChild(link);
            link.click();
            link.remove();

            setLoginError('');
            setLoginSuccess('Certificates Downloaded');
            setShow(true);
        } catch (error) {
            setLoginError('Error downloading PDFs');
            setShow(true);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleViewMode = () => {
        setIsGridView(!isGridView);
    };

    const handlePrevCert = (url: string, detail: CertificateDetail) => {
        setPrevModal(true);
        setImageUrl(url);
    };

    const closePrevCert = () => {
        setPrevModal(false);
    };

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const isChecked = event.target.checked;
        setCheckedItems((prevState) => ({
            ...prevState,
            [index]: isChecked,
        }));

        const selectedDetail = data.details[index];
        if (isChecked) {
            setDetailsArray((prevDetails) => [...prevDetails, selectedDetail]);
        } else {
            setDetailsArray((prevDetails) => prevDetails.filter((detail) => detail.EnrollmentNo !== selectedDetail.EnrollmentNo));
        }
    };

    const handleSelectAllChange = () => {
        const newSelectAll = !selectAll;
        setSelectAll(newSelectAll);

        if (newSelectAll) {
            setDetailsArray(data.details);
            setCheckedItems(
                data.details.reduce((acc, _, index) => {
                    acc[index] = true;
                    return acc;
                }, {} as { [key: number]: boolean })
            );
        } else {
            setDetailsArray([]);
            setCheckedItems({});
        }
    };

    return (
        <>
            <div className='page-bg'>
                <div className='position-relative h-100'>
                    <div className='vertical-center batchDashboard'>
                        <div className='dashboard pb-5 pt-5'>
                            <Container className='mt-5 mt-md-0'>
                                <div className='d-flex align-items-center mb-4'>
                                    <span onClick={() => { window.location.href = "/certificate?tab=1" }} className='back-button'>
                                        <Image width={10} height={10} src={BackIcon} alt='back' /><span className=''>Back</span>
                                    </span>
                                    <h3 className='title mb-0'>Batch Issuance</h3>
                                </div>
                                <Row>
                                    <Col xs={12} md={4} className='mb-4 mb-md-0'>
                                        <Card className='p-0 h-auto d-none d-md-block'>
                                            <Card.Header>Selected Template</Card.Header>
                                            <Card.Body>
                                                <div className='issued-info'>
                                                    <Image width={200} height={150} className='img-fluid' src={"https://certs365-live.s3.amazonaws.com/uploads/01_JG%20University1.png"} alt={`Certificate ${"" + 1}`} />
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                    <Col xs={12} md={8}>
                                        <div className='cert-list'>
                                            <div className="search-wrapper d-block d-md-flex align-items-center justify-content-between">
                                                <div className='select-all'>
                                                    <Form.Group controlId="select-all">
                                                        <Form.Check type="checkbox" label="Select All"
                                                            checked={selectAll}
                                                            onChange={handleSelectAllChange}
                                                        />
                                                    </Form.Group>
                                                </div>
                                                <Form.Group controlId="search">
                                                    <div className="password-input position-relative">
                                                        <Form.Control
                                                            type='text'
                                                            value={searchQuery}
                                                            onChange={handleSearchChange}
                                                            placeholder="Search Certificate"
                                                        />
                                                        <div className='eye-icon position-absolute'>
                                                            <Image
                                                                src="https://images.netcomlearning.com/ai-certs/icons/search-icon-transparent.svg"
                                                                width={20}
                                                                height={20}
                                                                alt="Search certificate"
                                                                className="password-toggle"
                                                            />
                                                        </div>
                                                    </div>
                                                </Form.Group>
                                                <div className='d-none d-md-flex align-items-center' style={{ columnGap: "10px" }}>
                                                    <div className='icon' onClick={toggleViewMode}>
                                                        {isGridView ? (
                                                            <Image
                                                                src="https://images.netcomlearning.com/ai-certs/icons/list.svg"
                                                                layout='fill'
                                                                objectFit='contain'
                                                                alt='List View'
                                                            />
                                                        ) : (
                                                            <Image
                                                                src="https://images.netcomlearning.com/ai-certs/icons/grid.svg"
                                                                layout='fill'
                                                                objectFit='contain'
                                                                alt='Grid View'
                                                            />
                                                        )}
                                                    </div>
                                                </div>
                                                <PrimaryButton disabled={detailsArray?.length === 0} onClick={handleDownloadPDFs} label='Download Certificates' />
                                            </div>

                                            {isGridView ? (
                                                <div className='grid-view'>
                                                    <Row>
                                                        {filteredCertificatesArray && filteredCertificatesArray?.map((detail, index) => (
                                                            <Col key={index} xs={12} md={6}>
                                                                <div className='prev-cert-card'>
                                                                    <div style={{ border: "1px solid black" }} className='cert-prev'>
                                                                        <Image
                                                                            src={detail.s3Url}
                                                                            layout='fill'
                                                                            width={300}
                                                                            width={300}
                                                                            objectFit='contain'
                                                                            alt={`Certificate ${detail.EnrollmentNo}`}
                                                                        />
                                                                    </div>
                                                                    <div className='d-flex justify-content-between align-items-center'>
                                                                        <Form.Group controlId={`Certificate ${index + 1}`}>
                                                                            <Form.Check
                                                                                type="checkbox"
                                                                                label={detail.EnrollmentNo}
                                                                                checked={checkedItems[index] || false}
                                                                                onChange={(event) => handleCheckboxChange(event, index)}
                                                                            />
                                                                        </Form.Group>
                                                                        <div className='action-buttons d-flex' style={{ columnGap: "10px" }}>
                                                                            <span className='d-flex align-items-center' style={{ columnGap: "10px" }} onClick={() => handlePrevCert(imageUrlList[index], detail)}>
                                                                                <Image
                                                                                    src="https://images.netcomlearning.com/ai-certs/icons/eye-white-bg.svg"
                                                                                    width={16}
                                                                                    height={16}
                                                                                    alt='View Certificate'
                                                                                />
                                                                            </span>
                                                                            <span className='d-flex align-items-center' style={{ columnGap: "10px" }} onClick={() => handleDownloadPDF(detail.s3Url)}>
                                                                                <Image
                                                                                    src="https://images.netcomlearning.com/ai-certs/icons/download-white-bg.svg"
                                                                                    width={16}
                                                                                    height={16}
                                                                                    alt='Download Certificate'
                                                                                />
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </Col>
                                                        ))}
                                                    </Row>
                                                </div>
                                            ) : (
                                                <div className='list-view-table'>
                                                    <Table bordered>
                                                        <thead>
                                                            <tr>
                                                                <th><div className='d-flex align-items-center justify-content-center'><span>S.No</span></div></th>
                                                                <th><span>Issuer Name</span></th>
                                                                <th><span>Certificate Number</span></th>
                                                                <th><span>View</span></th>
                                                                <th><span>Download</span></th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {filteredCertificatesArray && filteredCertificatesArray?.map((detail, index) => (
                                                                <tr key={index}>
                                                                    <td>
                                                                        <div className='d-flex align-items-center'>
                                                                            <Form.Check
                                                                                type="checkbox"
                                                                                aria-label={`option ${index}`}
                                                                                checked={checkedItems[index] || false}
                                                                                onChange={(event) => handleCheckboxChange(event, index)}
                                                                            />
                                                                        </div>
                                                                    </td>
                                                                    <td>{detail.name}</td>
                                                                    <td>{detail.EnrollmentNo}</td>
                                                                    <td>
                                                                        <div className='trigger-icons' onClick={() => handlePrevCert(imageUrlList[index], detail)}>
                                                                            <Image
                                                                                src="https://images.netcomlearning.com/ai-certs/icons/eye-bg.svg"
                                                                                layout='fill'
                                                                                objectFit='contain'
                                                                                alt='View Certificate'
                                                                            />
                                                                        </div>
                                                                    </td>
                                                                    <td>
                                                                        <div className='trigger-icons'>
                                                                            <Image
                                                                                src="https://images.netcomlearning.com/ai-certs/icons/download-bg.svg"
                                                                                layout='fill'
                                                                                objectFit='contain'
                                                                                alt='Download Certificate'
                                                                                onClick={() => handleDownloadPDF(detail.s3Url)}
                                                                            />
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </Table>
                                                </div>
                                            )}
                                        </div>
                                    </Col>
                                </Row>
                            </Container>
                        </div>
                    </div>
                </div>
            </div>

            {/* Preview Modal */}
            <Modal show={prevModal} onHide={closePrevCert} centered>
                <Modal.Body>
                    <div className="close-modal" onClick={closePrevCert}>
                        <Image
                            src="https://images.netcomlearning.com/ai-certs/icons/close-grey-bg.svg"
                            layout='fill'
                            objectFit='contain'
                            alt='Close'
                        />
                    </div>
                    <div className="prev-cert">
                        <Image
                            src={imageUrl}
                            layout='fill'
                            objectFit='cover'
                            alt="Certificate"
                        />
                    </div>
                    {/* <Button onClick={() => handleDownloadPDF(detailsArray)}>Download</Button> */}
                </Modal.Body>
            </Modal>

            {/* Loading Modal */}
            <Modal show={isLoading} centered>
                <Modal.Body>
                    <div className="certificate-loader">
                        <Image
                            src="/backgrounds/login-loading.gif"
                            layout='fill'
                            objectFit='contain'
                            alt="Loading"
                        />
                    </div>
                </Modal.Body>
            </Modal>

            {/* Success/Error Modal */}
            <Modal show={show} onHide={() => setShow(false)} centered>
                <Modal.Body>
                    {loginError ? (
                        <>
                            <div className="error-icon">
                                <Image
                                    src="/icons/close.svg"
                                    layout='fill'
                                    objectFit='contain'
                                    alt="Error"
                                />
                            </div>
                            <h3>{loginError}</h3>
                        </>
                    ) : (
                        <>
                            <div className="success-icon">
                                <Image
                                    src="/icons/success.gif"
                                    layout='fill'
                                    objectFit='contain'
                                    alt="Success"
                                />
                            </div>
                            <h3>{loginSuccess}</h3>
                        </>
                    )}
                    <button onClick={() => setShow(false)}>Ok</button>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default DownloadCertificate;
