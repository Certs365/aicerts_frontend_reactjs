import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import GalleryCertificates from '../components/gallery-certificates';
import BatchDates from '../components/batch-dates';
import Image from 'next/legacy/image';
import BackIcon from "../../public/icons/back-icon.svg";
import { Modal, ProgressBar } from 'react-bootstrap';
import SearchAdmin from '../components/searchAdmin';
import { encryptData } from '../utils/reusableFunctions';
import certificate from '../services/certificateServices';


const Gallery = () => {
  const [tab, setTab] = useState(0);
  const [title, setTitle] = useState("Single Issuance");
  const [subTitle, setSubTitle] = useState("With PDF");
  const [singleWithCertificates, setSingleWithCertificates] = useState([]);
  const [singleWithoutCertificates, setSingleWithoutCertificates] = useState([]);
  const [batchCertificatesData, setBatchCertificatesData] = useState(null);
  const [now, setNow] = useState(0);
  const [dates, setDates] = useState([]);
  const [user, setUser] = useState({});
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(''); // New state for search query
  const [searchLoading, setSearchLoading] = useState(false); // New state for search loading
  const [filteredSingleWithCertificates, setFilteredSingleWithCertificates] = useState([]);
  const [filteredSingleWithoutCertificates, setFilteredSingleWithoutCertificates] = useState([]);
  const [filteredBatchCertificatesData, setFilteredBatchCertificatesData] = useState(null);
  const router = useRouter();
  const apiUrl_Admin = process.env.NEXT_PUBLIC_BASE_URL_admin;

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));

    if (storedUser && storedUser.JWTToken) {
      setUser(storedUser);
      setToken(storedUser.JWTToken);
      fetchData(storedUser);
    } else {
      router.push('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async (storedUser) => {
    setShowLoading(true);
    try {
      fetchBatchDates(storedUser);
      await Promise.all([
        fetchSingleWithPdfCertificates(storedUser),
        fetchSingleWithoutCertificates(storedUser),
      ]);
      setShowLoading(false);

    } catch (error) {
      console.error("Error fetching data: ", error);
    } finally {
    }
  };

  const handleChange = (value) => {
    setTab(value);
    if (value === 0) {
      setTitle("Single Issuance");
      setSubTitle("With PDF");
      setFilteredSingleWithCertificates(singleWithCertificates);
    } else if (value === 1) {
      setTitle("Single Issuance");
      setSubTitle("Without PDF");
      setFilteredSingleWithoutCertificates(singleWithoutCertificates);
    } else if (value === 2) {
      setTitle("Batch Issuance");
      setSubTitle("");
      setFilteredBatchCertificatesData(batchCertificatesData);
    }
  };

  const fetchSingleWithoutCertificates = async (storedUser) => {
    const data = {
      issuerId: storedUser.issuerId,
      type: 2,
    };
  
    return new Promise((resolve, reject) => {
      try {
        certificate.getSingleCertificates(data, (response) => {
          const certificatesData = response;
          setSingleWithoutCertificates(certificatesData?.data);
          setFilteredSingleWithoutCertificates(certificatesData?.data);
          resolve(certificatesData);
        });
      } catch (error) {
        console.error('Error in fetchSingleWithoutCertificates:', error);
        reject(error);
      }
    });
  };
  
  const fetchSingleWithPdfCertificates = async (storedUser) => {
    const data = {
      issuerId: storedUser.issuerId,
      type: 1,
    };
  
    return new Promise((resolve, reject) => {
      try {
        certificate.getSingleCertificates(data, (response) => {
          const certificatesData = response;
          setSingleWithCertificates(certificatesData?.data);
          setFilteredSingleWithCertificates(certificatesData?.data);
          resolve(certificatesData);
        });
      } catch (error) {
        console.error('Error in fetchSingleWithPdfCertificates:', error);
        reject(error);
      }
    });
  };
  

  const fetchBatchDates = async (storedUser) => {
    const data = {
      issuerId: storedUser.issuerId,
    };
    // const encryptedData = encryptData(data)
    try {
      // const response = await fetch(`${apiUrl_Admin}/api/get-batch-certificate-dates`, {
      //   method: "POST",
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${storedUser.token}`,
      //   },
      //   body: JSON.stringify({data:encryptedData})
      // });
      certificate.getBatchCertificateDates(data, async (response)=>{
        const datesData = response;
      setDates(datesData?.data);
      }) 

      // const datesData = await response.json();
      // setDates(datesData?.data);
    } catch (error) {
      console.error('Error ', error);
    } finally {
      setLoading(false)
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearch = () => {
    setSearchLoading(true);
    setTimeout(() => { // Simulate network request
      const filteredData = (data) => {
        return data.filter(item => item.certificateNumber.toLowerCase().includes(searchQuery.toLowerCase()));
      };

      if (tab === 0) {
        setFilteredSingleWithCertificates(filteredData(singleWithCertificates));
      } else if (tab === 1) {
        setFilteredSingleWithoutCertificates(filteredData(singleWithoutCertificates));
      } else if (tab === 2) {
        setFilteredBatchCertificatesData(filteredData(batchCertificatesData));
      }

      setSearchLoading(false);
    }, 500);
  };



  return (
    <div className='page-bg gallery-wrapper' >
      {/* <Modal className='loader-modal' show={loading} centered>
        <Modal.Body>
          <div className='certificate-loader'>
            <Image
              src="/backgrounds/login-loading.gif"
              layout='fill'
              objectFit='contain'
              alt='Loader'
            />
          </div>
          <div className='text'>Loading</div>
          <ProgressBar now={now} label={`${now}%`} />
        </Modal.Body>
      </Modal> */}
      <div className='gallery-title'>
        <div className='d-flex   flex-row'>
          {tab === 2 && filteredBatchCertificatesData && (
            <span onClick={() => { setFilteredBatchCertificatesData(null); }} className='back-button'>
              <Image width={10} height={10} src={BackIcon} alt="Filter batch certificate" /><span className=''>Back</span>
            </span>
          )}
          <span className='gallery-title-name'>
            {title}
          </span>
        </div>
        <div className='gallery-button-container'>
          <span onClick={() => { handleChange(0); }} className={`btn ${tab === 0 ? 'btn-golden' : ''}`}>With PDF</span>
          <span className="vertical-line"></span>
          <span onClick={() => { handleChange(1); }} className={`btn ${tab === 1 ? 'btn-golden' : ''}`}>Without PDF</span>
          <span className="vertical-line"></span>
          <span onClick={() => { handleChange(2); }} className={`btn ${tab === 2 ? 'btn-golden' : ''}`}>Batch</span>
        </div>
      </div>
      {(tab === 0 || tab === 1 || (tab === 2 && filteredBatchCertificatesData)) && (
        <div className='table-title'>
          <span className='expire-typo p-3 p-md-0'>{subTitle}</span>
          {/* <div className='gallery-search-container'>
            <input
              type="text"
              placeholder="Search here..."
              className="d-none d-md-flex search-input"
              value={searchQuery}
              onChange={handleSearchChange}
            />
             <input
              type="text"
              placeholder="Search here..."
              className="d-flex d-md-none search-input"
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <div className='d-none d-md-flex search-icon-container' onClick={handleSearch}>
              <Image width={10} height={10} src="/icons/search.svg" alt='search' />
            </div>
            <div className='d-flex d-md-none search-icon-container-mobile' onClick={handleSearch}>
              <Image width={10} height={10} src="/icons/search.svg" alt='search' />
            </div>
          </div> */}

          <SearchAdmin setFilteredSingleWithCertificates={setFilteredSingleWithCertificates} setFilteredSingleWithoutCertificates={setFilteredSingleWithoutCertificates} setFilteredBatchCertificatesData={setFilteredBatchCertificatesData} tab={tab} setLoading={setLoading} />
          <Modal className='loader-modal' show={showLoading} centered>
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
        </div>
      )}
      {searchLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          {tab === 0 && <GalleryCertificates certificatesData={filteredSingleWithCertificates} setIsLoading={setIsLoading} isLoading={isLoading}/>}
          {tab === 1 && <GalleryCertificates certificatesData={filteredSingleWithoutCertificates} setIsLoading={setIsLoading} isLoading={isLoading}/>}
          {tab === 2 && <BatchDates dates={dates} batchCertificatesData={filteredBatchCertificatesData} setFilteredBatchCertificatesData={setFilteredBatchCertificatesData} setBatchCertificatesData={setBatchCertificatesData} setIsLoading={setIsLoading} isLoading={isLoading} loading={loading} setLoading={setLoading}/>}
        </>
      )}

    </div>
  );
};

export default Gallery;
