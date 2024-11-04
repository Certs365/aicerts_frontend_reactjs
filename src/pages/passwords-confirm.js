// Import necessary modules and components
import React, { useState } from 'react';
import Image from 'next/image';
import { Container, Form, Row, Col, Modal } from 'react-bootstrap';
import Button from '../../shared/button/button';
import user, { changePassword } from '../services/userServices'; // Update the import based on your actual file structure
import ShowMessage from '../components/showMessage';
import { useRouter } from 'next/router';
import eyeIcon from '../../public/icons/eye.svg';
import eyeSlashIcon from '../../public/icons/eye-slash.svg';
import NavigationLogin from '@/app/navigation-login';

// Component definition
const PasswordsConfirm = () => {
  // Initialize React Router
  const router = useRouter();

  // State variables for password, confirm password, show password toggle, errors, and success message
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ message: '' });
  const [successMessage, setSuccessMessage] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [message, SetMessage] = useState();
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  // Function to toggle password visibility
  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  // Function to handle form submission
  const handleClick = async (e) => {
    e.preventDefault();
    setIsLoading(true)
    try {
      setErrors({ message: '' });

      // Check if fields are filled
      if (!password || !confirmPassword) {
        setErrors({ message: 'Please fill in all the fields!' });
        return;
      }

      // Check if passwords match
      if (password !== confirmPassword) {
        setErrors({ message: 'Passwords do not match!' });
        return;
      }

      // Check if password is at least 8 characters
      if (password.length < 8) {
        setErrors({ message: 'Password should be 8 characters or longer!' });
        return;
      }

      // Extract email from the URL
      const { email } = router.query;

      // Check if email is available
      if (!email) {
        setErrors({ message: 'Email parameter is missing in the URL!' });
        return;
      }

      // Prepare data for API call
      const data = {
        email: email.toString(), // Convert email to string
        password: password,
      };

      // Call the changePassword API with the form data
      user.changePassword(data, (response) => {
        if (response.data.status === 'SUCCESS') {
          // Successful password update
          setSuccessMessage('Password updated successfully');
          setShow(true)
          // router.push("/")
        } else {
          setErrors({ message: response?.data?.message });
        }
      });
    } catch (error) {
      console.error('An error occurred:', error);
    } finally {
      setIsLoading(false)
    }
  };

  // Function to handle cancellation
  const handleClickCancel = () => {
    // Handle cancellation, e.g., redirect or show a confirmation message
    router.push('/');
  };

  const handleClose = () => {
    setShow(false);
    setErrors({ message: '' })
  };

  // Component JSX
  return (
    <>
      <div className='page-bg'>
        <NavigationLogin />

        <div className='position-relative h-100'>
          <div className='forgot-password'>
            <div className='vertical-center'>
              <Container>
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
                    <div className='position-relative h-100'>
                      <div className='vertical-center' style={{ transform: "translateY(-82%)" }}>
                        <h1 className='title'>Create a New Password</h1>
                        <Form className='input-elements' onSubmit={handleClick}>
                          <Form.Group controlId='new-password'>
                            <Form.Label>New Password</Form.Label>
                            <div className="password-input position-relative">
                              <Form.Control
                                type={passwordVisible ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                              />
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
                          </Form.Group>
                          <Form.Group controlId='confirm-password' className='mt-4'>
                            <Form.Label>Confirm Password</Form.Label>
                            <div className="password-input position-relative">
                              <Form.Control
                                type={passwordVisible ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                              />
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
                          </Form.Group>
                          {errors.message && <ShowMessage type='error' message={errors.message} />}
                          {successMessage && <ShowMessage type='success' message={successMessage} />}
                          <div className='d-flex justify-content-between align-items-center'>
                            <Button label='Create a New Password' className='golden w-100' />
                          </div>
                          <div className='d-flex justify-content-between align-items-center'>
                            <Button label='Cancel' onClick={handleClickCancel} className='outlined w-100' />
                          </div>
                        </Form>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Container>
            </div>
          </div>
          <div className='page-footer-bg'></div>
        </div>
      </div>

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
          <div className='text mt-3'>Updating password</div>
        </Modal.Body>
      </Modal>

      <Modal className='loader-modal text-center' show={show} centered>
        <Modal.Body>
          <div className='error-icon'>
            <Image
              src="/icons/success.gif"
              layout='fill'
              objectFit='contain'
              alt='Loader'
            />
          </div>
          <h3 style={{ color: '#CFA935', fontSize: '18px', marginBottom: '12px' }}>{successMessage}</h3>
          <button className='success' onClick={handleClose}>Ok</button>
        </Modal.Body>
      </Modal>
    </>
  );
};

// Export the component
export default PasswordsConfirm;
