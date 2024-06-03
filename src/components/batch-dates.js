import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import GalleryCertificates from './gallery-certificates';

const apiUrl_Admin = process.env.NEXT_PUBLIC_BASE_URL;

const BatchDates = ({ dates }) => {
  const [certificatesData, setCertificatesData] = useState(null);
  const [user, setUser] =useState({});
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Check if the token is available in localStorage
    // @ts-ignore: Implicit any for children prop
    const storedUser = JSON.parse(localStorage.getItem('user'));
  
    if (storedUser && storedUser.JWTToken) {
      // If token is available, set it in the state
      setUser(storedUser)
      setToken(storedUser.JWTToken);
  
    } else {
      // If token is not available, redirect to the login page
      router.push('/');
    }
  }, []);

  const handleArrowClick = async (date) => {

    const data = {
      issuerId: date?.issuerId,
      batchId: date?.batchId
    };

    try {
      const response = await fetch(`${apiUrl_Admin}/api/get-batch-certificates`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();
      setCertificatesData(result?.data);
    } catch (error) {
      console.error('Error fetching certificates data:', error);
      // Handle error
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const dateObj = new Date(dateString);
    const optionsDate = { month: '2-digit', day: '2-digit', year: 'numeric' };
    return dateObj.toLocaleDateString('en-US', optionsDate);
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    const dateObj = new Date(dateString);
    const optionsTime = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
    return dateObj.toLocaleTimeString('en-US', optionsTime);
  };

  return (
    <Container className='batch-wrapper-dates'>
      {certificatesData ? (
        <GalleryCertificates certificatesData={certificatesData} />
      ) : (
        dates?.map((date) => (
          <div key={date} className='batch-date-container'>
            <div className='badge-wrapper col-3 '>
              <div className='badge-wrapper-inner '>
                <Image width={20} height={50} className='badge-cert' src='/icons/badge-cert.svg' alt='Badge' />
              </div>
            </div>
            <div className='col-6 dates-name d-flex flex-column'>
              <p className='date-batch' style={{ fontWeight: 'bold' }}>{formatDate(date?.issueDate)}</p>
              <p className='time-batch'>{formatTime(date?.issueDate)}</p>
            </div>
            <div className='right-arrow-dates col-2' onClick={() => handleArrowClick(date)}>
              <span style={{ color: '#CFA935', cursor: 'pointer' }}>→</span>
            </div>
          </div>
        ))
      )}
    </Container>
  );
};

export default BatchDates;
