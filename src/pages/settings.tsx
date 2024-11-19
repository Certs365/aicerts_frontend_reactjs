// @ts-nocheck

import React, { useEffect, useState } from 'react';
import { Card, Col, Form, Modal, Row } from 'react-bootstrap';
import { Box, TextField } from '@mui/material';
import Button from '../../shared/button/button';
import Image from 'next/image';
import {loadStripe} from "@stripe/stripe-js";
import qr1 from "/assets/img/qr-1.png";
import qr2 from "/assets/img/qr-2.png";
import qr3 from "/assets/img/qr-3.png";
import qr4 from "/assets/img/qr-4.png";
import user from '@/services/userServices';
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
  const [paymentId, setPaymentId] = useState('')

  const isShowPricingEnabled = !isNaN(planDuration) && planDuration !== 0 && !isNaN(totalCredits) && totalCredits !== 0;
  

  useEffect(() => {
    if(!isShowPricingEnabled){
      setCalculatedValue(0);
    }
  }, [isShowPricingEnabled])
  
  // get all subscription plan details
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`${apiUrl}/api/get-all-plans`);
      const responseData = await response.json();
      setData(responseData.details);
      // const data = await response.json();
      // setData(typeof data === 'string' ? JSON.parse(data) : data);
    };
    fetchData();
  }, []);



  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setEmail(parsedUser.email);
      getPlanName(parsedUser.email);
    }
  }, []);


