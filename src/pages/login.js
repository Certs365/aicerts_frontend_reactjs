// @ts-nocheck
import Image from 'next/legacy/image';
import Button from '../../shared/button/button';
import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Card, Modal, ProgressBar } from 'react-bootstrap';
import Link from 'next/link';
import CopyrightNotice from '../app/CopyrightNotice';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth"
import { useRouter } from 'next/router';
import { encryptData } from '@/utils/reusableFunctions';
const apiUrl = process.env.NEXT_PUBLIC_BASE_URL_USER;
const secretKey = process.env.NEXT_PUBLIC_BASE_ENCRYPTION_KEY;
import OtpModal from "../components/OtpModal";
const Login = () => {
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [now, setNow] = useState(0);
  const [otp, setOtp] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState('');
  const [loginStatus, setLoginStatus] = useState('');
  const [confirmationResult, setConfirmationResult] = useState('');
  const [otpSentMessage, setOtpSentMessage] = useState('');
  const [user, setUser] = useState({});
  const [token, setToken] = useState(null);
  const [emailOtp, setEmailOtp] = useState(["", "", "", "", "", ""]);
  const [modalOtp, setModalOtp] = useState(false);
  const auth = getAuth()
  const apiUrl_Admin = process.env.NEXT_PUBLIC_BASE_URL;
  function onCaptchVerify() {

    // @ts-ignore: Implicit any for children prop
    if (!window.recaptchaVerifier) {
      // @ts-ignore: Implicit any for children prop
      window.recaptchaVerifier = new RecaptchaVerifier(auth,
        "recaptcha-container",
        {
          size: "invisible",
          callback: () => {
            // login();
          },
          "expired-callback": () => { },
        }
      );
    }
  }

  const handleClick = () => {
    window.location.href = '/register';
  };

  // @ts-ignore: Implicit any for children prop
  async function handleOtpSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    // @ts-ignore: Implicit any for children prop
    await window.confirmationResult
      .confirm(otp)
      // @ts-ignore: Implicit any for children prop
      .then(async (res) => {
    
      })
      // @ts-ignore: Implicit any for children prop
      .catch((err) => {
        setLoginError(err?.error?.message || "Invalid Code")
        setIsLoading(false)
        setShow(true)
         (err)

      });
  }

  const handleClose = () => {
    setShow(false);
    setLoginError("")
  };

  useEffect(() => {
  // @ts-ignore: Implicit any for children prop

    const storedUser = JSON.parse(localStorage?.getItem('user'));

    if (storedUser && storedUser.JWTToken) {
      setUser(storedUser);
      setToken(storedUser.JWTToken);
    } else {
      router.push('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // @ts-ignore: Implicit any for children prop
  const handleSendPhone = async (e) => {
    e.preventDefault()
    onCaptchVerify();
    setIsLoading(true)
    // @ts-ignore: Implicit any for children prop
    const appVerifier = window.recaptchaVerifier;

    // @ts-ignore: Implicit any for children prop
    await signInWithPhoneNumber(auth, phoneNumber, appVerifier)
      .then((confirmationResult) => {
        // @ts-ignore: Implicit any for children prop
        window.confirmationResult = confirmationResult;
        // @ts-ignore: Implicit any for children prop
        setConfirmationResult(confirmationResult)
        setOtpSentMessage('OTP has been sent to your registered phone Number');
        setShowOTP(true)
        setIsLoading(false)
      })
      .catch((error) => {
        setLoginError('An error occurred during login using phone');
        setShow(true);
        setIsLoading(false)
      });
  };

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // @ts-ignore: Implicit any for children prop
  const handleEmailChange = (e) => {
    const { value } = e.target;
    setLoginStatus(''); // Clear login status when email changes
    setFormData((prevData) => ({ ...prevData, email: value }));
  };

  // @ts-ignore: Implicit any for children prop
  const handlePasswordChange = (e) => {
    const { value } = e.target;
    setLoginStatus(''); // Clear login status when password changes
    if (value.length < 8) {
      setPasswordError('Password should be minimum 8 characters');
    } else {
      setPasswordError('');
    }
    setFormData((prevData) => ({ ...prevData, password: value }));
  };
  let progressInterval;
  const startProgress = () => {
    setNow(10); // Start progress at 10%
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
  const login = async () => {
   
    try {
      setIsLoading(true);
      startProgress();
  const payload = {
    email: formData.email,
    password: formData.password,
  }
  const encryptedData = encryptData(payload);

      const response = await fetch(`${apiUrl}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
         data:encryptedData
        }),
      });
  
      const responseData = await response.json();
  
      if (response.status === 200) {
        if (responseData.status === 'FAILED') {
          setLoginStatus('FAILED');
          setLoginError(responseData.message || 'An error occurred during login');
          setShow(true);
          setShowPhone(responseData?.isPhoneNumber);
          if (responseData?.isPhoneNumber && responseData?.phoneNumber) {
            setPhoneNumber(responseData?.phoneNumber);
          }
        } else if (responseData.status === 'SUCCESS') {
          if (responseData?.data && responseData?.data?.JWTToken !== undefined) {
             
            await handleSendEmail()
            localStorage.setItem('user', JSON.stringify(responseData?.data));
          } else {
            setShowPhone(responseData?.isPhoneNumber);
            setLoginError('An error occurred during login');
            setShow(true);
            if (responseData?.isPhoneNumber && responseData?.phoneNumber) {
              setPhoneNumber(responseData?.phoneNumber);
            }
          }
        }
      } else if (response.status === 400) {
        setShowPhone(responseData?.isPhoneNumber);
        setLoginError('Invalid input or empty credentials');
        setShow(true);
      } else if (response.status === 401) {
        setShowPhone(responseData?.isPhoneNumber);
        setLoginError('Invalid credentials entered');
        setShow(true);
        if (responseData?.isPhoneNumber && responseData?.phoneNumber) {
          setPhoneNumber(responseData?.phoneNumber);
        }
      } else {
        setShowPhone(responseData?.isPhoneNumber);
        if (responseData?.isPhoneNumber && responseData?.phoneNumber) {
          setPhoneNumber(responseData?.phoneNumber);
        }
        setLoginError('An error occurred during login');
        setShow(true);
      }
    } catch (error) {
      console.error('Error during login:', error);
      setLoginError('Server Error. Please try again');
      setShow(true);
    } finally {
      stopProgress();
      setIsLoading(false);
    }
  };
  
  const handleChangeOtp = (
    e, 
    index, 
    inputRefs
  ) => {
    const value = e.target.value;
    if (/^\d?$/.test(value)) { // Only allow digits
      const newOtp = [...emailOtp];
      newOtp[index] = value;
      setEmailOtp(newOtp);
  
      // Move focus to the next input field if a digit is entered
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };
  
  

const handleSendEmail = async () => {

  // Prepare the request payload
  const payload = {
    email:formData.email , // You can replace this with the actual email input// Replace this with the actual OTP code input
  };
  try {
    const response = await fetch(`${apiUrl}/api/two-factor-auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Set the request headers
      },
      body: JSON.stringify(payload), // Convert the payload to JSON string
    });

    const data = await response.json(); // Parse the JSON response
    if (response.ok) {
      setModalOtp(true)
    } else {
      // Handle error (e.g., show error message)
      setLoginError('Error in sending mail');
      setShow(true);
      console.error('Error:', data);
    }
  } catch (error) {
    // Handle fetch error (e.g., network issues)
    console.error('Network error:', error);
  }
};

const handleLoginOtp = async (e) => {
  setIsLoading(true)
  e.preventDefault(); // Prevent the default form submission behavior
  startProgress();

  // Prepare the request payload
  const payload = {
    email:formData.email , // You can replace this with the actual email input
    code: Number(emailOtp.join('')),// Replace this with the actual OTP code input
  };

  try {
    const response = await fetch(`${apiUrl}/api/verify-issuer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Set the request headers
      },
      body: JSON.stringify(payload), // Convert the payload to JSON string
    });

    const data = await response.json(); // Parse the JSON response
    if (response.ok) {
      setLoginStatus('SUCCESS');
      setLoginError('');
      setLoginSuccess("Logged In Successfully");
      setShow(true)
      // getRemainingDays(); // set remaining days in ls //todo->remove it
      localStorage.setItem('firstlogin', "true");
      // await validateIssuer(responseData?.data?.email)
      router.push('/dashboard');
      // Handle success (e.g., navigate, show success message)
      console.log('Success:', data);
    } else {
      // Handle error (e.g., show error message)
      setLoginError('Invalid Otp');
      setShow(true);
      console.error('Error:', data);

    }
  } catch (error) {
    // Handle fetch error (e.g., network issues)
    console.error('Network error:', error);
  }finally{
  setIsLoading(false)
stopProgress()
  }
};


  // otp login
  // @ts-ignore: Implicit any for children prop
  const loginWithPhone = async (e) => {
    e.preventDefault()
    await handleOtpSubmit(e)
    try {
      setIsLoading(true);
      const token = await auth.currentUser?.getIdToken();
      const response = await fetch(`${apiUrl}/api/login-with-phone`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idToken: token,
          email: formData.email
        }),
      });

      const responseData = await response.json();

      if (response.status === 200) {
        // Successful login, handle accordingly (redirect or show a success message)
        if (responseData.status === 'FAILED') {
          // Display error message for failed login
          setLoginStatus('FAILED');
          setLoginError(responseData.message || 'An error occurred during login');
          setShow(true);

        } else if (responseData.status === 'SUCCESS') {


          if (responseData?.data && responseData?.data?.JWTToken !== undefined) {
            setLoginStatus('SUCCESS');
            setLoginSuccess("Login Success");
            setShow(true);
            localStorage.setItem('user', JSON.stringify(responseData?.data))
            localStorage.setItem('firstlogin', "true");
            router.push('/dashboard');

          } else {

            setLoginError('An error occurred during login');
            setShow(true);

          }
        }
      } else if (response.status === 400) {
        // Invalid input or empty credentials

        setLoginError('Invalid input or empty credentials');
        setShow(true);
      } else if (response.status === 401) {
        // Invalid credentials entered

        setLoginError('Invalid credentials entered');
        setShow(true);

      } else {
        // An error occurred during login
        setLoginError('An error occurred during login');
        setShow(true);
      }
    } catch (error) {
      console.error('Error during login:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // @ts-ignore: Implicit any for children prop
  const validateIssuer = async (email) => {
    const data = {
      email: formData.email
    };
    try {
      const response = await fetch(`${apiUrl_Admin}/api/create-validate-issuer`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      const res = await response.json();
    } catch (error) {
      console.error('Error ', error);
    }
  };

  // @ts-ignore: Implicit any for children prop
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setLoginError('Please enter valid login credentials');
      return;
    }

    if (passwordError) {
      console.error('Login failed: Password is too short');
      return;
    }

    // if (passwordError) {
    //   console.error('Login failed: Password is too short');
    //   return;
    // }

    await login();
  };

  const handleForgotPassword = () => {
    router.push('/forgot-passwords')
  }


  //todo-> remove it
  // const getRemainingDays = async () => {
  //   try {
  //     const email = formData.email;
  //     const response = await fetch(`${apiUrl}/api/get-subscription-details`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ email }),
  //     });

  //     if (!response.ok) {
  //       throw new Error('Failed to fetch plan name');
  //     }

  //     const data = await response.json();
  //     if(data.message) {

  //       localStorage.setItem('expirydate', data.message);
  //     }
  //   } catch (error) {
  //     console.error('Error fetching plan details:', error);
  //   }
  // };

  return (
    <>
      <Row className="justify-content-md-center mt-5">
        <Col xs={{ span: 12 }} md={{ span: 10 }} lg={{ span: 6 }} className='login-container'>
          <div className='golden-border-left'></div>
          <Card className='login input-elements'>
            <h2 className='title text-center'>Issuer Login</h2>
            <p className='sub-text text-center'>Login using your credentials.</p>
            <div id='recaptcha-container'></div>

            {showOTP ? (
              // OTP Verification Form
              <Form className='otp-form' onSubmit={loginWithPhone}>
                <Form.Group controlId="otp" className="mb-3">
                  <Form.Label>Enter OTP</Form.Label>
                  <Form.Control
                    type="text"
                    name='otp'
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                </Form.Group>
                {otpSentMessage && <p style={{ color: 'green' }}>{otpSentMessage}</p>}
                <div className='d-flex justify-content-between align-items-center'>
                  <Button label="Verify OTP" className="golden" />
                </div>
              </Form>
            ) : (
              // Login Form
              <Form className='login-form' onSubmit={handleSubmit}>
                <Form.Group controlId="email" className='mb-3'>
                  <Form.Label>
                    <Image
                      src="/icons/user-icon.svg"
                      width={16}
                      height={20}
                      alt='User Name'
                    />
                    Email address
                  </Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleEmailChange}
                  />
                </Form.Group>

                <Form.Group controlId="password">
                  <Form.Label>
                    <Image
                      src="/icons/lock-icon.svg"
                      width={20}
                      height={20}
                      alt='Password'
                    />
                    Password
                  </Form.Label>
                  <Form.Control className='mb-2' style={{ marginBottom: showPhone ? "20px" : "" }} 
                    type="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handlePasswordChange}
                  />
                  {passwordError ? ( 
                    <p style={{ color: '#ff5500' }}>{passwordError}</p>
                    ) : (
                    <p>&nbsp;</p>
                  )}
                </Form.Group>
                {showPhone && (
                  <Link
                    style={{ margin: "0 0 30px 10px", display: "block" }}
                    onClick={handleSendPhone}
                    href="/forgot-passwords"
                  >
                    Login with Phone
                  </Link>
                )}


                <div className='d-block d-md-flex justify-content-between align-items-center'>
                  <Button label="Login" className="golden" />
                  <div className="forgot-password-text" onClick={handleForgotPassword} style={{ cursor: 'pointer' }}>Forgot Password?</div>
                </div>
              </Form>
            )
            }

          </Card>
          <div className='golden-border-right'></div>
        </Col>
<OtpModal modalOtp={modalOtp} setModalOtp={setModalOtp} setEmailOtp={setEmailOtp} handleLoginOtp={handleLoginOtp}emailOtp={emailOtp}handleChangeOtp={handleChangeOtp}/>

        {/* <Modal className='loader-modal' show={modalOtp} centered onHide={()=>{setModalOtp(false); setEmailOtp("")}}>
  <Modal.Header closeButton>
  </Modal.Header>
  <Modal.Body style={{ padding: "30px 20px" }}>
    <p className='' style={{ color: 'green', fontFamily: "monospace", fontWeight: 600 }}>
      Please Enter OTP Sent to Your Registered Email.
    </p>
    <input
      type="text"
      className="form-control mb-4"
      value={emailOtp}
      onChange={handleChangeOtp}
      name='otp'
      placeholder="Enter OTP"
    />
    <Button label="Submit OTP" onClick={handleLoginOtp} className="golden" />
  </Modal.Body>
</Modal> */}
        <Col md={{ span: 12 }}>
          {/* <Button label="Register" className='golden mt-5 ps-0 pe-0 w-100 d-block d-lg-none' onClick={handleClick} /> */}
          <div className='register-user-text d-block d-lg-none'>
            Dont have an account?&nbsp;&nbsp;
            <span onClick={handleClick}>Register Here</span>
          </div>
          <div className='copy-right text-center'>
            <CopyrightNotice />
          </div>
        </Col>
      </Row>
    

      {/* Loading Modal for API call */}
      <Modal className='loader-modal' show={isLoading} centered>
        <Modal.Body>
          <div className='certificate-loader'>
            <Image
              src="/backgrounds/login-loading.gif"
              layout='fill'
              objectFit='contain'
              alt='Loader'
            />
          </div>
          <div className='text'>Logging In</div>
          <ProgressBar now={now} label={`${now}%`} />
        </Modal.Body>
      </Modal>

      <Modal onHide={handleClose} className='loader-modal text-center' show={show} centered>
        <Modal.Body>
          {loginError !== '' ? (
            <>
              <div className='error-icon'>
                <Image
                  src="/icons/invalid-password.gif"
                  layout='fill'
                  objectFit='contain'
                  alt='Loader'
                />
              </div>
              <div className='text' style={{ color: '#ff5500' }}>{loginError}</div>
              <button className='warning' onClick={handleClose}>Ok</button>
            </>
          ) : (
            <>
              <div className='error-icon success-image' style={{ marginBottom: '20px' }}>
                <Image
                  src="/icons/success.gif"
                  layout='fill'
                  objectFit='contain'
                  alt='Loader'
                />
              </div>
              <div className='text' style={{ color: '#CFA935' }}>{loginSuccess}</div>
              <button className='success' onClick={handleClose}>Ok</button>
            </>
          )}


        </Modal.Body>
      </Modal>
    </>
  );
}

export default Login;