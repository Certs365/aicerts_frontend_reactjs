import Image from 'next/image';
import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import issuance from '../services/issuanceServices';
const adminUrl = process.env.NEXT_PUBLIC_BASE_URL;
const generalError = process.env.NEXT_PUBLIC_BASE_GENERAL_ERROR;

const SearchTab = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchMode, setSearchMode] = useState('1');
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [show, setShow] = useState(false);
  const [certData, setCertData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = () => {
    setIsLoading(true);
    setError(""); // Clear previous errors
    setSuccess(""); // Clear previous success messages

    // Validation checks
    if (searchQuery === '') {
      setError("Search query can't be empty");
      setShow(true)
      setIsLoading(false);
      return;
    }

    if (!isValidDate(searchQuery)) {
      setError("Invalid date format. Please use 'mm-dd-yyyy'.");
      setShow(true)
      setIsLoading(false);
      return;
    }

    const data={
      search: searchQuery, 
      category: searchMode 
    }
    
    try {
      issuance.getbulkFiles(data, (response) => {
        if(response.status === "SUCCESS") {
          setCertData(response.data.details);
          setSuccess("Certificates Retrived Successfully"); // Set success message
          setShow(true)
        }
        else if(response?.data?.status === "FAILED") {
          setError(response.data.message);
          setShow(true)
        }
      })
    } catch (error) {
      console.error('Error:', error);
      setError(generalError); // Set error message for fetch error
      setShow(true)
    } finally{
      setIsLoading(false);
    };

    // fetch(`${adminUrl}/api/get-bulk-files`, {
    //   method: 'POST',
    //   body: JSON.stringify({ search: searchQuery, category: searchMode }),
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    // })
    // .then(response => response.json())
    // .then(data => {
    //   if (data.status === "SUCCESS") {
    //     setCertData(data.details);
    //     setSuccess("Certificates Retrived Successfully"); // Set success message
    //   setShow(true)

    //   } else if (data.status === "FAILED") {
    //     setError(data.message);
    //   setShow(true)

    //   }
    // })
    // .catch(error => {
    //   console.error('Error:', error);
    //   setError(generalError); // Set error message for fetch error
    //   setShow(true)

    // })
    // .finally(() => {
    //   setIsLoading(false);
    // });
  };

  const handleClose = () => {
    setShow(false);
    setError("");
    setSuccess("");
  };

  // Function to check if the date is in 'mm-dd-yyyy' format
  // @ts-ignore: Implicit any for children prop
  const isValidDate = (dateString) => {
    const regex = /^(0[1-9]|1[0-2])-(0[1-9]|1\d|2\d|3[01])-\d{4}$/;
    return regex.test(dateString);
  };

  return (
    <div>
      <div className='gallery-search-container mt-2'>
        <select value={searchMode} onChange={(e) => setSearchMode(e.target.value)}>
          <option value="1">Single</option>
          <option value="2">Bulk</option>
        </select>
        <input 
          type="text" 
          placeholder="mm-dd-yyyy" 
          className="search-input" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className='search-icon-container' onClick={handleSearch}>
          <Image width={10} height={10} src="/icons/search.svg" alt='search'/>
        </div>
      </div>

      <div className="certificate-list">
      <h2>Certificates</h2>
      <ul>
        {certData && certData.map((link, index) => {
          const fileName = `certificate_${index + 1}.zip`; // You can generate file names dynamically
          return (
            <li key={index}>
              <div className="certificate-info">
                <span className="certificate-name">{fileName}</span>
                <a href={link} download={fileName} className="download-link">Download</a>
              </div>
            </li>
          )
        })}
      </ul>
    </div>






      {/* Loading Modal for API call */}
      <Modal className='loader-modal' show={isLoading} centered>
        <Modal.Body style={{ display: "flex", flexDirection: "column", textAlign: "center" }}>
          <div className='certificate-loader'>
            {/* Loading spinner or animation */}
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

      {/* Modal for displaying error/success messages */}
      <Modal className='loader-modal text-center' show={show} centered onHide={handleClose}>
        <Modal.Body className='p-5'>
          {error && (
            <>
              <div className='error-icon'>
                {/* Error icon */}
                <Image
                                src="/icons/close.svg"
                                layout='fill'
                                objectFit='contain'
                                alt='Loader'
                            />
              </div>
              <h3 style={{ color: '#ff5500' }}>{error}</h3>
              <button className='warning' onClick={handleClose}>Ok</button>
            </>
          )}
          {success && (
            <>
              <div className='error-icon'>
                {/* Success icon */}
                <Image
                  src="/icons/check-mark.svg"
                  layout='fill'
                  objectFit='contain'
                  alt='Loader'
                />
              </div>
              <h3 style={{ color: 'green' }}>{success}</h3>
              <button className='success' onClick={handleClose}>Ok</button>
            </>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default SearchTab;
