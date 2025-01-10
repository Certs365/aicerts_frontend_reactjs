import Image from 'next/legacy/image';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
import { Navbar, Container, NavDropdown, ButtonGroup, Nav, Modal, Dropdown } from 'react-bootstrap';
import { useRouter } from 'next/router';
import Button from '../../shared/button/button';
import { jwtDecode } from 'jwt-decode';
const apiUrl_Admin = process.env.NEXT_PUBLIC_BASE_URL;
const apiUrl = process.env.NEXT_PUBLIC_BASE_URL_USER;
import { getAuth } from "firebase/auth"
import issuance from '@/services/issuanceServices';
import user from '@/services/userServices';
import { encryptData } from '../utils/reusableFunctions';
const secretKey = process.env.NEXT_PUBLIC_BASE_ENCRYPTION_KEY;
import settingsIcon from "../../public/icons/settings.svg";
import ThemeSwitcher from '@/components/ThemeSwitcher';
import ThemedImage from '@/components/ThemedImage';
import { useTheme } from '../context/ThemeContext';

// interface for response data
interface ResponseData {
  status: string;
  data: {
    issued: number;
    reactivated: number;
    renewed: number;
    revoked: number;
  };
  responses: number;
  message: string;
}
type Service = {
  serviceId: string;
  // Add other fields if necessary
};

type FetchResponseData = {

  // @ts-ignore: Implicit any for children prop
  issuers: Issuer[];
  message: string;
};



