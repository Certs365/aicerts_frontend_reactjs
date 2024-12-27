import React, { useState, useEffect, useContext } from 'react';
import { Modal, Container, ProgressBar } from 'react-bootstrap';
import Image from 'next/legacy/image';
const apiUrl = process.env.NEXT_PUBLIC_BASE_URL;
import 'react-datepicker/dist/react-datepicker.css';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { TextField } from '@mui/material';
import AWS from "../config/aws-config"
import CertificateContext from '../utils/CertificateContext';
import { encryptData } from '../utils/reusableFunctions';
import download from '../services/downloadServices';
import certificate from '../services/certificateServices';
import issuance from '../services/issuanceServices';
const secretKey = process.env.NEXT_PUBLIC_BASE_ENCRYPTION_KEY;

const AdminTable = ({ data, tab, setResponseData, responseData,setIssuedCertificate }) => {
  const [expirationDate, setExpirationDate] = useState(null);
  const [token, setToken] = useState(null); // State variable for storing token
  const [email, setEmail] = useState(null); // State variable for storing email
  const [isLoading, setIsLoading] = useState(false);
  const [showMessage, setShowMessage] = useState(null);
  const [message, setMessage] = useState(null);
  const [now, setNow] = useState(0);
  const [formData, setFormData] = useState({
    email: "",
    certificateNumber: "",
    name: "",
    course: "",
    grantDate: null, // Use null for Date values
    expirationDate: null, // Use null for Date values
  });
  const [show, setShow] = useState(false);
  const [showErModal, setShowErModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [neverExpires, setNeverExpires] = useState(false);
  const { setCertificateUrl, certificateUrl, badgeUrl, setBadgeUrl, logoUrl, issuerName, issuerDesignation, setLogoUrl, signatureUrl, setSignatureUrl, setSelectedCard, selectedCard, setIssuerName, setissuerDesignation } = useContext(CertificateContext);

  const adminUrl = process.env.NEXT_PUBLIC_BASE_URL_admin;
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (storedUser && storedUser.JWTToken) {
      setToken(storedUser.JWTToken);
      setEmail(storedUser.email);
      setFormData((prevFormData) => ({
        ...prevFormData,
        email: storedUser.email,
      }));
      fetchData(tab, storedUser.email);
    } else {
      // router.push("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  
  const handleClose = () => {
    setShowMessage(false);
    setShow(false);
    setShowErModal(false);
    setNeverExpires(false);
    setErrorMessage("")
  };

  const fetchData = async (tab, email) => {
    setIsLoading(true);

    try {
      let queryCode;
      if (tab === 1) {
        queryCode = 8;
      } else if (tab === 2) {
        queryCode = 7;
      } else if (tab === 3) {
        queryCode = 6;
      }

      const payload = {
        email: email,
        queryCode: queryCode,
      }
      // const encryptedData = encryptData(payload);

      // const response = await fetch(`${apiUrl}/api/get-issuers-log`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     data: encryptedData,
      //   }),
      // });

      issuance.appIssuersLog(payload, (response) =>{
        if (response.status != 'SUCCESS') {
          console.error('Failed to fetch data');
          // throw new Error('Failed to fetch data');
        }
          if (response?.status === 'SUCCESS') {
            setResponseData(response.data);
          }
       });
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const ReactiveRevokeUpdate = async (tab, item) => {
    setErrorMessage("")
    setSuccessMessage("")
    setIsLoading(true);
    setNow(10);
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

    startProgress();

    try {
      let certStatus;

      if (tab === 2) {
        certStatus = 4;
      } else if (tab === 3) {
        certStatus = 3;
      }
      const payload = {
        email: email,
        certificateNumber: item.certificateNumber, // Use the passed item
        certStatus: certStatus,
      }
      // const encryptedData = encryptData(payload);
      // const response = await fetch(`${apiUrl}/api/update-cert-status`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${token}`,
      //   },
      //   body: JSON.stringify({
      //     data: encryptedData
      //   }),
      // });

      certificate.updateCertsStatus(payload, async (response) => {
      try{
         
        if(response.status != 'SUCCESS'){
        // if (response.ok) {
        const error = response;
        setErrorMessage(error?.message || "Unable to update Certification.Try again Later");
        setShowErModal(true);
        console.error('Failed to fetch data');
        // throw new Error('Failed to fetch data');
      }
      if (response.status === 'SUCCESS') {
        // const data = await response.json();
        await fetchData(tab,email)
        // setExpirationDate(data.expirationDate);   
        setExpirationDate(response.data.expirationDate);         
        setSuccessMessage("Updated Successfully");
        setShowErModal(true);
      }
      }catch (error) {
        console.error('Error fetching data:', error);
       }
      })

      // if (!response.ok) {
      //   const error = await response.json();
      //   setErrorMessage(error?.message || "Unable to update Certification.Try again Later");
      // setShowErModal(true);
      //   throw new Error('Failed to fetch data');
      // }

      // const data = await response.json();
      // await fetchData(tab,email)
      // setExpirationDate(data.expirationDate);
     
      // setSuccessMessage("Updated Successfully");
      // setShowErModal(true);


    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      stopProgress();
      setIsLoading(false);
    }
  };

  const DateUpdate = async (item) => {
    setErrorMessage("");
    setSuccessMessage("");
    setIsLoading(true);
    setNow(10);
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

    startProgress();

    try {
        let payloadExpirationDate = expirationDate;

        if (neverExpires) {
            payloadExpirationDate = "1";
        } else {
            payloadExpirationDate = formatDate(expirationDate);
        }
const payload = {
  email: email,
  certificateNumber: item.certificateNumber, // Use the passed item
  expirationDate: payloadExpirationDate,
}
        // const encryptedData = encryptData(payload);

        // const response = await fetch(`${apiUrl}/api/renew-cert`, {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'Authorization': `Bearer ${token}`,
        //     },
        //     body: JSON.stringify({
        //        data: encryptedData
        //     }),
        // });
      certificate.renewCert(payload, async (response) => {
        try {
           
          console.log("renew  cert -->",response)
          if(response.status != 'SUCCESS'){
            // if (!response.ok) {
            // const data = await response.json();
            setErrorMessage(response.error?.response?.data?.message || "Error in Updating certificate");
            setShowErModal(true);
            setIsLoading(false)
            console.error('Failed to fetch data');
            // throw new Error('Failed to fetch data');
        }
        if (response?.status === 'SUCCESS') {
        const data = response.data;
         
        await fetchData(tab, email);
        setErrorMessage("");
        setSuccessMessage("Updated Successfully");
        setShowErModal(true);
        setIsLoading(false)
        setIssuedCertificate(data)
        }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      })


        // if (!response.ok) {
        //     const data = await response.json();
        //     setErrorMessage(data?.message || "Error in Updating certificate");
        //     setShowErModal(true);
        //     setIsLoading(false)

        //     throw new Error('Failed to fetch data');
        // }

//         const data = await response.json();
//         await fetchData(tab, email);
//         setErrorMessage("");
//         setSuccessMessage("Updated Successfully");
//         setShowErModal(true);
//         setIsLoading(false)

// setIssuedCertificate(data)
        // Generate and upload the image

    } catch (error) {
        console.error('Error fetching data:', error);
      setIsLoading(false)

    } finally {
        stopProgress();
        setExpirationDate(null);
    }
};

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



const handleShowImages = async (formData, responseData) => {
    const { details, polygonLink, message, status, qrCodeImage } = responseData;
    const extractPath = (input) => {
      if (!input) return null;
      const urlParts = input.split('/');
      const filename = urlParts[urlParts.length - 1];
      return filename;
  };

  const generateUrl = async (url) => {

      if (!url) return null;
      return await generatePresignedUrl(extractPath(url));
  };

  const badgeUrl = await details?.badgeUrl;
  const certificateUrl = await details?.templateUrl;
  const logoUrl = await details?.logoUrl;
  const signatureUrl = await details?.signatureUrl;

    try {

      const payload = {
        detail: details, 
        message, 
        polygonLink, 
        badgeUrl:badgeUrl, 
        status, 
        certificateUrl:certificateUrl, 
        logoUrl:logoUrl, 
        signatureUrl:signatureUrl, 
        issuerName:details?.issuerName, 
        issuerDesignation:details?.issuerDesignation, 
        qrCodeImage
      }
        // const res = await fetch('/api/downloadImage', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({ detail: details, message, polygonLink, badgeUrl:badgeUrl, status, certificateUrl:certificateUrl, logoUrl:logoUrl, signatureUrl:signatureUrl, issuerName:details?.issuerName, issuerDesignation:details?.issuerDesignation, qrCodeImage }),
        // });
        download.downloadImage(payload, async (response) => {
           
          if(response.status === 'SUCCESS'){
          // if (response.ok) {
            const blob = await res.blob();
            return blob; // Return blob for uploading
        } else {
            console.error('Failed to generate image:', res.statusText);
          setIsLoading(false)

          console.error('Image generation failed');
            // throw new Error('Image generation failed');
        }
        })

      //   if (res.ok) {
      //       const blob = await res.blob();
      //       return blob; // Return blob for uploading
      //   } else {
      //       console.error('Failed to generate image:', res.statusText);
      // setIsLoading(false)

      //       throw new Error('Image generation failed');
      //   }
    } catch (error) {
        console.error('Error generating image:', error);
      setIsLoading(false)

        throw error;
    }
};

const uploadToS3 = async (blob, certificateNumber,type) => {
    try {
        // Create a new FormData object
        const formCert = new FormData();
        // Append the blob to the form data
        formCert.append('file', blob);
        // Append additional fields
        formCert.append('certificateNumber', certificateNumber);
        formCert.append('type', type);

        // Make the API call to send the form data
        // const uploadResponse = await fetch(`${adminUrl}/api/upload-certificate`, {
        //     method: 'POST',
        //     body: formCert
        // });

        certificate.uploadCertificate(formCert, async (response) => {
          if(response.status != 'SUCCESS'){
            // if (response.ok) {
            setIsLoading(false);
            console.error('Failed to upload certificate to S3');
            // throw new Error('Failed to upload certificate to S3');
        }
        })

      //   if (!uploadResponse.ok) {
      //       throw new Error('Failed to upload certificate to S3');
      // setIsLoading(false)

      //   }
    } catch (error) {
        console.error('Error uploading to S3:', error);
      setIsLoading(false)

    } finally{
      await fetchData(tab, email);
      setIsLoading(false)

    }
};

  const handleUpdateClick = (tab, item) => {
    setSelectedRow(item); 
  // Set the selected row
    if (tab === 1) {
      setShow(true); // Open the modal for tab 1
    } else {
      ReactiveRevokeUpdate(tab, item); // Handle revoke/reactivate directly
    }
  };

  const handleButtonClick = () => {
    DateUpdate(selectedRow); // Use selectedRow for the API call
    setShow(false); // Close the modal after initiating the API call

  };

  const handleCheckboxChange = (event) => {
    setNeverExpires(event.target.checked);
  };

  const rowHeadName = (tab) => {
    if (tab === 1) {
      return "New Expiration Date";
    } else if (tab === 2) {
      return "Reactive";
    } else if (tab === 3) {
      return "Revoke Certification";
    }
  };

  const rowAction = (tab, item) => {
    const handleClick = () => {
      handleUpdateClick(tab, item);
    };

    let buttonLabel = '';
    if (tab === 1) {
      buttonLabel = 'Set a new Date';
    } else if (tab === 2) {
      buttonLabel = 'Reactivate Certificate';
    } else if (tab === 3) {
      buttonLabel = 'Revoke Certificate';
    }

    return <div onClick={handleClick} className={tab === 1 ? 'btn-new-date' : 'btn-revoke'}>{buttonLabel}</div>;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };


  return (
    <>
      {/* <Container> */}
      
        <table  className="admin-table-wrapper table table-bordered">
          <thead >
            <tr >
              <th scope="col" style={{ backgroundColor: "#f3f3f3" }}>S. No.</th>
              <th scope="col" style={{ backgroundColor: "#f3f3f3" }}>Name</th>
              <th scope="col" style={{ backgroundColor: "#f3f3f3" }}>Certificate Number</th>
              <th scope="col" style={{ backgroundColor: "#f3f3f3" }}>Expiration Date</th>
              <th scope="col" style={{ backgroundColor: "#f3f3f3" }} >{rowHeadName(tab)}</th>
            </tr>
          </thead>
          <tbody>
            {responseData?.data?.map((item, index) => {
              return (
                <tr key={index}>
                  <th scope="row">{index + 1}</th>
                  <td >{item?.name}</td>
                  <td>{item?.certificateNumber}</td>
                  <td>{item?.expirationDate == 1 || !item?.expirationDate ? "-" : formatDate(item?.expirationDate) || "-"}</td>
                  <td>{rowAction(tab, item)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
                         
      {/* </Container> */}

      <Modal style={{ borderRadius: "26px" }} className='extend-modal' show={show} centered>
          <Modal.Header className='extend-modal-header'>
            <span className='extend-modal-header-text'>Set a New Expiration Date</span>
            <div className='close-modal'>
            <Image
              onClick={() => { setShow(false); setExpirationDate(null); setNeverExpires(false)}}
              className='cross-icon'
              src="/icons/close-icon.svg"
              layout='fill'
              alt='Loader'
            />
            </div>

          </Modal.Header>
          <Modal.Body style={{ display: "flex", flexDirection: "column", textAlign: "left" }}>
            {selectedRow && <span className='extend-modal-body-text'>Expiring on {selectedRow?.expirationDate}</span>}
            <hr style={{ width: "100%", background: "#D5DDEA" }} />
            <span className='extend-modal-body-expire'>New Expiration Date</span>
        
       <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        value={expirationDate}
        onChange={(newDate) => setExpirationDate(newDate)}
        format="MM-dd-yyyy"
        renderInput={(params) => <TextField {...params} className='input-date-modal' />}
        disabled={neverExpires}
        minDate={selectedRow?.expirationDate ? new Date(selectedRow.expirationDate) : new Date()}
      />
    </LocalizationProvider>
              <div className='checkbox-container-modal'>
      <input
        type="checkbox"
        id="neverExpires"
        style={{ marginRight: "5px" }}
        checked={neverExpires} // Set the checked state of the checkbox based on the state variable
        onChange={handleCheckboxChange} // Attach the handler function to onChange event
      />
      <label className='label-modal' htmlFor="neverExpires">Never Expires</label>
    </div>
          </Modal.Body>
          <Modal.Footer>
            <button className="update-button-modal"  onClick={() => { handleButtonClick(); setShow(false);  }}>Update Expiration Date</button>
          </Modal.Footer>
      </Modal>

        {/* Loading Modal for API call */}
        <Modal className='loader-modal' show={isLoading} centered>
            <Modal.Body>
                <div className='certificate-loader'>
                    <Image
                        src="/backgrounds/login-loading.gif"
                        layout='fill'
                        alt='Loader'
                    />
                </div>
                <div className='text mt-3'>Please Wait</div>
                {/* <ProgressBar now={now} label={`${now}%`} /> */}
            </Modal.Body>
        </Modal>

        <Modal className='loader-modal text-center' show={showErModal} centered>
            <Modal.Body>
                {message &&
                    <>
                        <div className='error-icon success-image'>
                            <Image
                                src="/icons/invalid-password.gif"
                                layout='fill'
                                alt='Loader'
                            />
                        </div>
                        <div className='text' style={{ color: '#ff5500' }}> {message}</div>
                        <button className='warning'  onClick={() => { setShowErModal(false) }}>Ok</button>
                    </>
                }
            </Modal.Body>
        </Modal>
        <Modal onHide={handleClose} className='loader-modal text-center' show={showErModal} centered>
        <Modal.Body>
          {errorMessage !== '' ? (
            <>
              <div className='error-icon'>
                <Image
                  src="/icons/invalid-password.gif"
                  layout='fill'
                  objectFit='contain'
                  alt='Loader'
                />
              </div>
              <div className='text' style={{ color: '#ff5500' }}>{errorMessage}</div>
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
              <div className='text' style={{ color: '#CFA935' }}>{successMessage}</div>
              <button className='success' onClick={handleClose}>Ok</button>
            </>
          )}


        </Modal.Body>
      </Modal>
    </>
  )
}

export default AdminTable
