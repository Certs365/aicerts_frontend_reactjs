// @ts-nocheck

import React, { useEffect, useState } from 'react';
import { Card, Col, Form, Modal, Row } from 'react-bootstrap';
import { Box, TextField } from '@mui/material';
import Button from '../../shared/button/button';
import Image from 'next/image';
import { loadStripe } from "@stripe/stripe-js";
import qr1 from "/assets/img/qr-1.png";
import qr2 from "/assets/img/qr-2.png";
import qr3 from "/assets/img/qr-3.png";
import qr4 from "/assets/img/qr-4.png";
import qr5 from "/assets/img/qr-5.png";
import qr6 from "/assets/img/qr-6.png";
import qr7 from "/assets/img/qr-7.png";
import p1 from "/assets/img/p1.png";
import p2 from "/assets/img/p2.png";
import user from '@/services/userServices';
import PrimaryButton from '@/common/button/primaryButton';
import SecondaryButton from '@/common/button/secondaryButton';
import QrCodeSelector from '@/components/qrCodeSelector';
import { toast } from 'react-toastify';
import { GET_USER_BY_EMAIL } from '@/utils/Constants';
import { commonAuthApi } from '@/services/common';
const apiUrl = process.env.NEXT_PUBLIC_BASE_URL_USER;
const stripeUrl = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
interface DateRange {
  from: string;
  to: string;
}