const Navigation = () => {
  const router = useRouter();
  const auth = getAuth();
  const isUserLoggedIn = useRef(false);
  const [token, setToken] = useState(null);
  const [email, setEmail] = useState(null);
  const [responseData, setResponseData] = useState<ResponseData | null>(null);
  const [creditLimit, setCreditLimit] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [planName, setPlanName] = useState(null);
  const [creditRemaining, setcreditRemaining] = useState(0);
  const { isDarkMode } = useTheme();
  const [showDropdown, setShowDropdown] = useState(false);
  const [formData, setFormData] = useState({
    organization: '',
    name: '',
    certificatesIssued: '',
  });
  const [selectedTab, setSelectedTab] = useState(0)
  const handleViewProfile = () => {
    window.location.href = '/user-details';
  };

  useEffect(() => {
    isUserLoggedIn.current = localStorage?.getItem('user') !== null;
  }, []);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user') ?? 'null');

    if (storedUser && storedUser.JWTToken) {
      setToken(storedUser.JWTToken);
      setEmail(storedUser.email);
      fetchData(storedUser.email);

      getCreditLimit(storedUser.email);
      getPlanName(storedUser.email);
      setFormData({
        organization: storedUser.organization || '',
        name: storedUser.name || '',
        certificatesIssued: storedUser.certificatesIssued || '',
      });
    } else {
      router.push('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  // API call
  const fetchData = async (email: string): Promise<void> => {
    const payload = {
      email: email,
      queryCode: 1,
    };

    issuance.appIssuersLog(payload, (response) => {
      try {
        if (response?.data?.status === 'SUCCESS') {
          setResponseData(response.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    });
  };

  // const fetchData = async (email: any) => {
  //   const data = { email };

  //   try {
  //     const response = await fetch(`${apiUrl_Admin}/api/get-issuer-by-email`, {
  //       method: "POST",
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Authorization': `Bearer ${token}`,
  //       },
  //       body: JSON.stringify(data)
  //     });

  //     const userData = await response.json();
  //     const userDetails = userData?.data;
  //     setFormData({
  //       organization: userDetails?.organization || "-",
  //       name: userDetails?.name || "-",
  //       certificatesIssued: userDetails?.certificatesIssued || "-"
  //     });

  //   } catch (error) {
  //     console.error('Error ', error);
  //     // Handle error
  //   }
  // };
  const getCreditLimit = async (email: any) => {
    // const encryptedData = encryptData({
    //   email: email,
    // });
    const payload = {
      email: email
    }
    user.creditLimit(payload, async (response) => {
      try {
        const issueService: any = response.data.details.find((obj: any) => obj.serviceId === "issue") as Service | undefined;
        if (issueService) {
          setCreditLimit(issueService?.limit);
        }
      } catch (error) {
        // console.error('Error fetching data:', error);
      }
    })
  };

  const getPlanName = async (email: string) => {
    try {
      const response = await fetch(`${apiUrl}/api/fetch-user-subscription-details`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      if (!response.ok) {
        console.error('Failed to fetch plan name');
        // throw new Error('Failed to fetch plan name');
      }
      const data = await response.json();
      setPlanName(data.details.subscriptionPlanTitle);
      setcreditRemaining(data.details.currentCredentials);
    } catch (error) {
      console.error('Error fetching plan name:', error);
    }
  };
  // @ts-ignore: Implicit any for children prop
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user') ?? 'null');
    const userDetails = JSON.parse(localStorage?.getItem('user') ?? 'null');

    if (storedUser && storedUser.JWTToken) {
      // If token is available, set it in the state
      setToken(storedUser.JWTToken);
      // fetchData(storedUser.email);
    } else {
      // If token is not available, redirect to the login page
      // router.push('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);


  const handleRefresh = async (storedUser: any) => {


    try {
      user.refreshToken(storedUser, async (response) => {
        if (response.status === 'SUCCESS') {

        }
      });

    } catch (error) {
      console.error('Error ', error);
    } finally {
    }
  };


  const navigateToSettings = () => {
    router.push('/settings');
  };

  // @ts-ignore: Implicit any for children prop
  useEffect(() => {
    // Check if the token is available in localStorage
    // @ts-ignore: Implicit any for children prop
    const userDetails = JSON.parse(localStorage?.getItem('user'));

    if (userDetails && userDetails.JWTToken) {
      // If token is available, set it in the state
      // fetchData(userDetails.email)
      setLogoutTimer(userDetails.JWTToken, userDetails)
    } else {
      // If token is not available, redirect to the login page
      router.push('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  useEffect(() => {
    const currentPath = router.pathname;
    switch (currentPath) {
      case '/dashboard':
        setSelectedTab(0);
        break;
      case '/gallery':
        setSelectedTab(1);
        break;
      case '/certificates':
        setSelectedTab(2);
        break;
      case '/issue-pdf-certificate':
        setSelectedTab(2);
        break;
      case '/certificate':
        setSelectedTab(2);
        break;
      case ('/design'):
      case ('/badge/badge-dashboard'):
      case ('/badge/badge-form'):
      case ('/badge-designer'):
      case ('/badge/badgeDisplay'):
      case ('/designer'):
        setSelectedTab(3);
        break;
      case '/administration':
        setSelectedTab(4);
        break;
      case '/designer':
        setSelectedTab(5);
        break;
      default:
        setSelectedTab(10); // Default to the first tab
    }
  }, [router.pathname]);

  // @ts-ignore: Implicit any for children prop
  const handleClickTab = ((value) => {
    console.log(value)
    setSelectedTab(value)
  })


  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('firstlogin');
    sessionStorage.removeItem('badgeUrl');
    sessionStorage.removeItem('logoUrl');
    sessionStorage.removeItem('signatureUrl');
    sessionStorage.removeItem('issuerName');
    sessionStorage.removeItem('issuerDesignation');

    auth.signOut().then(() => {

    })

    router.push('/');
  };



  const setLogoutTimer = (token: string, user: any) => {
    interface DecodedToken {
      exp: number;
    }
    try {
      const decodedToken = jwtDecode<DecodedToken>(token);
      const expirationTimeUTC = (decodedToken.exp * 1000) - 60000; // Convert to milliseconds since epoch
      const timeout = expirationTimeUTC - Date.now();
      if (Date.now() >= expirationTimeUTC) {
        handleLogout();
      } else {
        handleRefresh(user)
      }
    } catch (error) {
      handleLogout();
    }
  };
  const routesWithLogoutButton = ['/certificates','/placeholder', '/badge-designer', '/issue-pdf-certificate', '/issue-certificate', '/certificate', '/certificate/[id]', '/certificate/download', '/dashboard', '/user-details', '/administration', '/gallery', '/issue-pdf-qr', '/dynamic-poc', '/settings', '/designer', '/design', '/badge/badge-dashboard', '/badge/badge-form', '/badge/badgeDisplay'];
  const handleConfirm = () => {
    setShowModal(false)
    handleLogout();

  };

  const handleCancel = () => {
    setShowModal(false);
  };




  return (
    <>
      <Modal className='modal-wrapper' show={showModal} centered >
        <Modal.Body className='py-4 d-flex flex-column text-center justify-content-center align-items-center'>

          <p className='modal-text mt-3'>Are You Sure You Want to Log Out?</p>
          <div className='d-flex justify-content-center mt-3'>
            <Button className='red-btn px-4 me-2' label='Leave' onClick={handleConfirm} />
            <Button className='golden' label='Stay' onClick={handleCancel} />
          </div>
        </Modal.Body>
      </Modal>
      <Navbar expand="lg" className="global-header navbar navbar-expand-lg navbar-light bg-light" >
        <Container fluid >
          <Navbar.Brand>
            <div className='nav-logo'>
              <Link onClick={() => { handleClickTab(0) }} className="navbar-brand" href="/dashboard">
                <ThemedImage
                  imageLight='https://images.netcomlearning.com/ai-certs/Certs365-logo.svg'
                  imageDark='/images/Certs365-white-logo.svg'
                  layout='fill'
                  objectFit="contain"
                  alt='AI Certs logo'
                />
              </Link>
            </div>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav d-md-none" />
          <Navbar.Collapse id="basic-navbar-nav"   >
            {routesWithLogoutButton.includes(router.pathname) && (
              <Nav className="me-auto w-100 d-flex justify-content-center align-items-md-center" >
                <Nav.Link
                  onClick={() => { handleClickTab(0) }} className={`nav-item ${selectedTab === 0 ? "tab-golden" : ""}`}
                  href="/dashboard"
                >Dashboard</Nav.Link>
                <Nav.Link onClick={() => { handleClickTab(1) }} className={`nav-item ${selectedTab === 1 ? "tab-golden" : ""}`} href="/gallery">
                  Gallery
                </Nav.Link>

                <Nav.Link onClick={() => { handleClickTab(3) }} className={`nav-item ${selectedTab === 3 ? "tab-golden" : ""}`} href="/design">
                  Designer
                </Nav.Link>

                <Nav.Link onClick={() => { handleClickTab(2) }} className={`nav-item ${selectedTab === 2 ? "tab-golden" : ""}`} href="/certificates">
                  Issuance
                </Nav.Link>
                <Nav.Link onClick={() => { handleClickTab(4) }} className={`nav-item ${selectedTab === 4 ? "tab-golden" : ""}`} href="/administration">
                  Administration
                </Nav.Link>
              </Nav>
            )}
            {routesWithLogoutButton.includes(router.pathname) && (
              <Navbar.Text>
                <NavDropdown
                  as={ButtonGroup}
                  align={{ md: 'end' }}
                  title={
                    <div className='picture'>
                      <span>
                        {formData?.name?.split(' ')?.slice(0, 2)?.map(word => word[0])?.join('')}
                      </span>

                      <div className='dropdown-arrow'>
                        <svg className='arrow' xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                          <g>
                            <path id="Vector" fillRule="evenodd" clipRule="evenodd" d="M3.96967 6.21967C3.67678 6.51257 3.67678 6.98744 3.96967 7.28033L8.46967 11.7803C8.76255 12.0732 9.23745 12.0732 9.53032 11.7803L14.0303 7.28033C14.3232 6.98744 14.3232 6.51257 14.0303 6.21967C13.7374 5.92678 13.2625 5.92678 12.9697 6.21967L9 10.1894L5.03033 6.21967C4.73743 5.92678 4.26256 5.92678 3.96967 6.21967Z" fill="#5A677E" />
                          </g>
                        </svg>
                        <svg className='hover-arrow' xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                          <g>
                            <path id="Vector" fillRule="evenodd" clipRule="evenodd" d="M3.96967 6.21967C3.67678 6.51257 3.67678 6.98744 3.96967 7.28033L8.46967 11.7803C8.76255 12.0732 9.23745 12.0732 9.53032 11.7803L14.0303 7.28033C14.3232 6.98744 14.3232 6.51257 14.0303 6.21967C13.7374 5.92678 13.2625 5.92678 12.9697 6.21967L9 10.1894L5.03033 6.21967C4.73743 5.92678 4.26256 5.92678 3.96967 6.21967Z" fill="#fff" />
                          </g>
                        </svg>
                      </div>
                    </div>
                  }
                  className='profile'
                >
                  <div className='user-info' >
                    <div className='divider'>
                      <div className='info d-flex align-items-center' >
                        <div className='icon'>
                          <Image
                            src="https://images.netcomlearning.com/ai-certs/icons/profile-dark.svg"
                            width={18}
                            height={18}
                            alt='Profile'
                          />
                        </div>
                        <div>
                          <span className='label' >Issuer Name</span>
                          <span className='data'>{formData?.name || ""}</span>
                        </div>
                      </div>
                      <div className='info d-flex align-items-center'>
                        <div className='icon'>
                          <Image
                            src="https://images.netcomlearning.com/ai-certs/icons/organization.svg"
                            width={18}
                            height={18}
                            alt='Profile'
                          />
                        </div>
                        <div>
                          <span className='label'>Organization Name</span>
                          <span className='data'>{formData?.organization || ""}</span>
                        </div>
                      </div>

                      <div className='info d-flex align-items-center'>
                        <div className='icon'>
                          <Image
                            src="https://images.netcomlearning.com/ai-certs/icons/certificate-issued.svg"
                            width={18}
                            height={18}
                            alt='Profile'
                          />
                        </div>
                        <div>
                          <span className='label'>No. of Certification Issued</span>
                          <span className='data'>{responseData ? responseData.data.issued : ""}</span>
                        </div>
                      </div>
                      <div className='info d-flex align-items-center'>
                        <div className='icon'>
                          <Image
                            src="https://images.netcomlearning.com/ai-certs/icons/certificate-issued.svg"
                            width={18}
                            height={18}
                            alt='Profile'
                          />
                        </div>
                        <div>
                          <span className='label'>Credit Limit</span>
                          {/* <span className='data'>{creditLimit}</span> */}
                          {/* <span className='data'>{creditLimit}</span> */}
                          <span className='data'>{creditRemaining}</span>
                        </div>
                      </div>
                      {/*plan type  */}
                      <div className='info d-flex align-items-center'>
                        <div className='icon'>
                          <Image
                            src="https://images.netcomlearning.com/ai-certs/icons/certificate-issued.svg"
                            width={18}
                            height={18}
                            alt='Profile'
                          />
                        </div>
                        <div>
                          <span className='label'>Plan</span>
                          <span className='data'>{planName}</span>
                        </div>
                      </div>
                    </div>
                    <Button label="View &#8594;" className='golden py-2 ps-0 pe-0 w-100 mt-4' onClick={handleViewProfile} />
                  </div>
                </NavDropdown>
              </Navbar.Text>
            )}
            <Navbar.Text>
              <div className='icons-container'>
                <div className='logout help' onClick={() => window.open('https://help.certs365.io/', '_blank')}>
                  {isDarkMode ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50" fill="none">
                      <rect width="50" height="50" fill="#2A2E36" />
                      <path fillRule="evenodd" clipRule="evenodd" d="M25 12C32.1747 12 38 17.8253 38 25C38 32.1747 32.1747 38 25 38C17.8253 38 12 32.1747 12 25C12 17.8253 17.8253 12 25 12ZM25 14.6002C19.2602 14.6002 14.6002 19.2602 14.6002 25C14.6002 30.7398 19.2602 35.3998 25 35.3998C30.7398 35.3998 35.3998 30.7398 35.3998 25C35.3998 19.2602 30.7398 14.6002 25 14.6002ZM24.8855 29.8254C25.6028 29.8254 26.1853 30.4079 26.1853 31.1251C26.1853 31.8427 25.6028 32.4252 24.8855 32.4252C24.1679 32.4252 23.5854 31.8427 23.5854 31.1251C23.5854 30.4079 24.1679 29.8254 24.8855 29.8254ZM26.2614 27.038V27.5294C26.2614 28.2548 25.6708 28.8266 24.9613 28.8266C24.2518 28.8266 23.6612 28.2619 23.6612 27.5266V27.038C23.6612 24.9775 24.5857 23.9729 25.5894 23.1539C25.8695 22.9255 26.1569 22.7181 26.4096 22.4884C26.6005 22.3153 26.7812 22.1359 26.8283 21.8482C26.91 21.3503 26.8476 20.9574 26.6533 20.6695C26.3606 20.2361 25.8362 20.053 25.3906 20.0211C23.5355 19.8882 23.0993 21.6953 23.0993 21.6953C22.9311 22.3929 22.2282 22.8226 21.5306 22.6541C20.8333 22.4859 20.4037 21.783 20.5718 21.0854C20.5718 21.0854 21.5247 17.138 25.5759 17.4278C26.7356 17.5105 28.0473 18.0874 28.8082 19.2149C29.3159 19.9672 29.6073 20.9699 29.3939 22.2697C29.2026 23.4344 28.5106 24.1557 27.666 24.8253C27.0483 25.3148 26.2614 25.7532 26.2614 27.038Z" fill="white" />
                    </svg>
                  ) : (
                    <svg className='icon' xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50" fill="none">
                      <rect width="50" height="50" rx="10" fill="#F3F3F3" />
                      <path fillRule="evenodd" clipRule="evenodd" d="M25 12C32.1747 12 38 17.8253 38 25C38 32.1747 32.1747 38 25 38C17.8253 38 12 32.1747 12 25C12 17.8253 17.8253 12 25 12ZM25 14.6002C19.2602 14.6002 14.6002 19.2602 14.6002 25C14.6002 30.7398 19.2602 35.3998 25 35.3998C30.7398 35.3998 35.3998 30.7398 35.3998 25C35.3998 19.2602 30.7398 14.6002 25 14.6002ZM24.8855 29.8254C25.6028 29.8254 26.1853 30.4079 26.1853 31.1251C26.1853 31.8427 25.6028 32.4252 24.8855 32.4252C24.1679 32.4252 23.5854 31.8427 23.5854 31.1251C23.5854 30.4079 24.1679 29.8254 24.8855 29.8254ZM26.2614 27.038V27.5294C26.2614 28.2548 25.6708 28.8266 24.9613 28.8266C24.2518 28.8266 23.6612 28.2619 23.6612 27.5266V27.038C23.6612 24.9775 24.5857 23.9729 25.5894 23.1539C25.8695 22.9255 26.1569 22.7181 26.4096 22.4884C26.6005 22.3153 26.7812 22.1359 26.8283 21.8482C26.91 21.3503 26.8476 20.9574 26.6533 20.6695C26.3606 20.2361 25.8362 20.053 25.3906 20.0211C23.5355 19.8882 23.0993 21.6953 23.0993 21.6953C22.9311 22.3929 22.2282 22.8226 21.5306 22.6541C20.8333 22.4859 20.4037 21.783 20.5718 21.0854C20.5718 21.0854 21.5247 17.138 25.5759 17.4278C26.7356 17.5105 28.0473 18.0874 28.8082 19.2149C29.3159 19.9672 29.6073 20.9699 29.3939 22.2697C29.2026 23.4344 28.5106 24.1557 27.666 24.8253C27.0483 25.3148 26.2614 25.7532 26.2614 27.038Z" fill="#5A677E" />
                    </svg>
                  )}
                  <svg className='hover-icon' xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50" fill="none">
                    <rect width="50" height="50" fill="#CFA935" />
                    <path fillRule="evenodd" clipRule="evenodd" d="M25 12C32.1747 12 38 17.8253 38 25C38 32.1747 32.1747 38 25 38C17.8253 38 12 32.1747 12 25C12 17.8253 17.8253 12 25 12ZM25 14.6002C19.2602 14.6002 14.6002 19.2602 14.6002 25C14.6002 30.7398 19.2602 35.3998 25 35.3998C30.7398 35.3998 35.3998 30.7398 35.3998 25C35.3998 19.2602 30.7398 14.6002 25 14.6002ZM24.8855 29.8254C25.6028 29.8254 26.1853 30.4079 26.1853 31.1251C26.1853 31.8427 25.6028 32.4252 24.8855 32.4252C24.1679 32.4252 23.5854 31.8427 23.5854 31.1251C23.5854 30.4079 24.1679 29.8254 24.8855 29.8254ZM26.2614 27.038V27.5294C26.2614 28.2548 25.6708 28.8266 24.9613 28.8266C24.2518 28.8266 23.6612 28.2619 23.6612 27.5266V27.038C23.6612 24.9775 24.5857 23.9729 25.5894 23.1539C25.8695 22.9255 26.1569 22.7181 26.4096 22.4884C26.6005 22.3153 26.7812 22.1359 26.8283 21.8482C26.91 21.3503 26.8476 20.9574 26.6533 20.6695C26.3606 20.2361 25.8362 20.053 25.3906 20.0211C23.5355 19.8882 23.0993 21.6953 23.0993 21.6953C22.9311 22.3929 22.2282 22.8226 21.5306 22.6541C20.8333 22.4859 20.4037 21.783 20.5718 21.0854C20.5718 21.0854 21.5247 17.138 25.5759 17.4278C26.7356 17.5105 28.0473 18.0874 28.8082 19.2149C29.3159 19.9672 29.6073 20.9699 29.3939 22.2697C29.2026 23.4344 28.5106 24.1557 27.666 24.8253C27.0483 25.3148 26.2614 25.7532 26.2614 27.038Z" fill="#ffffff" />
                  </svg>
                </div>
              </div>
            </Navbar.Text>
            <Navbar.Text>
  <Link href="/settings" className="icons-container-settings">
    <Image src={settingsIcon} alt="Setting icon" />
  </Link>
</Navbar.Text>

            <Navbar.Text>
              <ThemeSwitcher />
            </Navbar.Text>
            <Navbar.Text>
              {routesWithLogoutButton.includes(router.pathname) && (
                <div className='icons-container'>
                  <div className='logout' onClick={() => { setShowModal(true) }}>
                    {isDarkMode ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50" fill="none">
                        <rect width="50" height="50" fill="#2A2E36" />
                        <path fillRule="evenodd" clipRule="evenodd" d="M24.8138 33.859V35.1548C24.8138 36.1939 24.2959 37.0909 23.3961 37.6104C22.9631 37.8604 22.4799 37.9998 21.9788 38.0001C21.4774 38.0003 20.9943 37.8606 20.561 37.6104L14.7996 34.284C13.8996 33.7644 13.3818 32.8676 13.3818 31.8284V14.8355C13.3818 13.2719 14.6538 12 16.2174 12H28.9061C30.4698 12 31.7418 13.2718 31.7418 14.8355V18.4176C31.7418 18.9314 31.3246 19.3487 30.8108 19.3487C30.2968 19.3487 29.8799 18.9315 29.8799 18.4176V14.8355C29.8799 14.2986 29.443 13.8617 28.9061 13.8617H17.7875L23.3961 17.1004C24.2956 17.6199 24.8138 18.5167 24.8138 19.5555V31.9971H28.9061C29.443 31.9971 29.8799 31.5605 29.8799 31.0235V27.8834C29.8799 27.3692 30.2965 26.9523 30.8108 26.9523C31.3248 26.9523 31.7418 27.3693 31.7418 27.8834V31.0235C31.7418 32.5872 30.4698 33.859 28.9061 33.859H24.8138ZM33.4407 23.8604L32.4154 24.8857C32.0518 25.2492 32.0519 25.8386 32.4154 26.2022C32.5904 26.3773 32.8262 26.4746 33.0736 26.4746C33.3213 26.4746 33.5569 26.3775 33.7322 26.2022L36.3463 23.5876C36.7098 23.2241 36.7098 22.635 36.3463 22.2715L33.7322 19.6573C33.3686 19.2937 32.7792 19.2939 32.4154 19.6573C32.052 20.0204 32.0521 20.6101 32.4154 20.9734L33.4407 21.9984H26.572C26.0576 21.9984 25.6411 22.4152 25.6411 22.9295C25.6411 23.4439 26.0577 23.8604 26.572 23.8604H33.4407V23.8604Z" fill="white" />
                      </svg>
                    ) : (
                      <svg className='icon' xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50" fill="none">
                        <rect width="50" height="50" fill="#F3F3F3" />
                        <path fillRule="evenodd" clipRule="evenodd" d="M24.8138 33.859V35.1548C24.8138 36.1939 24.2959 37.0909 23.3961 37.6104C22.9631 37.8604 22.4799 37.9998 21.9788 38.0001C21.4774 38.0003 20.9943 37.8606 20.561 37.6104L14.7996 34.284C13.8996 33.7644 13.3818 32.8676 13.3818 31.8284V14.8355C13.3818 13.2719 14.6538 12 16.2174 12H28.9061C30.4698 12 31.7418 13.2718 31.7418 14.8355V18.4176C31.7418 18.9314 31.3246 19.3487 30.8108 19.3487C30.2968 19.3487 29.8799 18.9315 29.8799 18.4176V14.8355C29.8799 14.2986 29.443 13.8617 28.9061 13.8617H17.7875L23.3961 17.1004C24.2956 17.6199 24.8138 18.5167 24.8138 19.5555V31.9971H28.9061C29.443 31.9971 29.8799 31.5605 29.8799 31.0235V27.8834C29.8799 27.3692 30.2965 26.9523 30.8108 26.9523C31.3248 26.9523 31.7418 27.3693 31.7418 27.8834V31.0235C31.7418 32.5872 30.4698 33.859 28.9061 33.859H24.8138ZM33.4407 23.8604L32.4154 24.8857C32.0518 25.2492 32.0519 25.8386 32.4154 26.2022C32.5904 26.3773 32.8262 26.4746 33.0736 26.4746C33.3213 26.4746 33.5569 26.3775 33.7322 26.2022L36.3463 23.5876C36.7098 23.2241 36.7098 22.635 36.3463 22.2715L33.7322 19.6573C33.3686 19.2937 32.7792 19.2939 32.4154 19.6573C32.052 20.0204 32.0521 20.6101 32.4154 20.9734L33.4407 21.9984H26.572C26.0576 21.9984 25.6411 22.4152 25.6411 22.9295C25.6411 23.4439 26.0577 23.8604 26.572 23.8604H33.4407V23.8604Z" fill="#5A677E" />
                      </svg>
                    )}
                    <svg className='hover-icon' xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50" fill="none">
                      <rect width="50" height="50" fill="#CFA935" />
                      <path fillRule="evenodd" clipRule="evenodd" d="M24.8138 33.859V35.1548C24.8138 36.1939 24.2959 37.0909 23.3961 37.6104C22.9631 37.8604 22.4799 37.9998 21.9788 38.0001C21.4774 38.0003 20.9943 37.8606 20.561 37.6104L14.7996 34.284C13.8996 33.7644 13.3818 32.8676 13.3818 31.8284V14.8355C13.3818 13.2719 14.6538 12 16.2174 12H28.9061C30.4698 12 31.7418 13.2718 31.7418 14.8355V18.4176C31.7418 18.9314 31.3246 19.3487 30.8108 19.3487C30.2968 19.3487 29.8799 18.9315 29.8799 18.4176V14.8355C29.8799 14.2986 29.443 13.8617 28.9061 13.8617H17.7875L23.3961 17.1004C24.2956 17.6199 24.8138 18.5167 24.8138 19.5555V31.9971H28.9061C29.443 31.9971 29.8799 31.5605 29.8799 31.0235V27.8834C29.8799 27.3692 30.2965 26.9523 30.8108 26.9523C31.3248 26.9523 31.7418 27.3693 31.7418 27.8834V31.0235C31.7418 32.5872 30.4698 33.859 28.9061 33.859H24.8138ZM33.4407 23.8604L32.4154 24.8857C32.0518 25.2492 32.0519 25.8386 32.4154 26.2022C32.5904 26.3773 32.8262 26.4746 33.0736 26.4746C33.3213 26.4746 33.5569 26.3775 33.7322 26.2022L36.3463 23.5876C36.7098 23.2241 36.7098 22.635 36.3463 22.2715L33.7322 19.6573C33.3686 19.2937 32.7792 19.2939 32.4154 19.6573C32.052 20.0204 32.0521 20.6101 32.4154 20.9734L33.4407 21.9984H26.572C26.0576 21.9984 25.6411 22.4152 25.6411 22.9295C25.6411 23.4439 26.0577 23.8604 26.572 23.8604H33.4407V23.8604Z" fill="#ffffff" />
                    </svg>
                  </div>
                </div>
              )}
            </Navbar.Text>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default Navigation;
