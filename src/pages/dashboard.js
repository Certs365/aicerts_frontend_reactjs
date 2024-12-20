import React, { useEffect, useState } from "react";
import DashboardCard from "../components/dashboardCard"; // Importing DashboardCard component
import BarChartSecond from "../components/barChartSecond"; // Importing LineChart component
import BarChart from "../components/barChart"; // Importing BarChart component
import { useRouter } from "next/router";
import PieChart from "../components/pieChart";
import { Col, Container, Row, Modal } from "react-bootstrap";
import Image from 'next/legacy/image';
import Button from '../../shared/button/button';
import { encryptData } from "../utils/reusableFunctions";
import issuance from '../services/issuanceServices';

const apiUrl = process.env.NEXT_PUBLIC_BASE_URL;
const testApiUrl = process.env.NEXT_PUBLIC_BASE_URL_USER;
const secretKey = process.env.NEXT_PUBLIC_BASE_ENCRYPTION_KEY;
const Dashboard = () => {
  const [token, setToken] = useState(null); // State variable for storing token
  const [email, setEmail] = useState(null); // State variable for storing email
  const [formData, setFormData] = useState({
    // State variable for form data
    email: "",
    certificateNumber: "",
    name: "",
    course: "",
    grantDate: null, // Use null for Date values
    expirationDate: null, // Use null for Date values
  });
  const [responseData, setResponseData] = useState(null);
  // const [warning, setWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');
  const [warnModal, setWarnModal] = useState(true);
  const [expiryDate, setExpiryDate] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Check if the token is available in localStorage
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (storedUser && storedUser.JWTToken) {
      // If token is available, set it in the state
      setToken(storedUser.JWTToken);
      setEmail(storedUser.email);
      // Set formData.email with stored email
      setFormData((prevFormData) => ({
        ...prevFormData,
        email: storedUser.email,
      }));
      fetchData(storedUser.email);
    } else {
      // If token is not available, redirect to the login page
      router.push("/");
    }
  }, [router]);

  useEffect(() => {
    const flag = localStorage.getItem('firstlogin');
    // const storedUser = JSON.parse(localStorage.getItem("user"));
    // if (storedUser && storedUser.JWTToken) {
    //   setEmail(storedUser.email);
    // }
    //  
    if (flag === "true") {
      const getRemainingDays = async () => {
        try {
          const response = await fetch(`${testApiUrl}/api/get-subscription-details`, {
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
          if (data.remainingDays !== null && data.remainingDays !== undefined) {
            // localStorage.setItem('expirydate', data.remainingDays);
            console.log(typeof data.remainingDays)
            setExpiryDate(data.remainingDays);
            console.log(expiryDate)
            // setWarning(true);
          }
          
        } catch (error) {
          console.error('Error fetching remaining days:', error);
        } 
      };
      if (email) {  
        getRemainingDays();
      }
    }
  }, [email]);

  const fetchData = async (email) => {
    const payload = {
      email: email,
      queryCode: 1,
    };
    // const encryptedData = encryptData(payload);

    try {
      // const response = await fetch(`${apiUrl}/api/get-issuers-log`, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     data: encryptedData,
      //   }),
      // });
      issuance.appIssuersLog(payload, (response) => {
        // if (!response.ok) {
        //   throw new Error("Failed to fetch data");
        // }
        if(response.status === "SUCCESS"){
          const data = response.data;
          setResponseData(data);
        }else{
          console.log("Failed to fetch data");
          // throw new Error("Failed to fetch data");
        }
  
      })
      // if (!response.ok) {
      //   throw new Error("Failed to fetch data");
      // }

      // const data = await response.json();
      // setResponseData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
      // Handle error as needed
    }
  };

  const cardsData = [
    {
      title: "Certification",
      titleValue: "Issued",
      badgeIcon: "",
      value: responseData?.data?.issued || "0",
      percentage: "+21.01%",
      image: "/icons/badge-cert.svg",
    },
    {
      title: "Monthly Certification",
      titleValue: "Reissued",
      badgeIcon: "",
      value: responseData?.data?.renewed || "0",
      percentage: "+21.01%",
      image: "/icons/badge-cert-issue.svg",
    }, //addd-mine

    {
      title: "Certification",
      titleValue: "Reactivated",
      badgeIcon: "",
      value: responseData?.data?.reactivated || "0",
      percentage: "+21.01%",
      image: "/icons/badge-cert-reactive.svg",
    },
    {
      title: "Certification",
      titleValue: "Revoked",
      badgeIcon: "",
      value: responseData?.data?.revoked || "0",
      percentage: "+21.01%",
      image: "/icons/badge-cert-reactive.svg"
    },
  ];

  const closeModal = () => {
    setWarnModal(false);
    // localStorage.removeItem('expirydate');
    localStorage.setItem('firstlogin', "false");
  }

  return (
    <div className=" page-bg">
      <div className="container cards-container-main">
        {/* Mapping through cardsData and rendering DashboardCard component for each item */}
        {cardsData.map((item, index) => {
          return <DashboardCard key={index} item={item} />;
        })}
      </div>
      <div className="main-container gap">
        {/* Rendering LineChart component */}
        <Container>
      
          <BarChartSecond />
        </Container>
        {/* Rendering BarChart component */}
        <Container className="d-flex flex-column flex-md-row justify-content-center align-items-center gap-2">
          <Col xs={12} md={4} className="mb-4 mb-md-0">
            <PieChart />
          </Col>
          <Col xs={12} md={8}>
            <BarChart />
          </Col>
       
        </Container>

         {/* { warning != false && */}
         {expiryDate !== null && warnModal &&   //todo=> modal not showing on initial load, fix it
             <Modal className='modal-wrapper' show={warnModal} centered>
                <Modal.Header className='extend-modal-header'>
                  <span className='extend-modal-header-text'>WARNING</span>
                </Modal.Header>
                <Modal.Body >
                   <div className='error-icon'>
                     <Image
                        src="/icons/invalid-password.gif"
                        layout='fill'
                        objectFit='contain'
                        alt='Loader'
                      />
                   </div>
                    <div className='text modal-text' style={{ color: '#ff5500' }}>{
                    expiryDate > 1 ? `Your plan will expire in ${expiryDate} days.`
                    : expiryDate === 1 ? `Your plan will expire in ${expiryDate} day.`
                    :
                    'Your subscription plan has expired.'
                    }
                    </div>
                    {/* <div className='text modal-text' style={{ color: '#ff5500' }}>{warningMessage}</div> */}
                    </Modal.Body>
                    <Modal.Footer className='d-flex justify-content-center'>
                      <Button  className='red-btn px-4' label='Ok' onClick={closeModal}/>
                    </Modal.Footer>
              </Modal> }
      </div>
    </div>
  );
};

export default Dashboard;
