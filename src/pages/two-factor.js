// Import necessary modules and components
import React, { useState } from 'react';
import Image from 'next/image';
import { Form, Row, Col } from 'react-bootstrap';
import Button from '../../shared/button/button';
import { useRouter } from 'next/router';
import user from '../services/userServices';
import { validateEmail } from '../common/auth';

// Component definition
const ForgotPassword = () => {
  // Initialize React Router
  const router = useRouter();

  // State variables for email, email errors, OTP, OTP errors, and 2FA visibility
  const [email, setEmail] = useState('');
  const [emailErrors, setEmailErrors] = useState('');
  const [otp, setOtp] = useState('');
  const [otpErrors, setOtpErrors] = useState('');
  const [show2FA, setShow2FA] = useState(false);

  // Handle click event for Send Recovery Link or Verify OTP button
  const handleClick = (e) => {
    e.preventDefault();
    if (show2FA) {
      verifyOtp();
    } else {
      sendLink();
    }
  };

  // Function to send recovery link
  const sendLink = () => {
    // Validate email format
    if (!validateEmail(email)) {
      setEmailErrors('Please enter a valid email address');
      return;
    }

    // Call the sendLink API with the form data
    user.sendLink(email, (response) => {
      if (response.data.status === 'PASSED') {
        // if (true) {
        // Successful link sent
        setShow2FA(true); // Show OTP field after sending link
        setEmailErrors('');
      } else {
        setEmailErrors(response?.data?.message);
      }
    });
  };

  // Function to verify OTP
  const verifyOtp = () => {
    // Call the verifyOtp API with the form data
    const data = {
      email: email,
      code: otp,
    };
    user.verifyOtp(data, (response) => {
      if (response.data.status === 'PASSED') {
        // if (true) {
        // Successful OTP verification
        // Pass email to /reset-password route
        router.push(`/passwords-confirm?email=${encodeURIComponent(email)}`);
      } else {
        setOtpErrors(response?.data?.message);
      }
    });
  };

  // Handle click event for Cancel button
  const handleClickCancel = (e) => {
    e.preventDefault();
    router.push('/');
  };

  // Component JSX
  return (
    <div className='forgot-password'>
      <div className='container-fluid'>
        <Row>
          <Col md={{ span: 7 }} className='d-none d-md-block'>
            <div className='badge-banner'>
              <Image
                src='/backgrounds/forgot-pass-bg.svg'
                layout='fill'
                objectFit='contain'
                alt='Badge image'
              />
            </div>
          </Col>
          <Col xs={{ span: 12 }} md={{ span: 5 }}>
            <h1 className='title'>Forgot Password?</h1>
            <Form className='input-elements'>
              {show2FA ? (
                <Form.Group controlId='otp'>
                  <Form.Label>Enter OTP</Form.Label>
                  <Form.Control
                    type='password'
                    value={otp}
                    onChange={(e) => {
                      setOtp(e.target.value);
                      setOtpErrors('');
                    }}
                  />
                </Form.Group>
              ) : (
                <Form.Group controlId='email'>
                  <Form.Label>Enter Your Registered Email</Form.Label>
                  <Form.Control
                    type='email'
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setEmailErrors('');
                    }}
                  />
                </Form.Group>
              )}

              {otpErrors && (
                <p className='error-message' style={{ color: '#ff5500' }}>
                  {otpErrors}
                </p>
              )}

              {emailErrors && (
                <p className='error-message' style={{ color: '#ff5500' }}>
                  {emailErrors}
                </p>
              )}

              <div className='d-flex justify-content-between align-items-center'>
                <Button
                  label={show2FA ? 'Verify OTP' : 'Send Recovery Link'}
                  onClick={handleClick}
                  className='golden'
                />
              </div>

              <div className='d-flex justify-content-between align-items-center'>
                <Button label='Cancel' onClick={handleClickCancel} className='outlined' />
              </div>
            </Form>
          </Col>
        </Row>
      </div>
    </div>
  );
};

// Export the component
export default ForgotPassword;
