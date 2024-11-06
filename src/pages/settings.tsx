import React, { useEffect, useState } from 'react';
import { Card, Col, Form, Row } from 'react-bootstrap';
import Button from '../../shared/button/button';
import Image from 'next/image';
import {loadStripe} from "@stripe/stripe-js";
import qr1 from "/assets/img/qr-1.png";
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

  // const cardContent = [
  //   {
  //     title: "FREE",
  //     subheader: "Best for starters",
  //     fee: "0",
  //     limit: "1000",
  //     rate: "0",
  //     plan: "Current Plan",
  //   },
  //   {
  //     title: "Basic",
  //     subheader: "Best for small team",
  //     fee: "1200",
  //     limit: "10000",
  //     rate: "4",
  //     plan: "Upgrade",
  //   },
  //   {
  //     title: "Intermediate",
  //     subheader: "Best for mid level org",
  //     fee: "3750",
  //     limit: "100000",
  //     rate: "3.75",
  //     plan: "Upgrade",
  //   },
  //   {
  //     title: "Advanced",
  //     subheader: "Best for Big org",
  //     fee: "7000",
  //     limit: "2000",
  //     rate: "3.50",
  //     plan: "Upgrade",
  //   },
  // ];

  const [email, setEmail] = useState('');
  const [data, setData] = useState([]);
  const [planName, setPlanName] = useState('');


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

  // useEffect(() => {
    

  //   // setSubscriptionPlan();      //todo-> make this too
  // }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setEmail(parsedUser.email);
      getPlanName(parsedUser.email);
    }
  }, []);

  // useEffect(() => {
  //   if (email) {
  //     getPlanName(email);
  //   }
  // }, [email]);

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
      throw new Error('Failed to fetch plan name');
    }

    const data = await response.json();
    console.log(data);
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
    const response = await fetch(`${apiUrl}/api/create-checkout-session`,{
      method: 'POST',
      headers: headers,
      body: JSON.stringify(body)
    })
    const session = await response.json();
    const result: any = stripe?.redirectToCheckout({ sessionId: session.id });   //todo-> type any is given
    if (result?.error) {
      console.error('Error redirecting to Checkout:', result.error);
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
          <Row className=" d-flex align-items-center justify-content-center mt-3">
            <Col xs={12} md={4}>
              <Form.Label  className='label-settings'>From:</Form.Label>
              <Form.Control
                type="date"
                className="search-input-setting"
                value={issuanceDate.from}
                onChange={(e) => handleDateChange(e, 'from')}
              />
            </Col>
            <Col xs={12} md={4}>
              <Form.Label  className='label-settings'>To:</Form.Label>
              <Form.Control
                type="date"
                className="search-input-setting"
                value={issuanceDate.to}
                onChange={(e) => handleDateChange(e, 'to')}
              />
            </Col>
            <Col className='mt-4' xs={12} md={3}>
              <Button label="Download" className="global-btn golden" />
            </Col>
          </Row>
        </div>

        {/* Invoice Report */}
        <div className="org-details">
          <h2 className="title">Invoice Report</h2>
          <Row className=" d-flex align-items-center justify-content-center mt-3">
            <Col xs={12} md={4}>
              <Form.Label className='label-settings'>From:</Form.Label>
              <Form.Control
                type="date"
                className="search-input-setting"
                value={issuanceDate.from}
                onChange={(e) => handleDateChange(e, 'from')}
              />
            </Col>
            <Col xs={12} md={4}>
              <Form.Label  className='label-settings'>To:</Form.Label>
              <Form.Control
                type="date"
                className="search-input-setting"
                value={issuanceDate.to}
                onChange={(e) => handleDateChange(e, 'to')}
              />
            </Col>
            <Col className='mt-4' xs={12} md={3}>
              <Button label="Download" className="global-btn golden" />
            </Col>
          </Row>
        </div>

        {/* QR  Code */}
        <div className="org-details">
          <h2 className="title">QR Code</h2>
          <Row className=" d-flex align-items-center justify-content-start m-3">
          <Col xs={16} md={2}>
            {/* //todo-> Image not added */}
            <Card>
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
            <Card>
              <Image
                src="/assets/img/qr-1.png"
                width='18'
                height='100'
                // layout='fill'
                //  objectFit='contain'
                alt="QR code"
              />
             </Card>
             </Col>
          <Col xs={16} md={2}>
            {/* //todo-> Image not added */}
            <Card>
              <Image
                src={"/assets/img/qr-1.png"}
                width={18}
                height={100}
                alt="QR code"
              />
             </Card>
             </Col>
          <Col xs={16} md={2}>
            {/* //todo-> Image not added */}
            <Card>
              <Image
                src={"/assets/img/qr-1.png"}
                width={18}
                height={100}
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
            {(data as any[]).map((card) => (
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
                  <Button label={planName === card.title ? "Current Plan" : "Upgrade"} className={planName === card.title ? "current-plan plan-button" : "global-btn golden plan-button"} onClick={() => {handlePlanSelection(card); makePayment(card);}} />
                </Card>
              </div>
            ))}
            </div>
              <div className="last-box">
                  <div>
                    <h3>Custom</h3>
                    <p>Need mor than 200 Certificates? Contact US.</p>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
