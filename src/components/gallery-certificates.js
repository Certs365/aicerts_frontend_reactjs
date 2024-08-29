import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Modal, Spinner } from 'react-bootstrap';
import AWS from "../config/aws-config"

import axios from 'axios';
import { PDFDocument } from 'pdf-lib'; 


const GalleryCertificates = ({ certificatesData }) => {
    const [isImageLoading, setIsImageLoading] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [filteredCertificatesArray, setFilteredCertificatesArray] = useState(certificatesData || []);
    const [thumbnailUrls, setThumbnailUrls] = useState([]);
    
    const generatePresignedUrl = async (key) => {
        const s3 = new AWS.S3({
            accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
            region: process.env.NEXT_PUBLIC_AWS_REGION
        });
        const params = {
            Bucket: process.env.NEXT_PUBLIC_BUCKET,
            Key: key,
            Expires: 3600,
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
        const fetchThumbnails = async () => {
            setIsImageLoading(true);
            const urls = await Promise.all(
                certificatesData.map(async (certificate) => {
                    if (certificate.url) {
                        
                        return certificate
                    }
                    return null;
                })
            );
            const validCertificates = urls.filter(url => url !== null);
            setThumbnailUrls(validCertificates);
            setIsImageLoading(false);
        };
        fetchThumbnails();
    }, [certificatesData]);

    const handleDownloadPDF = async (imageUrl, certificateNumber) => {
        setIsLoading(true); // Set loading state to true when starting the download
        
        try {
            const response = await axios.get(imageUrl, {
                responseType: 'arraybuffer' // Ensure response is treated as an ArrayBuffer
            });
            
            const pdfDoc = await PDFDocument.create();
            // Adjust page dimensions to match the typical horizontal orientation of a certificate
            const page = pdfDoc.addPage([792, 612]); // Letter size page (11x8.5 inches)
            
            // Embed the image into the PDF
            const pngImage = await pdfDoc.embedPng(response.data);
            // Adjust image dimensions to fit the page
            page.drawImage(pngImage, {
                x: 0,
                y: 0,
                width: 792, // Width of the page
                height: 612, // Height of the page
            });
            
            const pdfBytes = await pdfDoc.save();
            
            // Create a blob containing the PDF bytes
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            
            // Create a URL for the blob
            const url = window.URL.createObjectURL(blob);
            
            // Create a link element to trigger the download
            const link = document.createElement('a');
            link.href = url;
            link.download = `${certificateNumber}.pdf`; // Set the filename for download
            link.click();
            
            // Revoke the URL to release the object URL
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading PDF:', error);
            // Handle error state appropriately
        } finally {
            setIsLoading(false); // Reset loading state when finished, whether succeeded or failed
        }
    };
    
    return (
        <div className='cert-container' >
        <Container  fluid className="my-4">
            {thumbnailUrls.length === 0 ? (
                <div style={{width:"70vw"}} className='no-cert-found'>
                    <h3 className="text-center m-5">No Certification found</h3>
                </div>
            ) : (
                <Row className='d-flex flex-row justify-content-start'>
                    {thumbnailUrls.map((detail, index) => (
                        <Col key={index} className="mb-4 mx-4" style={{ maxWidth: '250px' }}>
                            <div className='prev-cert-card' style={{ width: '100%' }}>
                                <div className='cert-prev'>
                                    {isImageLoading ? (
                                        <div className="image-container">
                                            <Spinner animation="border" />
                                        </div>
                                    ) : (
                                        <Image
                                            src={detail?.url}
                                            width={250}
                                            height={220}
                                            objectFit='contain'
                                            alt={`Certificate ${index + 1}`}
                                            onLoadingComplete={() => setIsImageLoading(false)}
                                            onLoad={() => setIsImageLoading(true)}
                                        />
                                    )}
                                </div>
                                <div className='d-flex justify-content-between align-items-center' style={{ width: '250px' }}>
                                    <Form.Group controlId={`Certificate${index}`}>
                                        <Form.Check
                                            type="checkbox"
                                            label={detail.certificateNumber && detail.certificateNumber.toString().length > 5
                                                ? `${detail.certificateNumber.toString().substring(0, 5)}...`
                                                : detail.certificateNumber}
                                        />
                                    </Form.Group>
                                    <div className='action-buttons d-flex' style={{ columnGap: "10px" }}>
                                        <span style={{ padding: "10px", backgroundColor: "#CFA935", cursor: "pointer" }} className='icon-download-container d-flex align-items-center'
                                            onClick={() => handleDownloadPDF(detail.url, detail.certificateNumber)}>
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
            )}

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
        </Container>
        </div>
    );
}

export default GalleryCertificates;
