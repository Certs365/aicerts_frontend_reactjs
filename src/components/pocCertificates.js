import React, { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import Image from 'next/image';
import { Col, Row, Modal, Button } from 'react-bootstrap';
import axios from 'axios';
import { PDFDocument } from 'pdf-lib'; 
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import data from "./data.json";
import download from '@/services/downloadServices';

const PocCertificates = ({ certificateData }) => {
  const certificates = certificateData?.urls || [];
  const [imageAvailability, setImageAvailability] = useState({});
  const [unavailableCertificates, setUnavailableCertificates] = useState(certificates);
  const [prevModal, setPrevModal] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const POLL_INTERVAL = 5000; // Poll every 5 seconds

  // Function to check if a URL is available
  const checkImageAvailability = async (url) => {
    try {
      // const response = await fetch(url, { method: 'GET' });
      // return response.ok; // True if the image is available (status code 200)
      download.imageAvailability(url, (response)=>{
        return response.ok;
      });
    } catch (error) {
      console.error('Error checking image availability:', error);
      return false; // Image is not available
    }
  };

  // Initial image availability check
  useEffect(() => {
    const checkAllImages = async () => {
      const availability = {};
      const unavailable = [];

      for (const url of certificates) {
        const isAvailable = await checkImageAvailability(url);
        availability[url] = isAvailable;
        if (!isAvailable) {
          unavailable.push(url);
        }
      }

      setImageAvailability(availability);
      setUnavailableCertificates(unavailable);
    };

    checkAllImages();
  }, [certificates]);

  // Poll unavailable certificates every 5 seconds
  useEffect(() => {
    const pollUnavailableCertificates = async () => {
      const newlyAvailableCertificates = [];
      for (const url of unavailableCertificates) {
        const isAvailable = await checkImageAvailability(url);
        if (isAvailable) {
          newlyAvailableCertificates.push(url);
          setImageAvailability((prev) => ({ ...prev, [url]: true }));
        }
      }

      // Remove newly available certificates from the unavailable list
      setUnavailableCertificates((prev) => 
        prev.filter((item) => !newlyAvailableCertificates.includes(item))
      );
    };

    const intervalId = setInterval(pollUnavailableCertificates, POLL_INTERVAL);
    return () => clearInterval(intervalId); // Clear interval on component unmount
  }, [unavailableCertificates]);

  const handlePrevCert = (url) => {
    setPrevModal(true);
    setImageUrl(url);
  };

  const closePrevCert = () => {
    setPrevModal(false);
    setImageUrl('');
  };

  const handleDownloadPDF = async (imageUrl) => {
    setLoading(true);
    try {
      const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
      const filename = imageUrl.split('/').pop().replace('.png', ''); 

      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([certificateData?.width || 792, certificateData?.height || 612]);
      const pngImage = await pdfDoc.embedPng(response.data);
      page.drawImage(pngImage, { x: 0, y: 0, width: certificateData?.width || 792, height: certificateData?.height || 612 });
      const pdfBytes = await pdfDoc.save();
      
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `${filename}.pdf`;
      link.click();
      window.URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error('Error downloading PDF:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadZIP = async () => {
    setLoading(true);
    const zip = new JSZip();

    for (const imageUrl of certificates) {
      try {
        const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        const filename = imageUrl.split('/').pop().replace('.png', '');
        
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage([certificateData?.width || 792, certificateData?.height || 612]);
        const pngImage = await pdfDoc.embedPng(response.data);
        page.drawImage(pngImage, { x: 0, y: 0, width: certificateData?.width || 792, height: certificateData?.height || 612 });

        const pdfBytes = await pdfDoc.save();
        zip.file(`${filename}.pdf`, pdfBytes);
      } catch (error) {
        console.error('Error adding PDF to ZIP:', error);
      }
    }

    try {
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      saveAs(zipBlob, 'Certificates.zip');
    } catch (error) {
      console.error('Error generating ZIP file:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-end mb-3">
        <Button className="global-button golden" onClick={handleDownloadZIP}>
          Download All Certificates
        </Button>
      </div>

      <Row className="d-flex flex-row justify-content-start">
        {certificates?.map((url, index) => (
          <Col key={index} xs={12} md={3}>
            <div className="prev-cert-card mb-3">
              <div className="cert-prev">
                {imageAvailability[url] === false ? (
                  <div className="image-container skeleton"></div>
                ) : (
                  <div
                    style={{
                      width: 250,
                      height: 220,
                      position: 'relative',
                      overflow: 'hidden',
                      border: '1px solid grey',
                      background: 'white',
                    }}
                  >
                    <Image
                      src={url}
                      layout="fill"
                      objectFit="contain"
                      alt={`Certificate ${index + 1}`}
                    />
                  </div>
                )}
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <div className="action-buttons d-flex" style={{ columnGap: '10px' }}>
                  <span
                    className="d-flex align-items-center"
                    style={{ columnGap: '10px' }}
                    onClick={() => handlePrevCert(url)}
                  >
                    <Image
                      src="https://images.netcomlearning.com/ai-certs/icons/eye-white-bg.svg"
                      width={16}
                      height={16}
                      alt="View Certificate"
                    />
                  </span>
                </div>
              </div>
            </div>
          </Col>
        ))}
      </Row>

      <Modal size="lg" centered className="preview-modal" show={prevModal} onHide={closePrevCert}>
        <Modal.Body>
          <div className="close-modal" onClick={closePrevCert}>
            <Image
              src="https://images.netcomlearning.com/ai-certs/icons/close-grey-bg.svg"
              layout="fill"
              objectFit="contain"
              alt="Close"
            />
          </div>
          <div className="prev-cert">
            <Image src={imageUrl} layout="fill" objectFit="contain" alt="Certificate" />
          </div>
          <div className="text-center mt-4">
            <Button className="global-button golden" onClick={() => handleDownloadPDF(imageUrl)}>
              Download
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      <Modal className="loader-modal" show={loading} centered>
        <Modal.Body>
          <div className="certificate-loader">
            <Image src="/backgrounds/login-loading.gif" layout="fill" objectFit="contain" alt="Loader" />
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default PocCertificates;
