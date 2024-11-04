// @ts-nocheck
import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import Button from '../../shared/button/button';
import { Container, Row, Col, Card, Modal } from 'react-bootstrap';
import Image from 'next/legacy/image';
import { useRouter } from 'next/router';
import fileDownload from 'react-file-download';
import SearchTab from "./SearchTab";
const iconUrl = process.env.NEXT_PUBLIC_BASE_ICON_URL;
const adminUrl = process.env.NEXT_PUBLIC_BASE_URL;
const generalError = process.env.NEXT_PUBLIC_BASE_GENERAL_ERROR;


const Upload = ({ page, setPage, certificates, setCertificates }) => {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedBatchFile, setSelectedBatchFile] = useState(null);
  const singleFileInputRef = useRef(null);
  const batchFileInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [show, setShow] = useState(false);
  const [user, setUser] = useState({});
  const [singleZip, setSingleZip] = useState(null);
  const [batchZip, setBatchZip] = useState(null);
  const [batchBlob, setBatchBlob] = useState(null);
  const [token, setToken] = useState(null);
  const [flag, setFlag] = useState(true);
  // State to track active tab
  const [activeTab, setActiveTab] = useState('single');
  const [selectedOption, setSelectedOption] = useState('250');

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };
  // Function to handle tab click
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleDownloadsample = () => {
    // Create a new anchor element
    const anchor = document.createElement('a');
    // Set the href attribute to the path of the file to be downloaded
    anchor.href = '/sample.zip';
    // Set the download attribute to the desired filename for the downloaded file
    anchor.download = 'sample';
    // Append the anchor element to the document body
    document.body.appendChild(anchor);
    // Trigger a click event on the anchor element to initiate the download
    anchor.click();
    // Remove the anchor element from the document body
    document.body.removeChild(anchor);
  };

  const handleClose = () => {
    setShow(false);
    // window.location.reload();
    setError("")
    setSuccess("")

  };
  const handleCloseSuccess = () => {
    setShow(false);
    setError("")
    setSuccess("")
  };

  useEffect(() => {
    // Check if the token is available in localStorage
    // @ts-ignore: Implicit any for children prop
    const storedUser = JSON.parse(localStorage.getItem('user'));

    if (storedUser && storedUser.JWTToken) {
      // If token is available, set it in the state
      setUser(storedUser)
      setToken(storedUser.JWTToken);

    } else {

    }
  }, []);

  const handleSingleDownload = async () => {

    if (singleZip) {
      setIsLoading(true);

      const fileData = new Blob([singleZip], { type: 'application/zip' }); // Change type to 'application/zip'
      await fileDownload(fileData, 'certificate.zip'); // Change file name to 'certificate.zip'
      setIsLoading(false);

    }

  };

  const handleBatchDownload = async () => {
    if (batchZip) {
      setPage(2)
    }
    else if (batchBlob) {
      const fileData = new Blob([batchBlob], { type: 'application/zip' });
      fileDownload(fileData, `Certificates.zip`);
    }
  };


  // @ts-ignore
  const handleFileChange = (event) => {

    const file = event.target.files[0];
    if (file) {
      const fileName = file.name;
      const fileType = fileName.split('.').pop(); // Get the file extension
      const fileSize = file.size / (1024 * 1024); // Convert bytes to MB for zip files
      if (
        fileType.toLowerCase() === 'zip' &&
        fileSize <= 100
      ) {
        setSelectedFile(file);
      } else {
        let message = '';
        if (fileType.toLowerCase() !== 'zip') {
          message = 'Only ZIP files are supported.';
        } else if (fileSize < 0.1) {
          message = 'File size should be at least 100KB.';
        } else if (fileSize > 150) {
          message = 'File size should be less than or equal to 150MB.';
        }
        // Notify the user with the appropriate message
        setError(message);
        setShow(true)
      }
    }
  };


  // @ts-ignore
  const handleFileBatchChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileName = file.name;
      const fileType = fileName.split('.').pop(); // Get the file extension
      const fileSize = file.size / (1024 * 1024); // Convert bytes to MB for zip files
      if (
        fileType.toLowerCase() === 'zip' &&
        fileSize >= 0.1 && // Minimum size is 0.1 MB (100KB)
        fileSize <= 100 // Maximum size is 100 MB
      ) {
        setSelectedBatchFile(file);
      } else {
        let message = '';
        if (fileType.toLowerCase() !== 'zip') {
          message = 'Only ZIP files are supported.';
        } else if (fileSize < 0.1) {
          message = 'File size should be at least 100KB.';
        } else if (fileSize > 150) {
          message = 'File size should be less than or equal to 100MB.';
        }
        // Notify the user with the appropriate message
        setError(message);
        setShow(true)
      }
    }
  };




  const handleSingleClick = () => {
    // @ts-ignore
    singleFileInputRef.current.click();
  };

  const handleBatchClick = () => {
    // @ts-ignore
    batchFileInputRef.current.click();
  };



  // Get the data from the API
  const issueSingleCertificates = async () => {
    try {

      setIsLoading(true)
      // Construct FormData for file upload
      const formData = new FormData();
      formData.append('email', user?.email);
      formData.append('zipFile', selectedFile);
      formData.append('flag', flag ? 0 : 1);

      // Make API call
      const response = await fetch(`${adminUrl}/api/dynamic-batch-issue`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData
      }
      );


      if (response && response.ok) {

        if (flag) {
          const data = await response.json();
          setBatchZip(data);
          setSuccess("Certificates Successfully Generated")
          setShow(true);
          if (data?.details) {
            setCertificates(data?.details);
          }
        } else {
          const blob = await response.blob();
          setBatchBlob(blob);
        }



      } else if (response) {

        const responseBody = await response.json();

        const errorMessage = responseBody && responseBody.message ? responseBody.message : generalError;
        setError(errorMessage);
        setShow(true);
      }
    }

    catch (error) {
      let errorMessage = generalError;
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      }

      setError(errorMessage);
      setShow(true);
    } finally {
      setIsLoading(false);
    }
  };

  const issueBatchCertificates = async () => {
    try {
      setIsLoading(true)
      // Construct FormData for file upload
      const formData = new FormData();

      formData.append('email', user?.email);
      formData.append('zipFile', selectedBatchFile);

      // Make API call
      const response = await fetch(`${adminUrl}/api/bulk-batch-issue`, {
        method: 'POST',
        body: formData
      }
      );



      if (response && response.ok) {
        const data = await response.json();
        setBatchZip(data);
        setSuccess("Certificates Successfully Generated")
        setShow(true);
        if (data?.details) {
          setCertificates(data?.details);
        }

      } else if (response) {
        const responseBody = await response.json();
        const errorMessage = responseBody && responseBody.message ? responseBody.message : generalError;
        setError(errorMessage);
        setShow(true);
      }

    }

    catch (error) {
      let errorMessage = generalError;
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      }

      setError(errorMessage);
      setShow(true);
    } finally {
      setIsLoading(false)
    }
  };

  return (
    <>
      <Container className='dashboard pb-5'>
        <div className='download-sample d-block d-md-flex justify-content-between align-items-center text-center'>
          <div className='tagline mb-3 mb-md-0'>Please refer to our Sample file for upload.</div>
          <Button label="Download Sample &nbsp; &nbsp;" className='golden position-relative' onClick={handleDownloadsample} />
        </div>
        <Row>
          <Col xs={12} md={8}>
            <div className='bulk-upload'>
              <h3 className='page-title'>Batch Issuance with Dynamic QR Positioning</h3>
              <input checked={flag} onChange={() => { setFlag(!flag) }} type='checkbox' />
              <label>Show Certification in Galley</label>
              <h5 className='mt-3 mb-2'>Select Issuance Type </h5>
              <div className='d-flex flex-column'>
                <label>
                  <input
                    className='me-2'
                    type="radio"
                    value="250"
                    checked={selectedOption === '250'}
                    onChange={handleOptionChange}
                  />
                  250 issues
                </label>

                <label>
                  <input
                    className='me-2'
                    type="radio"
                    value="more-than-250"
                    checked={selectedOption === 'more-than-250'}
                    onChange={handleOptionChange}
                  />
                  Upto 2000 Issues
                </label>
              </div>
              <div className="tab-content" id="uploadTabContent">
                {/* Single Tab */}
                <div className={`tab-pane fade ${activeTab === 'single' ? 'show active' : ''}`} id="single" role="tabpanel" aria-labelledby="single-tab">
                  <div className='browse-file text-center'>
                    <div className='download-icon position-relative'>
                      <Image
                        src={`${iconUrl}/cloud-upload.svg`}
                        layout='fill'
                        objectFit='contain'
                        alt='Upload icon'
                      />
                    </div>
                    <h4 className='tagline'>Upload your certification zip file here.</h4>
                    <input type="file" ref={singleFileInputRef} onChange={handleFileChange} hidden accept=".zip" />
                    <Button label="Choose File" className='outlined' onClick={handleSingleClick} />
                    {selectedFile && (
                      <div>
                        <p className='mt-4'>{selectedFile?.name}</p>
                        <Button label="Validate and Issue" className='golden' onClick={issueSingleCertificates} />
                      </div>
                    )}
                    <div className='restriction-text'>Only <strong>zip</strong> is supported. <br />(Upto 150MB)</div>
                    {batchZip && flag && (
                      <Button onClick={handleBatchDownload} label="Show Certification" className="golden mt-2" disabled={isLoading} />
                    )}
                    {batchBlob && (
                      <Button onClick={handleBatchDownload} label="Download Certification Zip" className="golden mt-2" disabled={isLoading} />
                    )}

                  </div>
                </div>

                <div className={`tab-pane fade ${activeTab === 'search' ? 'show active' : ''}`} id="batch" role="tabpanel" aria-labelledby="batch-tab">
                  <SearchTab />
                </div>
              </div>
            </div>
          </Col>
          <Col xs={12} md={4}>
            <div className="steps-container">
              <h2>Steps to Follow:</h2>
              <ol className="steps-list">
                <li>Download the sample ZIP file after locking the QR code position. Extract the contents and edit the existing Excel and PDF files or create new ones, ensuring accurate credential details.</li>
                <li>Ensure the documentName in the Excel file matches the PDF filenames exactly. Use the correct date format (MM/DD/YYYY). There are three mandatory fields and five optional with key value pair to map.
                </li>
                <li>Confirm that each PDF is between 100KB and 500KB in size and meets the minimum dimensions of 74mm width and 105mm height. Ensure the total ZIP file size does not exceed 150MB.
                </li>
                <li>Verify that all PDFs are correctly named and the Excel file is formatted properly before creating a ZIP file that contains all relevant files.
                </li>
                <li>Upload the ZIP file and click Validate and Issue. Wait for the process to complete, ensuring you do not refresh or navigate away until confirmation appears.
                </li>
                <li> After successful issuance, download individual certificates or all certificates as a ZIP file. If enabled, use the Show Certification button to view generated certificates. </li>
              </ol>
              <div className="note">
                <strong>Note:</strong> This process may take some time. Please do not refresh or press the back button until it completes.
              </div>
            </div>
          </Col>

        </Row>
      </Container>

      {/* Loading Modal for API call */}
      <Modal className='loader-modal' show={isLoading} centered>
        <Modal.Body style={{ display: "flex", flexDirection: "column", textAlign: "center" }}>
          <div className='certificate-loader'>
            <Image
              src="/backgrounds/login-loading.gif"
              layout='fill'
              objectFit='contain'
              alt='Loader'
            />
          </div>
          <p>Please dont reload the Page. It may take a few minutes.</p>
        </Modal.Body>
      </Modal>

      <Modal className='loader-modal text-center' show={show} centered onHide={handleClose}>
        <Modal.Body className='p-5'>
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
              <h3 className='text' style={{ color: '#ff5500' }}>{error}</h3>
              <button className='warning' onClick={handleClose}>Ok</button>
            </>
          )}
          {success && (
            <>
              <div className='error-icon'>
                {/* Use a success icon */}
                <Image
                  src="/icons/success.gif"
                  layout='fill'
                  objectFit='contain'
                  alt='Loader'
                />
              </div>
              <h3 style={{ color: 'green' }}>{success}</h3>
              <button className='success' onClick={handleCloseSuccess}>Ok</button>
            </>
          )}
        </Modal.Body>
      </Modal>
    </>

  )
}


export default Upload