const getPlanName = async (email:string) => {
  try {
    const response = await fetch(`${apiUrl}/api/get-subscription-details`, {
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
    setPlanName(data.details.subscriptionPlanName);
  } catch (error) {
    console.error('Error fetching plan name:', error);
  }
};

  const handlePlanSelection = (card: any) => {
    try {
      const response = fetch(`${apiUrl}/api/set-subscription-details`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          subscriptionPlanName: card.title,
          allocatedCredentials: card.limit,
          currentCredentials: card.limit,
        }),
      });
      

    } catch (error) {
      console.error('Error selecting plan:', error);
    }

  }

  // todo-> can merge it in handleplanselection ??
  const makePayment = async (card:any) => {
     
    console.log(card)
    console.log(typeof card.fee);
    console.log(typeof card.title);
    console.log(typeof card.limit);
    console.log(typeof card.rate);

    const stripe = await loadStripe(`${stripeUrl}`);
    const body={
      plan: {
        name: card.title,
        fee: card.fee,
        limit: card.limit,
        rate: card.rate,
        // expiration: 30,
      },
    }
    const headers={
      "Content-Type": "application/json",
    }
    try {
    const response = await fetch(`${apiUrl}/api/create-checkout-session`,{
      method: 'POST',
      headers: headers,
      body: JSON.stringify(body)
    })
    const session = await response.json();
     
    console.log(session);
    const result: any =  stripe?.redirectToCheckout({ sessionId: session.id });   //todo-> type any is given
    console.log(result)
    debugger
    if (result?.error) {
      console.error('Error redirecting to Checkout:', result.error);
    }
    if(!window.location.href.includes('canceled=true')) {
      debugger
      handlePlanSelection(card);    
    }
  } catch (error) {
    console.error('Error during payment:', error);
    return;
}
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
  
  

 
  const handleNewPrice = () =>{
    setCalculatedValue(planDuration * totalCredits*5);
  }

  const handleEnterprisePlan = ()=>{
    const card = {
      title: 'Enterprise',
      fee: calculatedValue,
      limit: totalCredits,
      duration: planDuration,
      rate: 5,
    }
    makePayment(card);
    // handlePlanSelection(card);
  }

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
        <div className="org-details">
          <h2 className="title">QR Code</h2>
          <Row className=" d-flex align-items-center justify-content-start m-3">
          <Col xs={16} md={2}>
            {/* //todo-> Image not added */}
            <Card className="qrcode" >
              <Image
                src={qr1}
                height={100}
                width={100}
                objectFit='contain'
                alt="QR code"
              />
             </Card>
             </Col>
          <Col xs={16} md={2}>
            {/* //todo-> Image not added */}
            <Card className="qrcode" >              
              <Image
                 src={qr2}
                 height={100}
                 width={100}
                 objectFit='contain'
                 alt="QR code"
              />
             </Card>
             </Col>
          <Col xs={16} md={2}>
            {/* //todo-> Image not added */}
            <Card className="qrcode" >              
              <Image
                src={qr3}
                height={100}
                width={100}
                objectFit='contain'
                alt="QR code"
              />
             </Card>
             </Col>
          <Col xs={16} md={2}>
            {/* //todo-> Image not added */}
            <Card className="qrcode" >
              <Image
                src={qr4}
                height={100}
                width={100}
                objectFit='contain'
                alt="QR code"
              />
             </Card>
             </Col>
          </Row>
        </div>

        {/* Default Blockchain */}
        <div className="org-details mb-5">
          <h2 className="title">Default Blockchain</h2>
          <Row className=" d-flex align-items-center ml-3">
            <Col className="mt-4" xs={12} md={3}>
              <Row className=" d-flex align-items-center justify-content-center mt-3 gap-5">
                <Col xs={12} md={4} >
                  <div className="blockchain-button polygon">
                    {/* <img src="../../assets/img/qr-1.png" alt="asasa" /> */}
                    polygon
                  </div>
                </Col>
                <Col xs={12} md={4}>
                  <div className="blockchain-button optimism">
                    {/* <img src="../../assets/img/qr-1.png" alt="asasa" /> */}
                    Optimism
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>

        {/* App view mode */}
        <div className="org-details mb-5">
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
        </div>

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
                    <Card.Subtitle className="mb-2 text-muted" style={{fontSize: '14px', fontWeight: 'bold'}}>{card.subheader}</Card.Subtitle>
                    <Card.Text className="text-muted" style={{fontSize: '12px', fontWeight: 'bold'}}>
                       $<b style={{fontSize: '20px', fontWeight: '900', color: 'black' }}>{card.fee}</b> per month
                    </Card.Text>
                    <hr />
                    <Card.Text className="text-muted" style={{fontSize: '12px', fontWeight: 'bold'}}>Upto {card.limit} certificates</Card.Text>
                    <Card.Text className="text-muted" style={{fontSize: '12px', fontWeight: 'bold'}}>Upto {card.rate} per certificate</Card.Text>
                  </Card.Body>
                  {/* //todo-> make color,bgcolor according to currentplan or upgrade */}
                  <Button label={planName === card.title ? "Current Plan" : "Upgrade"} className={planName === card.title ? "current-plan plan-button" : "global-btn golden plan-button"} onClick={() => {makePayment(card);}} />
                </Card>
              </div>
            )))}
            {/* ))} */}
            <div className="m-2">
                <Card style={{ width: '14rem', borderRadius: '0px', }}>
                 <Card.Body>
                    <Card.Title style={{ fontSize: '20px', fontWeight: 'bolder' }}>Custom(Enterprise)</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted" style={{fontSize: '14px', fontWeight: 'bold'}}>Customised Plans</Card.Subtitle>
                    <Card.Text className="text-muted" style={{fontSize: '12px', fontWeight: 'bold'}}>
                       <b style={{fontSize: '20px', fontWeight: '900', color: 'black' }}></b>Prorated pricing
                    </Card.Text>
                    <hr />
                    <Card.Text className="text-muted" style={{fontSize: '12px', fontWeight: 'bold'}}>Custom Limit</Card.Text>
                    <Card.Text className="text-muted" style={{fontSize: '12px', fontWeight: 'bold'}}>Dynamic pricing</Card.Text>
                  </Card.Body>
                  {/* //todo-> make color,bgcolor according to currentplan or upgrade */}
                  {/* <Button label={planName === card.title ? "Current Plan" : "Upgrade"} className={planName === card.title ? "current-plan plan-button" : "global-btn golden plan-button"} onClick={() => {handlePlanSelection(card); makePayment(card);}} /> */}
                  <Button label={planName === 'Enterprise' ? "Current Plan" : "Let's talk"} className={planName === 'Enterprise' ? "current-plan plan-button" : "global-btn golden plan-button"} onClick={() => {; setShow(true); }} />
                </Card>
            </div>
            </div>
              <div className="last-box">
                  <div>
                    <h3>Custom</h3>
                    <p>Need more than 200 Certificates? Contact US.</p>
                  </div>
                  <div>
                      <Form.Control
                        type="email" placeholder="Enter your email"
                        className="search-input-setting"
                        // value={issuanceDate.from}
                        // onChange={(e) => handleDateChange(e, "from")}
                      />
                  </div>
                </div>
              <div className="last-box">
                  <div>
                    <h3>Plan not upgraded?</h3>
                    <p>Send us payment details ans we will upgrade your plan.</p>
                  </div>
                  <div>
                      <Form className="d-flex flex-column">
                        <Form.Control
                          type="email" placeholder="Enter your email"
                          className="search-input-setting"
                          value={paymentEmail}
                          onChange={(e) => setPaymentEmail(e.target.value)}
                          required
                          />
                        <Form.Control
                          type="text" placeholder="Enter your payment ID"
                          className="search-input-setting mt-3"
                          value={paymentId}
                          onChange={(e) => setPaymentId(e.target.value)}
                          required
                        />
                         <Col md={{ span: 1 }} xs={{ span: 12 }}>
                            <Button label="Submit" className='btn-danger' onClick={() => handlePaymentGrievance()} />
                        </Col>
                      </Form>
                  </div>
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
      <TextField id="outlined-required" label="Plan Duration in days" variant="outlined"  required   onChange={(e) => setPlanDuration(Number(e.target.value))}  />
      
      {/* <span className='extend-modal-body-expire'>New Expiration Date</span> */}
      <TextField id="outlined-basic" label="Total Credits" variant="outlined"  required  onChange={(e) => setTotalCredits(Number(e.target.value))} />
      {/* <span className='extend-modal-body-expire'>New Expiration Date</span> */}
      <TextField id="outlined-basic" disabled  label={calculatedValue === 0 ? "Pricing in $" : `${calculatedValue}`} variant="outlined" />
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

            <button className="update-button-modal" style={{opacity: !isShowPricingEnabled? 0.8: 1}} disabled={!isShowPricingEnabled}  onClick={() => {  handleNewPrice(); }}>Show Pricing</button>
            <button className="update-button-modal"  onClick={() => { handleEnterprisePlan(); setShow(false);  }}>Upgrade</button>
          </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Settings;