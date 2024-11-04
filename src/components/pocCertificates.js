import React, { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import Image from 'next/image';
import { Col, Row, Modal, Button } from 'react-bootstrap';
import axios from 'axios';
import { PDFDocument } from 'pdf-lib';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';


const PocCertificates = ({ certificateData }) => {
  const certificates = certificateData && certificateData?.urls
  const [visibleCertificates, setVisibleCertificates] = useState(certificates);
  const [page, setPage] = useState(1);
  const [prevModal, setPrevModal] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [singleDetail, setSingleDetail] = useState(null);
  const { ref, inView } = useInView({ threshold: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState('');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const loadMoreCertificates = () => {
      const newCertificate = certificates[page - 1];

      // Check if the new certificate is already in the visible certificates array
      if (newCertificate && !visibleCertificates.includes(newCertificate)) {
        setVisibleCertificates((prev) => [...prev, newCertificate]);
        setPage((prev) => prev + 1);
      }
    };

    if (inView) {
      loadMoreCertificates();
    }
  }, [inView, page, certificates, visibleCertificates]);


  const handleClose = () => {
    setShow(false);
  };

  const handlePrevCert = (url) => {
    setPrevModal(true);
    setImageUrl(url);
  };

  const closePrevCert = () => {
    setPrevModal(false);
    setImageUrl('');
  };

  const handleDownloadPDF = async (imageUrl) => {
    setLoading(true)

    try {
      const response = await axios.get(imageUrl, {
        responseType: 'arraybuffer' // Ensure response is treated as an ArrayBuffer
      });

      // Extract the certificate name from the URL
      const filename = imageUrl.split('/').pop(); // Get the last part after '/'
      const certificateName = filename.replace('.png', '');

      const pdfDoc = await PDFDocument.create();
      // Adjust page dimensions to match the typical horizontal orientation of a certificate
      const page = pdfDoc.addPage([certificateData?.width || 792, certificateData?.height || 612]); // Letter size page (11x8.5 inches)

      // Embed the image into the PDF
      const pngImage = await pdfDoc.embedPng(response.data);
      // Adjust image dimensions to fit the page
      page.drawImage(pngImage, {
        x: 0,
        y: 0,
        width: certificateData?.width || 792, // Width of the page
        height: certificateData?.height || 612, // Height of the page
      });

      const pdfBytes = await pdfDoc.save();

      // Create a blob containing the PDF bytes
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });

      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob);

      // Create a link element to trigger the download
      const link = document.createElement('a');
      link.href = url;
      link.download = `${certificateName}.pdf`; // Set the filename for download
      link.click();

      // Revoke the URL to release the object URL
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      // Handle error state appropriately
    } finally {
      setLoading(false)

    }
  };



  const handleDownloadZIP = async () => {
    setLoading(true);
    const zip = new JSZip();

    for (const [index, imageUrl] of certificates.entries()) {
      try {
        const response = await axios.get(imageUrl, {
          responseType: 'arraybuffer',
        });

        // Extract the certificate name from the URL
        const filename = imageUrl.split('/').pop(); // Get the last part after '/'
        const certificateName = filename.replace('.png', ''); // Remove the '.png' extension

        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage([certificateData?.width || 792, certificateData?.height || 612]);

        const pngImage = await pdfDoc.embedPng(response.data);
        page.drawImage(pngImage, {
          x: 0,
          y: 0,
          width: certificateData?.width || 792,
          height: certificateData?.height || 612,
        });

        const pdfBytes = await pdfDoc.save();

        // Use the certificate name when saving the file in the ZIP
        zip.file(`${certificateName}.pdf`, pdfBytes);
      } catch (error) {
        console.error('Error converting and adding PDF to ZIP:', error);
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
      <div className='d-flex justify-content-end mb-3'>
        <Button className='global-button golden' onClick={handleDownloadZIP}>
          Download All Certificates
        </Button>
      </div>

      <Row className='d-flex flex-row justify-content-start '>
        {visibleCertificates?.map((url, index) => (
          <Col key={index} xs={12} md={3}>
            <div className='prev-cert-card mb-3'>
              <div className='cert-prev' >
                {
                  isLoading ?
                    <div className="image-container skeleton"></div>
                    :
                    <div style={{ width: 250, height: 220, position: 'relative', overflow: 'hidden', border: "1px solid grey", background: "white" }}>
                      <Image
                        src={url}
                        layout="fill"
                        objectFit="contain"
                        alt={`Certificate ${index + 1}`}
                      />
                    </div>
                }


              </div>
              <div className='d-flex justify-content-between align-items-center'>
                {/* <Form.Group controlId={`Certificate ${index + 1}`}>
                <Form.Check
                  type="checkbox"
                  checked={checkedItems[index] || false}
                  onChange={(event) => handleCheckboxChange(event, index)}
                />
              </Form.Group> */}

                <div className='action-buttons d-flex' style={{ columnGap: "10px" }} >
                  <span className='d-flex align-items-center' style={{ columnGap: "10px" }} onClick={() => handlePrevCert(url)}>
                    <Image
                      src="https://images.netcomlearning.com/ai-certs/icons/eye-white-bg.svg"
                      width={16}
                      height={16}
                      alt='View Certificate'
                    />
                  </span>
                  <span className='d-flex align-items-center' style={{ columnGap: "10px" }}
                    onClick={() => handleDownloadPDF(url)}>
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
        <div ref={ref} style={{ height: 1 }} />
      </Row>

      <Modal
        size="lg"
        centered
        className='preview-modal'
        show={prevModal}
        onHide={closePrevCert}
      >
        <Modal.Body>
          <div className='close-modal' onClick={closePrevCert}>
            <Image
              src="https://images.netcomlearning.com/ai-certs/icons/close-grey-bg.svg"
              layout='fill'
              objectFit='contain'
              alt='Close'
            />
          </div>
          <div className='prev-cert'>
            <Image
              src={imageUrl}
              layout='fill'
              objectFit='contain'
              alt='Certificate'
            />
          </div>
          <div className='text-center mt-4'>
            <Button className='global-button golden' onClick={() => handleDownloadPDF(imageUrl)}>Download</Button>

          </div>
        </Modal.Body>
      </Modal>
      <Modal className='loader-modal' show={loading} centered>
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
          {loginError !== '' ? (
            <>
              <div className='error-icon'>
                <Image
                  src="/icons/close.svg"
                  layout='fill'
                  objectFit='contain'
                  alt='Loader'
                />
              </div>
              <h3 style={{ color: '#ff5500' }}>{loginError}</h3>
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
              <h3 style={{ color: '#CFA935' }}>{loginSuccess}</h3>
              <button className='success' onClick={handleClose}>Ok</button>
            </>
          )}


        </Modal.Body>
      </Modal>
    </div>
  );
};

export default PocCertificates;
