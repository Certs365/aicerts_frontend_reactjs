import React, { useState, useRef, useEffect } from 'react';
import Button from '../../../shared/button/button';
import { Container, Row, Col, Card, Form, Table, Modal } from 'react-bootstrap';
import Image from 'next/legacy/image';
import { useRouter } from 'next/router';
import JSZip from 'jszip';
import { useContext } from 'react';
import CertificateContext from "../../utils/CertificateContext"
import AWS from "../../config/aws-config";
import BackIcon from "../../../public/icons/back-icon.svg";
/**
 * @typedef {object} CertificateDisplayPageProps
 * @property {string} [cardId] - The ID of the selected card.
 */

/**
 * CertificateDisplayPage component.
 * @param {CertificateDisplayPageProps} props - Component props.
 * @returns {JSX.Element} - Rendered component.
 */

const DownloadCertificate = () => {
  const router = useRouter();
  const [apiResponseData, setApiResponseData] = useState(null);
  const [selectAll, setSelectAll] = useState(false);
  const [checkedItems, setCheckedItems] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [isGridView, setIsGridView] = useState(true);
  const [isChecked, setIsChecked] = useState(false);
  const [prevModal, setPrevModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [show, setShow] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState('');
  const [allChecked, setAllChecked] = useState(false);
  const [imagesGenerated, setImagesGenerated] = useState(false);
  const [token, setToken] = useState(null);
  const [cardId, setCardId] = useState(0);
  const [userEmail, setUserEmail] = useState(null);
  const [userName, setUserName] = useState(null);
  const [organization, setOrganization] = useState(null);
  const [certificateNumber, setCertificateNumber] = useState(null);
  const [imageUrlList, setImageUrlList] = useState([]);
  const [detailsArray, setDetailsArray] = useState([]);
  const [filteredCertificatesArray, setFilteredCertificatesArray] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [keyUrl, setKeyUrl] = useState("");
  // const [badgeUrl, setBadgeUrl] = useState("");
  const [singleDetail, setSingleDetail] = useState({});
  const { badgeUrl, certificateUrl, logoUrl, signatureUrl, issuerName, issuerDesignation, certificatesData, setCertificatesDatasetBadgeUrl, setIssuerName, setissuerDesignation, setCertificatesData, setSignatureUrl, setBadgeUrl, setLogoUrl } = useContext(CertificateContext);
  // Get the selected template from the previous screeen

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };
  
  const generatePresignedUrl = async (key) => {
    const s3 = new AWS.S3();
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
  };

  useEffect(() => {
    // Function to retrieve data from session storage and set local state
    const retrieveDataFromSessionStorage = () => {
      const badgeUrlFromStorage = JSON.parse(sessionStorage.getItem("badgeUrl"));
      const logoUrlFromStorage = JSON.parse(sessionStorage.getItem("logoUrl"));
      const signatureUrlFromStorage = JSON.parse(sessionStorage.getItem("signatureUrl"));
      const issuerNameFromStorage = sessionStorage.getItem("issuerName");
      const issuerDesignationFromStorage = sessionStorage.getItem("issuerDesignation");
      if (badgeUrlFromStorage) {
        setBadgeUrl(badgeUrlFromStorage.url)
        // setBadgeFileName(badgeUrlFromStorage.fileName)
      };
      if (logoUrlFromStorage) {
        setLogoUrl(logoUrlFromStorage.url);
        // setLogoFileName(logoUrlFromStorage.fileName)

      }
      if (signatureUrlFromStorage) {
        setSignatureUrl(signatureUrlFromStorage.url);
        // setSignatureFileName(signatureUrlFromStorage.fileName)
      }
      if (issuerNameFromStorage) {
        setIssuerName(issuerNameFromStorage);
      }
      if (issuerDesignationFromStorage) {
        setissuerDesignation(issuerDesignationFromStorage);
      }
    };

    retrieveDataFromSessionStorage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClose = () => {
    setShow(false);
    setLoginError("")
  };

  // Fetch certificate data from the API and generate image URLs
  const handleShowImages = async (index, detail, message, polygonLink, status) => {


    try {
      const res = await fetch('/api/generateImage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({detail, message, polygonLink, status,badgeUrl, certificateUrl, logoUrl, signatureUrl, issuerName, issuerDesignation }),
      });
      if (res.ok) {
        const blob = await res.blob();
        const imageUrl = URL.createObjectURL(blob);
        setImageUrlList(prevList => {
          const newList = [...prevList];
          newList[index] = imageUrl; // Maintain order based on index
          return newList;
        });
      } else {
        console.error('Failed to fetch PDF:', res.statusText);
      }
    } catch (error) {
      console.error('Error downloading PDF:', error);
    } finally {
      // setIsLoading(false);
    }
  };

  useEffect(() => {
    const certList = JSON.parse(sessionStorage.getItem("certificatesList"));

    if (certList) {
      setCertificatesData(certList)
      setFilteredCertificatesArray(certList?.details)
    } else {
      router.back()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router])

  // Effect hook to fetch data when component mounts or query data changes

  useEffect(() => {
    const fetchData = async () => {
      debugger
      if (certificatesData) {
        // Parse the JSON data if it exists
        const parsedData = certificatesData.data;

        setApiResponseData(certificatesData);
        setFilteredCertificatesArray(parsedData.details)
        if (parsedData && parsedData.details && Array.isArray(parsedData.details)) {
          setCertificateNumber(parsedData.details.length);
        } else {
          // Handle case where details array is missing or not an array
          setCertificateNumber(0); // Or perform other error handling
        }
        // Iterate over details and call handleShowImages
        setIsImageLoading(true);

        if (parsedData?.details && parsedData?.details?.length > 0) {
          try {
            // Use Promise.all to wait for all promises to resolve
            await Promise.all(parsedData.details.map((detail, index) =>
              handleShowImages(index, detail, apiResponseData?.message, apiResponseData?.polygonLink, apiResponseData?.status)
            ));
          } catch (error) {
            console.error('Error in handleShowImages:', error);
          } finally {
            setIsImageLoading(false);
          }
        }
      }
    };

    fetchData(); // Call the async function
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [certificatesData]);

  // Effect hook to check if the user is logged in

  useEffect(() => {
    // Check if the token is available in localStorage
    const storedUser = JSON.parse(localStorage.getItem('user'));

    if (storedUser && storedUser.JWTToken && storedUser.email && storedUser.name) {
      // If token is available, set it in the state
      setToken(storedUser.JWTToken);
      setUserEmail(storedUser.email);
      setUserName(storedUser.name)
      setOrganization(storedUser.organization)
    } else {
      // If token is not available, redirect to the login page
      router.push('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Certificate URL based on cardId
  const parsedCardId = typeof cardId === 'string' ? parseInt(cardId) : cardId || 0;

  useEffect(() => {
    if(badgeUrl){
     
    const fetchImageUrl = async () => {
        const url = await badgeUrl;
        if (url) {
          setKeyUrl(url);
           (url, "url")
        }
      }

      fetchImageUrl();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  // Display error if certificate data is not available
  if (!apiResponseData) {
    return (<div className="wait-message"><p>Please wait while we load your data</p></div>);
  }

  const handleSearchChange = (e) => {
    debugger
    const searchValue = e.target.value;
    setSearchQuery(searchValue);

    // Filter the details array based on the certificateNumber or name
    let filteredDetails;
    if (searchValue.trim() === "") {
      // If the search value is empty, show all data
      filteredDetails = apiResponseData.data.details;
    } else {
      // Otherwise, filter based on the certificateNumber or name
      filteredDetails = apiResponseData?.data?.details?.filter((detail) =>
        (detail?.certificateNumber && detail.certificateNumber.toString().toLowerCase().includes(searchValue.toLowerCase())) ||
        (detail?.name && detail.name.toLowerCase().includes(searchValue.toLowerCase()))
      );
    }

    setFilteredCertificatesArray(filteredDetails);
  };







  // Handle download PDF for a single certificate
  const handleDownloadPDF = async (detail, message, polygonLink, status) => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/generatePDF', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ detail, certificateUrl, logoUrl, signatureUrl, badgeUrl, issuerName, issuerDesignation }),
      });
      
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `Certification_${detail.certificateNumber}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
        setLoginError("")
        setLoginSuccess("Certification Downloaded")
        setShow(true)
      } else {
        console.error('Failed to fetch PDF:', res.statusText);
        setLoginError("Error downloading PDF")
        setShow(true)
      }
    } catch (error) {
      console.error('Error downloading PDF:', error);
      setLoginError("Error downloading PDF")
      setShow(true)
    } finally {
      setIsLoading(false);
    }
  };

  // Handle download PDFs for multiple certificates
  const handleDownloadPDFs = async () => {
    setIsLoading(true);

    try {
      const zip = new JSZip();
      const { message, polygonLink, status } = apiResponseData
      for (const detail of detailsArray) {
        const res = await fetch('/api/generatePDF', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            detail, certificateUrl, logoUrl, signatureUrl, badgeUrl, issuerName, issuerDesignation
          }),
        });

        if (res.ok) {
          const blob = await res.blob();
          zip.file(`Certificate_${detail.certificateNumber}.pdf`, blob);
        } else {
          console.error('Failed to fetch PDF:', res.statusText);
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
      link.parentNode.removeChild(link);

      setLoginError('');
      setLoginSuccess('Certificates Downloaded');
      setShow(true);
    } catch (error) {
      console.error('Error downloading PDFs:', error);
      setLoginError('Error downloading PDFs');
      setShow(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle Grid / List view
  const toggleViewMode = () => {
    setIsGridView(!isGridView); // Toggle the view mode
  };

  // Triger Preview Modal
  const handlePrevCert = (url, detail) => {
    setPrevModal(true)
    setImageUrl(url)
    setSingleDetail(detail)
  };

  // Close Preview Modal
  const closePrevCert = () => {
    setPrevModal(false)
  };

  // Check/Uncheck table data
  const handleCheckboxChange = (event, index) => {
    const isChecked = event.target.checked;
    setCheckedItems((prevState) => ({
      ...prevState,
      [index]: isChecked,
    }));

    const selectedDetail = apiResponseData?.data?.details?.find(
      (detail, i) => i === index
    );

    if (isChecked) {
      setDetailsArray((prevDetails) => [...prevDetails, selectedDetail]);
    } else {
      console.log(prevDetails);
      setDetailsArray((prevDetails) =>
        prevDetails.filter(
          (detail) => detail?.certificateNumber !== selectedDetail?.certificateNumber
        )
      );
    }
  };

  // Toggle selection of all certificates
  const handleSelectAllChange = () => {
    const newSelectAll = !selectAll;

    setSelectAll(newSelectAll);

    if (newSelectAll) {
      // If "Select All" is checked, store all details in the state
      
      setDetailsArray(apiResponseData?.data?.details || []);
      setCheckedItems(
        apiResponseData?.data?.details?.reduce((acc, _, index) => {
          acc[index] = true;
          return acc;
        }, {})
      );
    } else {
      // If "Select All" is unchecked, clear the state
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
              <span onClick={() => { window.location.href = "/certificate?tab=1" }} className='back-button'>
              <Image width={10} height={10} src={BackIcon} alt='back' /><span className=''>Back</span>
            </span>
                <h3 className='title'>Batch Issuance</h3>
                <Row>
                  <Col xs={12} md={4} className='mb-4 mb-md-0'>
                    <Card className='p-0 h-auto d-none d-md-block'>
                      <Card.Header>Selected Template</Card.Header>
                      <Card.Body>
                        <div className='issued-info'>
                          <div className='label'>No. of Certification to be issued</div>
                          <div className='detail'>{certificateNumber}</div>
                          <div className='label'>Organisation</div>
                          <div className='detail'>{organization}</div>
                          <div className='label'>Issuer</div>
                          <div className='detail'>{userName}</div>
                          <div className='label'>Email</div>
                          <div className='detail'>{userEmail}</div>
                          <div className='label'>Selected Template</div>
                          <Image width={200} height={150} className='img-fluid' src={certificateUrl} alt={`Certificate ${parsedCardId + 1}`} />
                        </div>
                      </Card.Body>
                    </Card>

                    <Card className='p-0 h-auto d-block d-md-none'>
                      <Card.Header className={`${isOpen ? 'open' : 'close'} m-header`} onClick={toggleAccordion}>Selected Template</Card.Header>
                      {isOpen && (
                        <Card.Body>
                          <div className='issued-info'>
                            <div className='label'>No. of Certification to be issued</div>
                            <div className='detail'>{certificateNumber}</div>
                            <div className='label'>Organisation</div>
                            <div className='detail'>{organization}</div>
                            <div className='label'>Issuer</div>
                            <div className='detail'>{userName}</div>
                            <div className='label'>Email</div>
                            <div className='detail'>{userEmail}</div>
                            <div className='label'>Selected Template</div>
                            <Image width={200} height={150} className='img-fluid' src={certificateUrl} alt={`Certificate ${parsedCardId + 1}`} />
                          </div>
                        </Card.Body>
                      )}
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
                              placeholder="Seach Certificate"
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
                        <Button disabled={detailsArray?.length === 0} onClick={handleDownloadPDFs} label='Download Certificate' className='golden-download' />
                      </div>
                      {isGridView ? (
                        <div className='grid-view'>

                          <Row>
                            {filteredCertificatesArray && filteredCertificatesArray?.map((detail, index) => (

                              <Col key={index} xs={12} md={4}>
                                <div className='prev-cert-card'>
                                  <div className='cert-prev' >
                                    {
                                      isImageLoading ?
                                        <div className="image-container skeleton"></div>
                                        :
                                        <Image
                                          src={imageUrlList[index]}
                                          layout='fill'
                                          objectFit='contain'
                                          alt={`Certificate ${parsedCardId + 1}`}
                                        />
                                    }


                                  </div>
                                  <div className='d-flex justify-content-between align-items-center'>
                                    <Form.Group controlId={`Certificate ${parsedCardId + 1}`}>
                                      <Form.Check
                                        type="checkbox"
                                        label={detail?.certificateNumber && detail?.certificateNumber.toString().length > 5
                                          ? `${detail?.certificateNumber.toString().substring(0, 5)}...`
                                          : detail?.certificateNumber}
                                        checked={checkedItems[index] || false}
                                        onChange={(event) => handleCheckboxChange(event, index)}
                                      />
                                    </Form.Group>

                                    <div className='action-buttons d-flex' style={{ columnGap: "10px" }} >
                                      <span className='d-flex align-items-center' style={{ columnGap: "10px" }} onClick={() => handlePrevCert(imageUrlList[index], detail)}>
                                        <Image
                                          src="https://images.netcomlearning.com/ai-certs/icons/eye-white-bg.svg"
                                          width={16}
                                          height={16}
                                          alt='View Certificate'
                                        />
                                      </span>
                                      <span className='d-flex align-items-center' style={{ columnGap: "10px" }}
                                        onClick={() => handleDownloadPDF(detail, apiResponseData?.message, apiResponseData?.polygonLink, apiResponseData?.status)}>
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
                                <th>
                                  <div className='d-flex align-items-center justify-content-center'>
                                    <span>S.No</span>
                                  </div>
                                </th>
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
                                    <div className='d-flex align-items-center '>
                                      <Form.Check
                                        type="checkbox"
                                        aria-label={`option ${index}`}
                                        checked={checkedItems[index] || false}
                                        
                                        onChange={(event) => handleCheckboxChange(event, index)}
                                      />
                                      {/* <span>{index + 1}.</span> */}
                                    </div>
                                  </td>
                                  <td>{detail.name}</td>
                                  <td>{detail.certificateNumber}</td>
                                  <td>
                                    <div className='trigger-icons' onClick={() => handlePrevCert(imageUrlList[index], detail)}>
                                      <Image
                                        src="https://images.netcomlearning.com/ai-certs/icons/eye-bg.svg"
                                        layout='fill'
                                        objectFit='contain'
                                        alt='View certificate'
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
                                        onClick={() => handleDownloadPDF(detail, apiResponseData?.message, apiResponseData?.polygonLink, apiResponseData?.status)}
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

      <div className='page-footer-bg'></div>

      <Modal
        size="lg"
        centered
        className='preview-modal'
        show={prevModal}
      >
        <Modal.Body>
          <div className='close-modal' onClick={closePrevCert}>
            <Image
              src="https://images.netcomlearning.com/ai-certs/icons/close-grey-bg.svg"
              layout='fill'
              objectFit='contain'
              alt='Certificate'
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
            <Button label='Download' className='golden' onClick={() => handleDownloadPDF(singleDetail, apiResponseData?.message, apiResponseData?.polygonLink, apiResponseData?.status)}  ></Button>
          </div>
        </Modal.Body>
      </Modal>

      {/* Loading Modal for API call */}
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
              <div className='error-icon'>
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
    </>
  );
}

export default DownloadCertificate;
