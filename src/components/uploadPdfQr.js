// @ts-nocheck
import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import Button from '../../shared/button/button';
import { Container, Row, Col, Modal, ProgressBar } from 'react-bootstrap';
import Image from 'next/legacy/image';
import { useRouter } from 'next/router';
import { PDFDocument } from 'pdf-lib';

const iconUrl = process.env.NEXT_PUBLIC_BASE_ICON_URL;

/**
 * @typedef {object} CertificateDisplayPageProps
 * @property {string} [cardId] - The ID of the selected card.
 */

/**
 * CertificateDisplayPage component.
 * @param {CertificateDisplayPageProps} props - Component props.
 * @returns {JSX.Element} - Rendered component.
 */

const UploadPdfQr = ({ cardId, setSelectedFile, selectedFile, setShowPdf }) => {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [now, setNow] = useState(0);

  const handleClose = () => {
    setShow(false);
    setError("")
    // window.location.reload();
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileReader = new FileReader();
      fileReader.onload = async (e) => {
        const arrayBuffer = e.target.result;
        const pdfDoc = await PDFDocument.load(new Uint8Array(arrayBuffer));
        const pages = pdfDoc.getPages();
        const { width, height } = pages[0].getSize();

        const mmWidth = width * 0.3528; // Convert points to mm
        const mmHeight = height * 0.3528; // Convert points to mm

        if (mmWidth > 74 && mmHeight > 105) {
          setSelectedFile(file);
        } else {
          setError('PDF size must be greater than (74x105 mm).');
          setShow(true);
        }
      };
      fileReader.readAsArrayBuffer(file);
    }
  };

  return (
    <>
      <div className='dashboard pt-0 pb-5' >
        <Container>
          <Row>
            <Col xs={12} md={12}>
              <div className='bulk-upload'>
                <div className='browse-file text-center'>
                  <div className='download-icon position-relative'>
                    <Image
                      src={`${iconUrl}/cloud-upload.svg`}
                      layout='fill'
                      objectFit='contain'
                      alt='Upload icon'
                    />
                  </div>
                  <h4 className='tagline'>Upload your batch issue certification file here.</h4>
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} hidden accept="application/pdf" />
                  <Button label="Choose File" className='outlined' onClick={handleClick} />
                  {selectedFile && (
                    <div>
                      <p className='mt-4'>{selectedFile?.name}</p>
                    </div>
                  )}
                  <div className='restriction-text'>Only <strong>PDF</strong> is supported. <br />(100KB - 5MB)</div>
                </div>
              </div>
            </Col>
          </Row>
          <div className='d-flex justify-content-end mt-2 next-btn-container'>
            <Button label="Next" disabled={!selectedFile} className='golden' onClick={() => { setShowPdf(true); }} />
          </div>
        </Container>
      </div>
      {/* Loading Modal for API call */}
      <Modal className='loader-modal' show={isLoading} centered>
        <Modal.Body style={{ display: "flex", flexDirection: "column", textAlign: "center" }}>
          <div className='certificate-loader'>
            <Image
              src="/icons/create-certificate.gif"
              layout='fill'
              objectFit='contain'
              alt='Loader'
            />
          </div>
          <div className='text'>Issuing the batch certificates.</div>
          <ProgressBar now={now} label={`${now}%`} />
        </Modal.Body>
      </Modal>

      <Modal className='loader-modal text-center' show={show} centered onHide={handleClose}>
        <Modal.Body style={{ minHeight: "500px" }}>
          {error && (
            <>
              <div className='error-icon'>
                <Image
                  src="/icons/invalid-password.gif"
                  layout='fill'
                  objectFit='contain'
                  alt='Loader'
                />
              </div>
              <div className='text' style={{ color: '#ff5500' }}>{error}</div>
              <div className='d-flex flex-row flex-wrap text-cert-wrapper'></div>
              <button className='warning' onClick={handleClose}>Ok</button>
            </>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

UploadPdfQr.propTypes = {
  cardId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ])
};

export default UploadPdfQr;