const Settings: React.FC = () => {
  const [issuanceDate, setIssuanceDate] = useState<DateRange>({
    from: '',
    to: '',
  });

  const [reportDate, setReportDate] = useState<DateRange>({
    from: '',
    to: '',
  });
  const [issuanceReportLoading, setIssuanceReportLoading] = useState(false);
  const [invoiceReportLoading, setInvoiceReportLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  // Adjust the event type to be more generic for React-Bootstrap Form.Control
  const handleDateChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: keyof DateRange
  ) => {
    setIssuanceDate({
      ...issuanceDate,
      [field]: e.target.value,
    });
  };

  const handleDateReportChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: keyof DateRange
  ) => {
    setReportDate({
      ...reportDate,
      [field]: e.target.value,
    });
  };

  const [email, setEmail] = useState('');
  const [data, setData] = useState([]);
  const [planName, setPlanName] = useState('');
  const [show, setShow] = useState(false);
  const [calculatedValue, setCalculatedValue] = useState(0);
  const [planDuration, setPlanDuration] = useState(0);
  const [totalCredits, setTotalCredits] = useState(0);
  const [paymentEmail, setPaymentEmail] = useState('')
  const [paymentId, setPaymentId] = useState('');
  const [selectedQr, setSelectedQr] = useState(null);
  const [selectedBlockchain, setSelectedBlockchain] = useState(null);


  const isShowPricingEnabled = !isNaN(planDuration) && planDuration !== 0 && !isNaN(totalCredits) && totalCredits !== 0;

  const handleQrClick = (qr) => {
    setSelectedQr(qr);
  };

  useEffect(() => {
    if (!isShowPricingEnabled) {
      setCalculatedValue(0);
    }
  }, [isShowPricingEnabled])



  const handlePolygon = async () => {
    setLoading(true);
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    const data = {
      email: storedUser.email, blockchainPreference: selectedBlockchain, id: storedUser?.issuerId, name: storedUser?.name
    };
    try {
      await user.updateIssuer(data, (response) => {
        const userData = response.data;
        const userDetails = userData?.data;
        toast.success(userData?.message || "Updated Successfully")
      });
    } catch (error) {
      toast.error('Error updating QR preference');

    } finally {
      setLoading(false);
    }
  };


  const handleSubmit = async () => {
    setIsLoading(true);
    setNow(10)

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
    const data = { email, ...formData };
    try {
      // const response = await fetch(`${apiUrl}/api/update-issuer`, {
      //     method: "POST",
      //     headers: {
      //         'Content-Type': 'application/json',
      //         'Authorization': `Bearer ${token}`,
      //     },
      //     body: JSON.stringify({
      //         data:encryptedData 
      //     })
      // });
      user.updateIssuer(data, async (response) => {
        const userData = response.data;
        const userDetails = userData?.data;
        setLoginSuccess("Details Updated Successfully")
        setShow(true);
      })

    } catch (error) {
      console.error('Error Verifying Certificate:', error);
      // Handle error
    } finally {
      stopProgress();
      setIsLoading(false);
    }
  };

  // get all subscription plan details
  // useEffect(() => {
  //   const fetchData = async () => {
  //     const response = await fetch(`${apiUrl}/api/get-subscription-plans`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ email }),
  //     });
  //     const responseData = await response.json();
  //      
  //     setData(responseData.details);
  //     // const data = await response.json();
  //     // setData(typeof data === 'string' ? JSON.parse(data) : data);
  //   };
  //   fetchData();
  // }, []);

  const handleBlockchainClick = (blockchain) => {
    setSelectedBlockchain(blockchain);
  };


  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setEmail(parsedUser.email);
      getPlanName(parsedUser.email);
    }
  }, []);

  useEffect(() => {
    if (!email) return;
    const fetchData = async () => {
      const response = await fetch(`${apiUrl}/api/get-subscription-plans`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      const responseData = await response.json();
      console.log(responseData)
      setData(responseData.details);
      // const data = await response.json();
      // setData(typeof data === 'string' ? JSON.parse(data) : data);
    };
    fetchData();
  }, [email]);


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
    } catch (error) {
      console.error('Error fetching plan name:', error);
    }
  };

  const handlePlanSelection = async (card: any) => {
    try {

      const response = await fetch(`${apiUrl}/api/add-user-subscription-plan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          code: card.code,
          // subscriptionPlanName: card.title,
          // allocatedCredentials: card.limit,
          // currentCredentials: card.limit,
        }),
      });


    } catch (error) {
      console.error('Error selecting plan:', error);
    }

  }

  // todo-> can merge it in handleplanselection ??
  const makePayment = async (card: any) => {

    console.log(card)
    console.log(typeof card.fee);
    console.log(typeof card.title);
    console.log(typeof card.limit);
    console.log(typeof card.rate);

    const stripe = await loadStripe(`${stripeUrl}`);
    const body = {
      plan: {
        name: card.title,
        fee: card.fee,
        limit: card.limit,
        rate: card.rate,
        // expiration: 30,
      },
    }
    const headers = {
      "Content-Type": "application/json",
    }
    // try {
    const response = await fetch(`${apiUrl}/api/create-checkout-session`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(body)
    })
    const session = await response.json();

    console.log(session);
    const result: any = stripe?.redirectToCheckout({ sessionId: session.id });   //todo-> type any is given
    console.log(result)

    if (result?.error) {
      console.error('Error redirecting to Checkout:', result.error);
    }
    if (!window.location.href.includes('canceled=true')) {

      handlePlanSelection(card);
    }
    //   } catch (error) {
    //     console.error('Error during payment:', error);
    //     return;
    // }
  }

  const formatDate = (date: Date): string => {
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Get month and pad with leading zero
    const day = date.getDate().toString().padStart(2, '0'); // Get day and pad with leading zero
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  const handleDownload = async (): Promise<void> => {
    try {
      setIssuanceReportLoading(true); // Set loading to true
      const startDate = formatDate(new Date(issuanceDate.from));
      const endDate = formatDate(new Date(issuanceDate.to));

      const payload = {
        email,
        startDate,
        endDate,
      };

      const response = await fetch(`${apiUrl}/api/generate-excel-report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Failed to fetch data');

      const data = await response.blob();

      if (data) {
        const url = URL.createObjectURL(data);
        const link = document.createElement('a');
        link.href = url;
        link.download = `issuance_report_${startDate}_${endDate}.xlsx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Network error:', error);
    } finally {
      setIssuanceReportLoading(false); // Set loading to false
    }
  };

  const handleReport = async (): Promise<void> => {
    try {
      setInvoiceReportLoading(true); // Set loading to true
      const startDate = formatDate(new Date(reportDate.from));
      const endDate = formatDate(new Date(reportDate.to));

      const payload = {
        email,
        startDate,
        endDate,
      };

      const response = await fetch(`${apiUrl}/api/generate-invoice-report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Failed to fetch data');

      const data = await response.blob();

      if (data) {
        const url = URL.createObjectURL(data);
        const link = document.createElement('a');
        link.href = url;
        link.download = `invoice_report_${startDate}_${endDate}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Network error:', error);
    } finally {
      setInvoiceReportLoading(false); // Set loading to false
    }
  };

  useEffect(() => {
    const fetchData = async (email: string) => {
      const data = { email: email };
      try {
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        if (storedUser?.email) {
          // Fetch the issuer data using the user service
          user.getIssuerByEmail(data, (response) => {
            const userData = response.data;
            const userDetails = userData?.data;
            setSelectedBlockchain(userDetails?.blockchainPreference)
            setSelectedQr(userDetails?.qrPreference)
          });
        }
      } catch (error) {
        console.error('Error fetching issuer data:', error);
      } finally {
        setLoading(false);
      }
    };

    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    if (storedUser?.email) {
      fetchData(storedUser.email);
    }
  }, []);



  const handleNewPrice = () => {
    setCalculatedValue(planDuration * totalCredits * 5);
  }

  const handleEnterprisePlan = async () => {
    const card = {
      title: 'Enterprise',
      fee: calculatedValue,
      limit: totalCredits,
      duration: planDuration,
      rate: 5,
    }
    // makePayment(card);
    try {

      const response = await fetch(`${apiUrl}/api/add-enterprise-subscription-plan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          subscriptionPlanName: card.title,
          subscriptionDuration: planDuration,
          allocatedCredentials: totalCredits,
        }),
      });

    } catch (error) {
      console.error('Error selecting plan:', error);
    }

    // handlePlanSelection(card);
  }

  const handleGetUser = async (email) => {

    setSelectedQr(1)
    setSelectedBlockchain(1)
  };

  const handlePaymentGrievance = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/checkout-grievance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: paymentEmail,
          paymentID: paymentId,
        }),
      });
      setPaymentEmail('');
      setPaymentId('');

    } catch (error) {
      console.error('Error sending email:', error);
    }
  }



  return (
    <div className="page-bg">
      <div className="position-relative settings-container h-100">
        <div className="settings-title">
          <h3>Settings</h3>
        </div>

        {/* Issuance Report */}
        <div className="org-details mb-5">
          <h2 className="title">Issuance Report</h2>
          <Row className="d-flex align-items-center justify-content-center mt-3">
            <Col xs={12} md={4}>
              <Form.Label className="label-settings">From:</Form.Label>
              <Form.Control
                type="date"
                className="search-input-setting"
                value={issuanceDate.from}
                onChange={(e) => handleDateChange(e, 'from')}
              />
            </Col>
            <Col xs={12} md={4}>
              <Form.Label className="label-settings">To:</Form.Label>
              <Form.Control
                type="date"
                className="search-input-setting"
                value={issuanceDate.to}
                onChange={(e) => handleDateChange(e, 'to')}
              />
            </Col>
            <Col className="mt-4" xs={12} md={3}>
              <Button
                onClick={handleDownload}
                label={
                  issuanceReportLoading ? (
                    <span>Downloading...</span>
                  ) : (
                    'Download'
                  )
                }
                className="global-btn golden"
                disabled={issuanceReportLoading || !issuanceDate.from || !issuanceDate.to}
              />
            </Col>
          </Row>
        </div>

        {/* Invoice Report */}
        <div className="org-details">
          <h2 className="title">Invoice Report</h2>
          <Row className="d-flex align-items-center justify-content-center mt-3">
            <Col xs={12} md={4}>
              <Form.Label className="label-settings">From:</Form.Label>
              <Form.Control
                type="date"
                className="search-input-setting"
                value={reportDate.from}
                onChange={(e) => handleDateReportChange(e, 'from')}
              />
            </Col>
            <Col xs={12} md={4}>
              <Form.Label className="label-settings">To:</Form.Label>
              <Form.Control
                type="date"
                className="search-input-setting"
                value={reportDate.to}
                onChange={(e) => handleDateReportChange(e, 'to')}
              />
            </Col>
            <Col className="mt-4" xs={12} md={3}>
              <Button
                onClick={handleReport}

                label={
                  invoiceReportLoading ? (
                    <span>Downloading...</span>
                  ) : (
                    'Download'
                  )
                }
                className="global-btn golden"
                disabled={invoiceReportLoading || !reportDate.from || !reportDate.to}
              />
            </Col>
          </Row>
        </div>

        {/* QR  Code */}
        <QrCodeSelector qrCodes={[qr1, qr2, qr3, qr4, qr5, qr6, qr7]} />

        {/* Default Blockchain */}
        <div className="org-details mb-5">
          <h2 className="title">Default Blockchain</h2>
          <Row className="d-flex align-items-center ml-3">
            <Col className="mt-4" xs={12} md={3}>
              <Row className="d-flex align-items-center justify-content-center mt-3 gap-5">
                <Col xs={12} md={6}>
                  <div
                    className={`blockchain-button polygon ${selectedBlockchain === 0 ? 'selected' : ''}`}
                    onClick={() => handleBlockchainClick(0)}
                  >
                    <Image width={110} height={60} src={p1} alt="Polygon logo" />
                  </div>
                </Col>
                <Col xs={12} md={4}>
                  <div
                    className={`blockchain-button optimism ${selectedBlockchain === 1 ? 'selected' : ''}`}
                    onClick={() => handleBlockchainClick(1)}
                  >
                    <Image width={110} height={60} src={p2} alt="Optimism logo" />
                  </div>

                </Col>

              </Row>

              {/* Button aligned to the right */}

            </Col>
          </Row>
          <div className="d-flex justify-content-end mt-4 p-2">
            <PrimaryButton
              classes="p-3"
              label="Change Blockchain"
              loading={loading}
              loadingText="Updating..."
              onClick={handlePolygon}
            />
          </div>
        </div>



        {/* App view mode */}
        {/* <div className="org-details mb-5">
          <h2 className="title">App View Mode</h2>
          <Row className=" d-flex align-items-center ml-3">
            <Col className="mt-4" xs={12} md={3}>
              <Row className=" d-flex align-items-center justify-content-center mt-3 gap-5">
                <Col xs={12} md={4} >
                  <div className="switch-button  light">Light</div>
                </Col>
                <Col xs={12} md={4}>
                  <div className="switch-button  dark">Dark</div>
                </Col>
              </Row>
            </Col>
          </Row>
        </div> */}

        {/* Subscription */}
        <div className="org-details mb-5">
          <h2 className="title">Subscription</h2>
          {/* <Col className=" d-flex flex-wrap align-items-center justify-content-center mt-3"> */}
          <div className="d-flex flex-column  mt-4 ">

            <div className=" d-flex flex-row flex-wrap justify-content-center align-items-center ml-2 ">
              {/* {(data as any[]).map((card) => ( */}
              {(data as any[]).map((card) => (card.status === true && (
                <div className="m-2" key={card.title}>
                  <Card style={{ width: '14rem', borderRadius: '0px', }}>
                    <Card.Body>
                      <Card.Title style={{ fontSize: '20px', fontWeight: 'bolder' }}>{card.title}</Card.Title>
                      <Card.Subtitle className="mb-2 text-muted" style={{ fontSize: '14px', fontWeight: 'bold' }}>{card.subheader}</Card.Subtitle>
                      <Card.Text className="text-muted" style={{ fontSize: '12px', fontWeight: 'bold' }}>
                        $<b style={{ fontSize: '20px', fontWeight: '900', color: 'black' }}>{card.fee}</b> per month
                      </Card.Text>
                      <hr />
                      <Card.Text className="text-muted" style={{ fontSize: '12px', fontWeight: 'bold' }}>Upto {card.limit} certificates</Card.Text>
                      <Card.Text className="text-muted" style={{ fontSize: '12px', fontWeight: 'bold' }}>Upto {card.rate} per certificate</Card.Text>
                    </Card.Body>
                    {/* //todo-> make color,bgcolor according to currentplan or upgrade */}
                    <Button label={planName === card.title ? "Current Plan" : "Upgrade"} className={planName === card.title ? "current-plan plan-button" : "global-btn golden plan-button"} onClick={() => { makePayment(card); }} />
                  </Card>
                </div>
              )))}
              {/* ))} */}
              <div className="m-2">
                <Card style={{ width: '14rem', borderRadius: '0px', }}>
                  <Card.Body>
                    <Card.Title style={{ fontSize: '20px', fontWeight: 'bolder' }}>Custom(Enterprise)</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted" style={{ fontSize: '14px', fontWeight: 'bold' }}>Customised Plans</Card.Subtitle>
                    <Card.Text className="text-muted" style={{ fontSize: '12px', fontWeight: 'bold' }}>
                      <b style={{ fontSize: '20px', fontWeight: '900', color: 'black' }}></b>Prorated pricing
                    </Card.Text>
                    <hr />
                    <Card.Text className="text-muted" style={{ fontSize: '12px', fontWeight: 'bold' }}>Custom Limit</Card.Text>
                    <Card.Text className="text-muted" style={{ fontSize: '12px', fontWeight: 'bold' }}>Dynamic pricing</Card.Text>
                  </Card.Body>
                  {/* //todo-> make color,bgcolor according to currentplan or upgrade */}
                  {/* <Button label={planName === card.title ? "Current Plan" : "Upgrade"} className={planName === card.title ? "current-plan plan-button" : "global-btn golden plan-button"} onClick={() => {handlePlanSelection(card); makePayment(card);}} /> */}
                  <Button label={planName === 'Enterprise' ? "Current Plan" : "Let's talk"} className={planName === 'Enterprise' ? "current-plan plan-button" : "global-btn golden plan-button"} onClick={() => { ; setShow(true); }} />
                </Card>
              </div>
            </div>
            <div className="last-box mb-4 d-flex flex-row justify-content-between">
              <div className='d-flex flex-column p-2'>
                <h3 className='bold mb-2'>Custom</h3>
                <p>Need more than 200 Certificates? Contact us on support@Certs365.io</p>
              </div>
              {/* <div className="d-flex align-items-center position-relative me-2 cursor-pointer">
                <Form.Control
                  type="email"
                  placeholder="Enter your email"
                  className="search-input-setting flex-grow-1"
                // value={issuanceDate.from}
                // onChange={(e) => handleDateChange(e, "from")}
                />
                <div className="arrow-container position-absolute end-0"></div>
              </div> */}

            </div>
          </div>
        </div>
      </div>
      <Modal style={{ borderRadius: "26px" }} className='enterprise-modal extend-modal' show={show} centered>
        <Modal.Header className='extend-modal-header'>
          <span className='extend-modal-header-text'>Enter your details</span>
          <div className='close-modal'>
            <Image
              onClick={() => { setShow(false); }}
              className='cross-icon'
              src="/icons/close-icon.svg"
              layout='fill'
              alt='Loader'
            />
          </div>

        </Modal.Header>
        <Modal.Body style={{ display: "flex", flexDirection: "column", textAlign: "left" }}>
          {/* {selectedRow && <span className='extend-modal-body-text'>Expiring on {selectedRow?.expirationDate}</span>} */}
          {/* <hr style={{ width: "100%", background: "#D5DDEA" }} /> */}
          {/* <span className='extend-modal-body-expire'>New Expiration Date</span> */}

          {/* <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        value={expirationDate}
        onChange={(newDate) => setExpirationDate(newDate)}
        format="MM-dd-yyyy"
        renderInput={(params) => <TextField {...params} className='input-date-modal' />}
        disabled={neverExpires}
        minDate={selectedRow?.expirationDate ? new Date(selectedRow.expirationDate) : new Date()}
      />
      </LocalizationProvider> */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,  // Adjust this value to set the desired spacing
            }}
          >
            <TextField id="outlined-required" label="Plan Duration in days" variant="outlined" required onChange={(e) => setPlanDuration(Number(e.target.value))} />

            {/* <span className='extend-modal-body-expire'>New Expiration Date</span> */}
            <TextField id="outlined-basic" label="Total Credits" variant="outlined" required onChange={(e) => setTotalCredits(Number(e.target.value))} />
            {/* <span className='extend-modal-body-expire'>New Expiration Date</span> */}
            <TextField id="outlined-basic" disabled label={calculatedValue === 0 ? "Pricing in $" : `${calculatedValue}`} variant="outlined" />
          </Box>
          {/* <div className='checkbox-container-modal'> */}
          {/* <input
        type="checkbox"
        id="neverExpires"
        style={{ marginRight: "5px" }}
        // checked={neverExpires} // Set the checked state of the checkbox based on the state variable
        // onChange={handleCheckboxChange} // Attach the handler function to onChange event
      /> */}
          {/* <label className='label-modal' htmlFor="neverExpires">Never Expires</label> */}
          {/* </div> */}
        </Modal.Body>
        <Modal.Footer >

          <button className="update-button-modal" style={{ opacity: !isShowPricingEnabled ? 0.8 : 1 }} disabled={!isShowPricingEnabled} onClick={() => { handleNewPrice(); }}>Show Pricing</button>
          <button className="update-button-modal" onClick={() => { handleEnterprisePlan(); setShow(false); }}>Upgrade</button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Settings;