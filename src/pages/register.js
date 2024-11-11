import React, { useState } from 'react';
import Image from 'next/image';
import Button from '../../shared/button/button';
import { Form, Row, Col, Card, Modal, ProgressBar } from 'react-bootstrap';
import user from "../services/userServices"
import { isStrongPassword } from '../common/auth';
import { useRouter } from 'next/router';
import eyeIcon from '../../public/icons/eye.svg';
import eyeSlashIcon from '../../public/icons/eye-slash.svg';
import NavigationLogin from '../app/navigation-login';

const Register = () => {
  const router = useRouter();
  const [showOtpField, setShowOtpField] = useState(false);
  const [otp, setOtp] = useState("")
  const [otpError, setOtpError] = useState("")
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [now, setNow] = useState(0);
        
  const togglePasswordVisibility = () => {
      setPasswordVisible(!passwordVisible);
  };

  const handleClose = () => {
      setFieldErrors({
          userEmail: ''
      });
      setShow(false);
      setLoginError('');
  };

  const handleSuccessClose = () => {
    setShow(false);
    window.location = '/'
  }


  const isFormInvalid = () => {
    return (
      !formData.organisationName ||
      !formData.fullName ||
      !formData.userEmail ||
      !formData.username ||
      !formData.password ||
      !formData.confirmPassword ||
      !formData.userPhoneNumber ||
      formData.password !== formData.confirmPassword || // Check if passwords match
      Object.keys(fieldErrors).some((key) => fieldErrors[key] !== '')
    );
  };  

  // State for form data
  const [formData, setFormData] = useState({
    organisationName: '',
    address: '',
    country: '',
    organizationType: '',
    city: '',
    zip: '',
    industrySector: '1', // Default value for the dropdown
    state: '',
    websiteLink: '',
    fullName: '',
    userPhoneNumber: '',
    userDesignation: '',
    userEmail: '',
    username: '',
    designation: '',
    password: '',
    confirmPassword: '',
  });

  const [fieldErrors, setFieldErrors] = useState({
    organisationName: '',
    fullName: '',
    userEmail: '',
    password: '',
    confirmPassword: '',
    generalError: ''

  });

  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false
  });

  // const requiredFields = ['organisationName', 'fullName', 'userEmail', 'username', 'password', 'confirmPassword'];

  // Function to handle form field changes
  const handleInputChange = (field, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [field]: value,
    }));

    // Clear field error when the user starts typing
    setFieldErrors((prevErrors) => ({
      ...prevErrors,
      [field]: '',
    }));

    if (field === 'fullName') {
      // Prevent entering special characters
      if (/[^\w\s]/.test(value)) {
        // Remove special characters from the value
        value = value.replace(/[^\w\s]/g, '');
        setFormData((prevFormData) => ({
          ...prevFormData,
          [field]: value,
        }));
        return;
      }
  
      // Prevent entering numbers
      if (/\d/.test(value)) {
        // Remove numbers from the value
        value = value.replace(/\d/g, '');
        setFormData((prevFormData) => ({
          ...prevFormData,
          [field]: value,
        }));
        return;
      }
  
      // Prevent adding space at the start
      if (value.trimStart() !== value) {
        // Remove leading spaces from the value
        value = value.trimStart();
        setFormData((prevFormData) => ({
          ...prevFormData,
          [field]: value,
        }));
        return;
      }
    }


    // Check for password strength
    if (field === 'password') {
      const { isValid, errorMessage } = isStrongPassword(value);

      if (!isValid) {
        setFieldErrors((prevErrors) => ({
          ...prevErrors,
          password: errorMessage,
        }));
      } else {
        // Clear password error if the password is strong
        setFieldErrors((prevErrors) => ({
          ...prevErrors,
          password: '',
        }));
      }
    }

    // Check if passwords match
    if (field === 'confirmPassword') {
      if (value !== formData.password) {
          setFieldErrors((prevErrors) => ({
              ...prevErrors,
              confirmPassword: 'Passwords do not match',
          }));
      } else {
          setFieldErrors((prevErrors) => ({
              ...prevErrors,
              confirmPassword: '',
          }));
      }
    }
  };

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    //  (formData, "formdata");

    // Set isLoading to true to display the loader
    setIsLoading(true);

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

    startProgress();
    // Check for required fields
    const requiredFields = ['fullName', 'password', 'confirmPassword', 'userEmail', 'organisationName'];
    const newFieldErrors = {};

    // Generate error message with Field Name
    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newFieldErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
      }
    });

    // Check if password and confirmPassword match
    if (formData.password !== formData.confirmPassword) {
      newFieldErrors.confirmPassword = 'Passwords do not match';
    }

    // Update field errors state
    setFieldErrors(newFieldErrors);

    // Check if there are any errors before making the API call
    if (Object.keys(newFieldErrors).length === 0) {
      const data = {
        name: formData?.fullName,
        email: formData?.userEmail,
        password: formData?.password,
        organization: formData?.organisationName,
        address: formData?.address,
        country: formData?.country,
        organizationType: formData?.organizationType,
        city: formData?.city,
        zip: formData?.zip,
        industrySector: formData?.industrySector,
        state: formData?.state,
        websiteLink: formData?.websiteLink,
        phoneNumber: formData?.userPhoneNumber,
        designation: formData?.designation,
        username: formData?.username,

      }
      // Call the register API with the form data
      user?.register(data, (response) => {
       
        // Handle the API response here (success or error)
        if (response?.data?.status === 'SUCCESS') {
          // successful registration
          setLoginSuccess(response?.data?.message);
          setShow(true)
          // setShowOtpField(true)
          // router.push('/');
        } else if (response.data.status === 'FAILED') {
          setShow(true)
          setLoginError(response?.data?.message || 'Registration failed');
          setFieldErrors((prevErrors) => ({
            ...prevErrors,
            generalError: response?.data?.message,
          }));
        } else {
          setShow(true)
          setLoginError(response?.data?.message || 'Registration failed');
          setFieldErrors((prevErrors) => ({
            ...prevErrors,
            generalError: response?.data?.message,
          }));
        }
        stopProgress();
        setIsLoading(false);
      });
    }
  };

  const checkIfUsernameExists = (username) => {
    // Simulate the check here (replace this with your actual logic)
    // For demonstration purposes, let's assume that if the username is 'admin', it already exists
    return username.toLowerCase() === 'admin';
  };

  //handle verify OTP

  const handleVerifyOtp = () => {
    const data = {
      email: formData.userEmail,
      code: otp
    }

    // Call the register API with the form data
    user?.verifyOtp(data, (response) => {
      // Handle the API response here (success or error)
      if (response.data.status === 'PASSED') {
        // successful registration
        router.push('/verify-documents');
      } else if (response.data.status === 'FAILED') {
        setOtpError(response.error || "Incorrect OTP")
      } else {
        // Handle registration error
        console.error('Registration failed!', response.error);
        setOtpError("Server Error")
      }
    });
  }

  return (
    <div className='register page-bg position-relative'>
            <NavigationLogin />

      <div className='container'>
        <h2 className='title'>Register your Organization</h2>

        <Form className='register-form'>
          <Card>
            <Card.Body>
              <Card.Title>Organization Details</Card.Title>

              <div className='input-elements'>
                <Row className="justify-content-md-center">
                  <Col md={{ span: 4 }} xs={{ span: 12 }}>
                    <Form.Group controlId="organization-name" className='mb-3'>
                      <Form.Label>Organization Name <span className='text-danger'>*</span></Form.Label>
                      <Form.Control
                        type="text"
                        name="organization-name"
                        value={formData.organisationName}
                        onChange={(e) => handleInputChange('organisationName', e.target.value)}
                      />
                      {fieldErrors.organisationName && <p className='error-message' style={{ color: '#ff5500' }}>{fieldErrors.organisationName}</p>}
                    </Form.Group>

                    <Form.Group controlId="address" className='mb-3'>
                      <Form.Label>Address</Form.Label>
                      <Form.Control type="text"
                        value={formData?.address}
                        name="address"
                        onChange={(e) => handleInputChange('address', e.target.value)}
                      />
                    </Form.Group>

                    <Form.Group controlId="country" className='mb-3'>
                      <Form.Label>Country</Form.Label>
                      <Form.Control type="text"
                        value={formData?.country}
                        name="country"
                        onChange={(e) => handleInputChange('country', e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={{ span: 4 }} xs={{ span: 12 }}>
                    <Form.Group controlId="organization-type" className='mb-3'>
                      <Form.Label>Organization Type</Form.Label>
                      <Form.Control type="text"
                        name="organization-type"
                        value={formData?.organizationType}
                        onChange={(e) => handleInputChange('organizationType', e.target.value)}
                      />
                    </Form.Group>

                    <Form.Group controlId="city" className='mb-3'>
                      <Form.Label>City</Form.Label>
                      <Form.Control type="text"
                        name="city"
                        value={formData?.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                      />
                    </Form.Group>

                    <Form.Group controlId="zip" className='mb-3'>
                      <Form.Label>Zip</Form.Label>
                      <Form.Control type="text"
                        name="zip"
                        value={formData?.zip}
                        onChange={(e) => handleInputChange('zip', e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={{ span: 4 }} xs={{ span: 12 }}>
                    <Form.Label>Industry Sector</Form.Label>
                    <Form.Select aria-label="select" className='mb-3'
                      value={formData?.industrySector}
                      onChange={(e) => handleInputChange('industrySector', e.target.value)}
                    >
                      <option value="">Select Industry</option>
                      <option value="Technology">Technology</option>
                      <option value="Education">Education</option>
                      <option value="Finance">Finance</option>
                      <option value="Fintech">Fintech</option>
                      <option value="Engineering">Engineering</option>
                      <option value="Commerce">Commerce</option>
                      <option value="Health Care">Health Care</option>
                      <option value="Manufacturing">Manufacturing</option>
                      <option value="Others">Others</option>
                    </Form.Select>

                    <Form.Group controlId="state" className='mb-3'>
                      <Form.Label>State</Form.Label>
                      <Form.Control type="text"
                        value={formData?.state}
                        name="state"
                        onChange={(e) => handleInputChange('state', e.target.value)}
                      />
                    </Form.Group>

                    <Form.Group controlId="website-link" className='mb-3'>
                      <Form.Label>Website Link</Form.Label>
                      <Form.Control type="text"
                        value={formData?.websiteLink}
                        name="website-link"
                        onChange={(e) => handleInputChange('websiteLink', e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </div>
            </Card.Body>
          </Card>
          <Card>
            <Card.Body>
              <Card.Title>Primary Contact Detail of the User</Card.Title>

              <div className='input-elements'>
                <Row className="justify-content-md-center">
                  <Col md={{ span: 4 }} xs={{ span: 12 }}>
                    <Form.Group controlId="full-name" className='mb-3'>
                      <Form.Label>Full Name <span className='text-danger'>*</span></Form.Label>
                      <Form.Control type="text"
                        value={formData?.fullName}
                        name="full-name"
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                      />
                      {fieldErrors.fullName && <p className='error-message' style={{ color: '#ff5500' }}>{fieldErrors.fullName}</p>}
                    </Form.Group>
                    <Form.Group controlId="phone-number" className='mb-3'>
                      <Form.Label>Phone Number<span className='text-danger'>*</span></Form.Label>
                      <Form.Control type="text"
                        name="phone-number"
                        value={formData?.userPhoneNumber}
                        onChange={(e) => handleInputChange('userPhoneNumber', e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={{ span: 4 }} xs={{ span: 12 }}>
                    <Form.Group controlId="designation" className='mb-3'>
                      <Form.Label>Designation</Form.Label>
                      <Form.Control type="text"
                        name="designation"
                        value={formData?.designation}
                        onChange={(e) => handleInputChange('designation', e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={{ span: 4 }} xs={{ span: 12 }}>
                    <Form.Group controlId="email" className='mb-3'>
                      <Form.Label>Email <span className='text-danger'>*</span></Form.Label>
                      <Form.Control type="email"
                        name="email"
                        email="email"
                        value={formData?.userEmail}
                        onChange={(e) => handleInputChange('userEmail', e.target.value)}
                      />
                      {fieldErrors.userEmail && <p className='error-message' style={{ color: '#ff5500' }}>{fieldErrors.userEmail}</p>}
                      {fieldErrors.generalError && (
                        <p className='error-message' style={{ color: '#ff5500' }}>{fieldErrors?.generalError}</p>
                      )}
                    </Form.Group>
                  </Col>
                </Row>
              </div>
            </Card.Body>
          </Card>
          <Card>
            <Card.Body>
              <Card.Title>Signup Details</Card.Title>

              <div className='input-elements'>
                <Row className="justify-content-md-center">
                  <Col md={{ span: 4 }} xs={{ span: 12 }}>
                    <Form.Group controlId='username' className='mb-3'>
                      <Form.Label>Username<span className='text-danger'>*</span></Form.Label>
                      <Form.Control
                        type='text'
                        name='username'
                        value={formData.username}
                        onChange={(e) => handleInputChange('username', e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={{ span: 4 }} xs={{ span: 12 }}>
                    <Form.Group controlId='password' className='mb-3'>
                      <Form.Label>Password <span className='text-danger'>*</span></Form.Label>
                      <div className="password-input position-relative">
                        <Form.Control
                          type={passwordVisible ? 'text' : 'password'}
                          name='password'
                          value={formData.password}
                          onChange={(e) => handleInputChange('password', e.target.value)}
                        />
                        <i
                          className={`bi bi-eye${showPassword ? '-slash' : ''}`}
                          onClick={() => setShowPassword((prevShowPassword) => ({ ...prevShowPassword, password: !prevShowPassword?.password }))}

                        >
                        </i>
                        <div className='eye-icon position-absolute'>
                            <Image
                                src={passwordVisible ? eyeSlashIcon : eyeIcon}
                                width={20}
                                height={20}
                                alt={passwordVisible ? 'Hide password' : 'Show password'}
                                onClick={togglePasswordVisibility}
                                className="password-toggle"
                            />
                        </div>
                      </div>
                      {fieldErrors.password && <p className='error-message' style={{ color: '#ff5500' }}>{fieldErrors.password}</p>}

                    </Form.Group>
                  </Col>
                  <Col md={{ span: 4 }} xs={{ span: 12 }}>
                    <Form.Group controlId='confirmPassword' className='mb-3'>
                      <Form.Label>Confirm Password <span className='text-danger'>*</span></Form.Label>
                      <div className="password-input position-relative">
                        <Form.Control
                          type={passwordVisible ? 'text' : 'password'}
                          name='confirmPassword'
                          value={formData.confirmPassword}
                          onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        />
                        <i
                          className={`bi bi-eye${showPassword ? '-slash' : ''}`}
                          onClick={() => setShowPassword((prevShowPassword) => ({ ...prevShowPassword, confirmPassword: !prevShowPassword?.confirmPassword }))}
                        ></i>
                         <div className='eye-icon position-absolute'>
                            <Image
                                src={passwordVisible ? eyeSlashIcon : eyeIcon}
                                width={20}
                                height={20}
                                alt={passwordVisible ? 'Hide password' : 'Show password'}
                                onClick={togglePasswordVisibility}
                                className="password-toggle"
                            />
                        </div>
                      </div>
                      {fieldErrors.confirmPassword && (
                        <p className='error-message' style={{ color: '#ff5500' }}>{fieldErrors.confirmPassword}</p>
                      )}
                    </Form.Group>
                  </Col>
                  {
                    showOtpField &&
                    <Col md={{ span: 4 }} xs={{ span: 12 }}>
                      <Form.Group controlId='otp' className='mb-3'>
                        <Form.Label>Enter OTP</Form.Label>
                        <Form.Control
                          name='otp'
                          type='password'
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                        />


                        {otpError ? (
                          <p className='error-message' style={{ color: '#ff5500' }}>{otpError}</p>
                        ) :
                          <p className='success-message' style={{ color: 'green' }}>OTP has been sent to {formData.userEmail}</p>
                        }
                      </Form.Group>
                    </Col>
                  }

                </Row>
              </div>
            </Card.Body>
          </Card>
          <div className='text-center'>
            {showOtpField ?

              <Button label="Verify" onClick={handleVerifyOtp} className="golden" disabled={isFormInvalid()} />
              : <Button label="Submit" onClick={handleSubmit} className="golden" disabled={isFormInvalid()} />}
          </div>
        </Form>
      </div>
      <div className='page-footer-bg'></div>

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
              <div className='text'>Updating user details</div>
              <ProgressBar now={now} label={`${now}%`} />
          </Modal.Body>
      </Modal>

      <Modal className='loader-modal register-success-modal text-center' show={show} centered>
          <Modal.Body>
              {loginSuccess && 
                  <>
                    <div className='error-icon success-image'>
                        <Image
                            src="/icons/success.gif"
                            layout='fill'
                            objectFit='contain'
                            alt='Loader'
                        />
                    </div>
                    <div className='text' style={{ color: '#CFA935' }}>Thank you for choosing to join us.</div>
                    <p className='text-success'><strong>We are currently reviewing your application, and once it is approved, you will receive a notification via email.</strong></p>
                    <button className='success mt-2' onClick={handleSuccessClose}>Ok</button>
                </>
              }
              {loginError &&   
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
              }
          </Modal.Body>
      </Modal>
    </div>
  );
}

export default Register;