// @ts-nocheck
import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import Button from '../../shared/button/button';
import { Container, Row, Col, Card, Modal, ProgressBar } from 'react-bootstrap';
import Image from 'next/legacy/image';
import { useRouter } from 'next/router'; 
import { useContext } from 'react';
import CertificateContext from "../utils/CertificateContext"
import { UpdateLocalStorage } from '../utils/UpdateLocalStorage';
import download from '@/services/downloadServices';
import certificate from '../services/certificateServices';

const iconUrl = process.env.NEXT_PUBLIC_BASE_ICON_URL;
const adminApiUrl = process.env.NEXT_PUBLIC_BASE_URL_admin;
const apiUrl = process.env.NEXT_PUBLIC_BASE_URL_USER;

/**
 * @typedef {object} CertificateDisplayPageProps
 * @property {string} [cardId] - The ID of the selected card.
 */

/**
 * CertificateDisplayPage component.
 * @param {CertificateDisplayPageProps} props - Component props.
 * @returns {JSX.Element} - Rendered component.
 */

const CertificateDisplayPage = ({ cardId }) => {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const [token, setToken] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setsuccess] = useState(null);
  const [show, setShow] = useState(false);
  const [now, setNow] = useState(0);
  const [details, setDetails] = useState(null);
  const { badgeUrl,pdfBatchDimentions, certificateUrl, logoUrl, signatureUrl, issuerName, issuerDesignation, certificatesData, setCertificatesDatasetBadgeUrl, setIssuerName, setissuerDesignation, setCertificatesData, setSignatureUrl, setBadgeUrl, setLogoUrl, setPdfDimentions } = useContext(CertificateContext);
  const {certificatePath, isDesign,templateId} = router.query;
  useEffect(() => {
    sessionStorage.removeItem('certificatesList');
    // Check if the token is available in localStorage
    const storedUser = JSON.parse(localStorage.getItem('user'));

    if (storedUser && storedUser.JWTToken && storedUser.email) {
      // If token is available, set it in the state
      setToken(storedUser.JWTToken);
      setUserEmail(storedUser.email)
    } else {
      // If token is not available, redirect to the login page
      // router.push('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

 /* eslint-disable */
  useEffect(() => {
    const fetchPlaceholders = async () => {
        try {
            const response = await fetch(`${apiUrl}/api/get-certificate-template/${templateId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                console.error('Network response was not ok');
                // throw new Error('Network response was not ok');
            }

            const data = await response.json(); // Parse the JSON data
            setPdfDimentions(data?.data?.dimentions); // Update state with the fetched data
            console.log('Placeholders fetched successfully:', data);
        } catch (error) {
            console.error('Error fetching placeholders:', error);
        }
    };
  if(cardId){

    fetchPlaceholders(); // Call the function to fetch data on component mount
  }
}, []);
/* eslint-disable */
  useEffect(() => {
    // Function to retrieve data from session storage and set local state
    const retrieveDataFromSessionStorage = () => {
      const badgeUrlFromStorage = JSON.parse(sessionStorage.getItem("badgeUrl"));
      const logoUrlFromStorage = JSON.parse(sessionStorage.getItem("logoUrl"));
      const signatureUrlFromStorage = JSON.parse(sessionStorage.getItem("signatureUrl"));
      const issuerNameFromStorage =sessionStorage.getItem("issuerName");
      const issuerDesignationFromStorage = sessionStorage.getItem("issuerDesignation");
      if (badgeUrlFromStorage) {
        setBadgeUrl(badgeUrlFromStorage.url)
        // setBadgeFileName(badgeUrlFromStorage.fileName)
      };
      if (logoUrlFromStorage){
        setLogoUrl(logoUrlFromStorage.url);
        // setLogoFileName(logoUrlFromStorage.fileName)

      } 
      if (signatureUrlFromStorage){
        setSignatureUrl(signatureUrlFromStorage.url);
        // setSignatureFileName(signatureUrlFromStorage.fileName)
      } 
      if (issuerNameFromStorage){
        setIssuerName(issuerNameFromStorage);
      } 
      if (issuerDesignationFromStorage){
        setissuerDesignation(issuerDesignationFromStorage);
      } 
    };

    retrieveDataFromSessionStorage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelectTemplate = () => {
    router.push('/certificate');
  }

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

  const handleClose = () => {
    setShow(false);
    window.location.reload();
    setError("")
    setsuccess("")
  };

  const handleSuccessClose = () => {
    setShow(false);
    // router.push('/certificate/download');
  };

  // @ts-ignore
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileName = file.name;
      const fileType = fileName.split('.').pop(); // Get the file extension
      const fileSize = file.size / 1024; // Convert bytes to KB
      if (
        fileType.toLowerCase() === 'xlsx' &&
        fileSize >= 10 &&
        fileSize <= 50
      ) {
        setSelectedFile(file);
      } else {
        let message = '';
        if (fileType.toLowerCase() !== 'xlsx') {
          message = 'Only XLSX files are supported.';
        } else if (fileSize < 10) {
          message = 'File size should be at least 10KB.';
        } else if (fileSize > 50) {
          message = 'File size should be less than or equal to 50KB.';
        }
        // Notify the user with the appropriate message
        setError(message);
        setShow(true)
      }
    }
  };  

  const handleClick = () => {
    // @ts-ignore
    fileInputRef.current.click();
  };

  function truncateMessage(message, wordLimit) {
    const words = message.split(/[\s,]+/);
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(' ') + '...';
    }
    return message;
  }
  
  // Get the data from the API
  const issueCertificates = async () => {
    let progressInterval;

    const startProgress = () => {
        progressInterval = setInterval(() => {
            setNow((prev) => {
                if (prev < 90) return prev + 5;
                return prev;
            });
        }, 100);
    };

    const stopProgress = () => {
        clearInterval(progressInterval);
        setNow(100); // Progress complete
    };

    try {
        setIsLoading(true);
        setNow(10);

        // Construct FormData for file upload
        const formData = new FormData();
        formData.append('email', userEmail);
        formData.append('excelFile', selectedFile);
        
        if (!isDesign) {
            formData.append('templateUrl', new URL(certificateUrl || certificatePath)?.origin + new URL(certificateUrl)?.pathname);
            formData.append('logoUrl', new URL(logoUrl)?.origin + new URL(logoUrl)?.pathname);
            formData.append('signatureUrl', new URL(signatureUrl)?.origin + new URL(signatureUrl)?.pathname);
            formData.append('badgeUrl', badgeUrl ? new URL(badgeUrl)?.origin + new URL(badgeUrl)?.pathname : null);
            formData.append('issuerName', issuerName);
            formData.append('issuerDesignation', issuerDesignation);
        }

        startProgress();

        // Make API call
        certificate.batchCertificateIssue(formData, async (response) => {
            const responseData = response;
            console.log(response);
            if(response.status == "SUCCESS"){
                setCertificatesData(responseData);
                sessionStorage.setItem("certificatesList", JSON.stringify(responseData));
                setResponse(responseData);
                
                // Generate images and upload to S3
                await Promise.all(responseData.data.details.map((detail, index) =>
                    generateAndUploadImage(index, detail, responseData.message, responseData.polygonLink, responseData.status)
                ));

                await UpdateLocalStorage();

                router.push({
                    pathname: '/certificate/download',
                    query: { isDesign: isDesign, templateId: templateId }
                });
            } else {
                const responseData  = response.error.response.data;
                let errorMessage;
                if (typeof responseData.details === 'string') {
                    if(responseData.message == "Issuer restricted to perform service") {
                        errorMessage = `Issuer restricted to perform service`;
                    } else {
                        errorMessage = `Error at ${truncateMessage(responseData.details, 7)}`;
                    }
                } else if (typeof responseData.message === 'string') {
                    errorMessage = truncateMessage(responseData.message, 7);
                } else {
                    errorMessage = 'Something went wrong';
                }

                setError(errorMessage);
                setShow(true);
                setDetails(Array.isArray(responseData?.details) ? responseData.details : []);
            }
            
            // Stop progress and loading only after everything is complete
            stopProgress();
            setIsLoading(false);
        });

    } catch (error) {
        console.error('Error issuing certificates:', error);
        setError('An unexpected error occurred.');
        setShow(true);
    }
};


const generateAndUploadImage = async (index, detail, message, polygonLink, status) => {
    try {
          
        // Generate the image
        const blob = await handleShowImages(index, detail, message, polygonLink, status);
         
        // Upload the image to S3
        const certificateNumber =detail.certificateNumber
        await uploadToS3(blob,certificateNumber );
         

    } catch (error) {
        console.error('Error generating or uploading image:', error);
    }
};

const handleShowImages = async (index, detail, message, polygonLink, status) => {
  let url = '/api/downloadImage';
  let certificateUrl = certificatePath; // Start with certificatePath as the default
  const requestBody = {
      detail,
      message,
      polygonLink,
      status,
      certificateUrl,
      badgeUrl,
      logoUrl,
      signatureUrl,
      issuerName,
      issuerDesignation,
      pdfBatchDimentions
  };

  // Conditionally add certificatePdfDimentions if isDesign is true
  if (isDesign) {
      url = '/api/downloadDesignImage';
      requestBody.pdfBatchDimentions = pdfBatchDimentions; // Assuming this is defined
  }

  try {
     const res = await fetch(url, {
         method: 'POST',
         headers: {
             'Content-Type': 'application/json',
         },
         body: JSON.stringify(requestBody),
     });

     if (res.ok) {
         const blob = await res.blob();
         return blob; // Return blob for uploading
     } else {
         console.error('Failed to generate image:', res.statusText);
        //  throw new Error('Image generation failed');
     }
  } catch (error) {
     console.error('Error generating image:', error);
     throw error;
  }
};


const uploadToS3 = async (blob, certificateNumber) => {
  const retryLimit = parseInt(process.env.RETRY_LIMIT_BATCH_UPLOAD || "3"); // Default to 3 retries if RETRY_LIMIT is not set
  let attempt = 0;
  let success = false;
   

  while (attempt < retryLimit && !success) {
      try {
          // Increment attempt count
          attempt++;

          // Create a new FormData object
          const formCert = new FormData();
          // Append the blob to the form data
          formCert.append('file', blob);
          // Append additional fields
          formCert.append('certificateNumber', certificateNumber);
          formCert.append('type', 3);

          // Make the API call to send the form data
          // const uploadResponse = await fetch(`${adminApiUrl}/api/upload-certificate`, {
          //     method: 'POST',
          //     body: formCert
          // });
          // console.log(uploadResponse);
          // if (uploadResponse.ok) {
          // If successful
          // success = true;
          //  }
          // if (!uploadResponse.ok) {
          //     throw new Error(`Failed to upload certificate to S3 on attempt ${attempt}`);
          // }
          certificate.apiuploadCertificate(formCert, async (response) => {
             
            if(response.status != 'SUCCESS'){
              console.log(`Failed to upload certificate to S3 on attempt ${attempt}`);
            }
            success = true;
          })
      } catch (error) {
          console.error(`Error uploading to S3 on attempt ${attempt}:`, error);
          // If max retries are reached
          if (attempt >= retryLimit) {
              console.error(`Max retries reached for certificate: ${certificateNumber}`);
          }
      }
  }
};


  

  const parsedCardId = typeof cardId === 'string' ? parseInt(cardId) : cardId || 0;
  //const certificateUrl = `https://images.netcomlearning.com/ai-certs/Certificate_template_${parsedCardId + 1}.png`;

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
                          alt={`Certificate ${parsedCardId + 1}`} />
                      </div>
                      <Button label="Select Another Template" className='outlined btn-select-template' onClick={handleSelectTemplate} />
                    </Card.Body>
                  </Card>
                </Col>
                <Col xs={12} md={8}>
                  <div className='bulk-upload'>
                    <div className='download-sample d-block d-md-flex justify-content-between align-items-center text-center'>
                      <div className='tagline mb-3 mb-md-0'>Please refer to our sample file for batch upload.</div>
                      <Button label="Download Sample &nbsp; &nbsp;" className='golden position-relative' onClick={handleDownloadSample} />
                    </div>
                    <div  style={{position:"relative"}}className='browse-file text-center'>
                      <h6 style={{position:"absolute", top:"10px", left:"10px", color:"gray"}}>
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
                      <Button label="Choose File" className='outlined' onClick={handleClick} />
                      {selectedFile && (
                        <div>
                          <p className='mt-4'>{selectedFile?.name}</p>
                          <Button label="Validate and Issue" className='golden'
                            onClick={() =>
                              issueCertificates()
                            }
                          />
                        </div>
                      )}
                      <div className='restriction-text'>Only <strong>XLSX</strong> is supported. <br/>(10KB - 50KB)</div>
                    </div>
                  </div>
                </Col>
              </Row>
            </Container>
          </div>
        </div>
      </div>
      {/* Loading Modal for API call */}
      <Modal className='loader-modal' show={isLoading} centered>
          <Modal.Body style={{display:"flex" , flexDirection:"column",textAlign:"center"}}>
              <div  className='certificate-loader'>
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

      <Modal  className='loader-modal text-center' show={show} centered onHide={handleClose}>
    <Modal.Body    >
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
                <div className='text' style={{ color: '#ff5500', whiteSpace: 'normal', wordWrap: 'break-word' }}>{error}</div>

                <div className='d-flex flex-row align-items-center flex-wrap text-cert-wrapper mb-3'>
                    {details?.length > 1 && (
                        details?.slice(0, 10).map((cert, index) => (
                          <>
                            <div key={index} className='cert-number'>{cert}</div>
                            <span>|</span>
                            </>

                        ))
                    )}
                </div>   
                <button className='warning' onClick={handleClose}>Ok</button>
            </>
        )}
    </Modal.Body>
</Modal>

    </>
  );
};

CertificateDisplayPage.propTypes = {
  cardId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ])
};

export default CertificateDisplayPage;
