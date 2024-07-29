import React, { useEffect, useState } from 'react';
import DisplayPdf from './DisplayPdf';
import Button from '../../shared/button/button';
import { Col, Form, InputGroup, Modal, ProgressBar, Row } from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa';
import Image from 'next/image';
import fileDownload from 'react-file-download';
import { useRouter } from 'next/router';

const QrPdfForm = ({ selectedFile }) => {
  const router = useRouter();
  const [isLocked, setIsLocked] = useState(false);
  const [certificateDetails, setCertificateDetails] = useState({
    documentNumber: '',
    name: '',
  });
  const [customFields, setCustomFields] = useState([]);
  const [rectangle, setRectangle] = useState({
    x: 100,
    y: 100,
    width: 130,
    height: 130
  });
  const [now, setNow] = useState(0);

  const [blobUrl, setBlobUrl] = useState(null);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState(null);
  const [email, setEmail] = useState(null);
  const adminUrl = process.env.NEXT_PUBLIC_BASE_URL_admin;

  const toggleLock = () => {
    setIsLocked(!isLocked);
  };

  const handleClose = () => {
    setShow(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCertificateDetails({ ...certificateDetails, [name]: value });
  };

  const addCustomField = () => {
    if (customFields.length < 5) {
      setCustomFields([...customFields, { type: '', placeholder: '', value: '' }]);
    }
  };

  const handleCustomFieldChange = (index, field, value) => {
    const newCustomFields = [...customFields];
    newCustomFields[index][field] = value;
    setCustomFields(newCustomFields);
  };

  const deleteCustomField = (index) => {
    const newCustomFields = customFields.filter((_, i) => i !== index);
    setCustomFields(newCustomFields);
  };

  const handleDownload = (e) => {
    e.preventDefault();
    if (blobUrl) {
      const fileData = new Blob([blobUrl], { type: 'application/pdf' });
      fileDownload(fileData, `Certificate_${certificateDetails.documentNumber}.pdf`);
    }
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));

    if (storedUser && storedUser.JWTToken) {
      setToken(storedUser.JWTToken);
      setEmail(storedUser.email)
    }
  }, []);

  const checkForDuplicateKeys = () => {
    const keys = customFields.map(field => field.placeholder);
    return keys.some((key, index) => keys.indexOf(key) !== index);
  };

  const issueCertificate = async () => {
    if (!rectangle) return;

    if (checkForDuplicateKeys()) {
      setError('Duplicate keys found in custom fields. Please ensure all placeholders are unique.');
      setShow(true);
      return;
    }

    setIsLoading(true);
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
      setNow(0); // Progress complete
    };

    startProgress();
    try {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('certificateNumber', certificateDetails.documentNumber);
      formData.append('name', certificateDetails.name);

      const customFieldsObject = customFields.reduce((obj, field) => {
        obj[field.placeholder] = field.value;
        return obj;
      }, {});
      const customFieldsJSON = JSON.stringify(customFieldsObject);
      formData.append('customFields', customFieldsJSON);

      formData.append('posx', Math.round(rectangle.x));
      formData.append('posy', Math.round(rectangle.y));
      const qrsize = Math.round((Math.abs(rectangle.width) + Math.abs(rectangle.height)) / 2);
      formData.append('qrsize', qrsize);
      formData.append('file', selectedFile);

      const response = await fetch(`${adminUrl}/api/issue-dynamic-pdf`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });
      if (response && response.ok) {
        const blob = await response.blob();
        setBlobUrl(blob);
        setSuccess("Certificate Successfully Generated")
        setShow(true);
      } else if (response) {
        const responseBody = await response.json();
        const errorMessage = responseBody && responseBody.message ? responseBody.message : 'An error occurred';
        console.error('API Error:' || 'An error occurred');
        setError(errorMessage);
        setShow(true);
      } else {
        console.error('No response received from the server.');
      }
    }
    catch (error) {
      console.error('Error during API request:', error);
    } finally {
      stopProgress();
      setIsLoading(false)
    }
  };

  const isFormValid = () => {
    if (!certificateDetails.documentNumber || !certificateDetails.name) {
      return false;
    }
    for (let field of customFields) {
      if (!field.type || !field.placeholder || !field.value) {
        return false;
      }
    }
    return true;
  };

  return (
    <div>
      <div className='display-wrapper hide-scrollbar'>
        <DisplayPdf file={selectedFile} scale={1} toggleLock={toggleLock} isLocked={isLocked} setRectangle={setRectangle} rectangle={rectangle} />
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
          <Button label={isLocked ? 'Unlock QR Code Location' : 'Lock QR Code Location'} className='golden' onClick={toggleLock} />
        </div>
      </div>
      <div className='certificate-form-wrapper mt-5'>
        <div className='qr-form-title'>
          <h6 className='form-title'>Certificate Details</h6>
        </div>
        <div className='p-5'>
          <Row className='d-flex justify-content-md-center align-items-center'>
            <Col md={{ span: 4 }} xs={{ span: 12 }}>
              <Form.Group controlId='documentNumber' className='mb-3'>
                <Form.Label>Document Number<span className='text-danger'>*</span></Form.Label>
                <InputGroup>
                  <Form.Control
                    type='text'
                    name='documentNumber'
                    value={certificateDetails.documentNumber}
                    onChange={handleChange}
                    required
                    maxLength={50}
                  />
                </InputGroup>
              </Form.Group>
            </Col>
            <Col md={{ span: 4 }} xs={{ span: 12 }}>
              <Form.Group controlId='name' className='mb-3'>
                <Form.Label>Name<span className='text-danger'>*</span></Form.Label>
                <InputGroup>
                  <Form.Control
                    type='text'
                    name='name'
                    value={certificateDetails.name}
                    onChange={handleChange}
                    required
                    maxLength={50}
                  />
                </InputGroup>
              </Form.Group>
            </Col>
            
            <Col md={{ span: 4 }} xs={{ span: 12 }}>
              <Button label='Add More Field' className='golden' onClick={addCustomField} disabled={customFields.length >= 5} />
            </Col>
          </Row>

          {customFields && customFields.length > 0 && (
            <>
              <hr />
              <h6 className="form-title2">Custom Fields</h6>
            </>
          )}

          {customFields.map((field, index) => (
            <Row key={index} className='align-items-center'>
              <Col md={{ span: 3 }} xs={{ span: 12 }}>
                <Form.Group controlId={`customFieldType-${index}`} className='mb-3'>
                  <Form.Label>Type <span className='text-danger'>*</span></Form.Label>
                  <Form.Control
                    as='select'
                    value={field.type}
                    onChange={(e) => handleCustomFieldChange(index, 'type', e.target.value)}
                    required
                  >
                    <option value=''>Select Type</option>
                    <option value='text'>Text</option>
                    <option value='number'>Number</option>
                    <option value='date'>Date</option>
                  </Form.Control>
                </Form.Group>
              </Col>
              {field.type && (
                <>
                  <Col md={{ span: 3 }} xs={{ span: 12 }}>
                    <Form.Group controlId={`customFieldPlaceholder-${index}`} className='mb-3'>
                      <Form.Label>Placeholder <span className='text-danger'>*</span></Form.Label>
                      <Form.Control
                        type='text'
                        value={field.placeholder}
                        onChange={(e) => handleCustomFieldChange(index, 'placeholder', e.target.value)}
                        required
                        maxLength={20}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={{ span: 3 }} xs={{ span: 12 }}>
                    <Form.Group controlId={`customFieldValue-${index}`} className='mb-3'>
                      <Form.Label>Value <span className='text-danger'>*</span></Form.Label>
                      <Form.Control
                        type={field.type}
                        value={field.value}
                        onChange={(e) => handleCustomFieldChange(index, 'value', e.target.value)}
                        required
                        maxLength={150}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={{ span: 1 }} xs={{ span: 12 }}>
                    <Button label={<FaTrash />} className='btn-danger' onClick={() => deleteCustomField(index)} />
                  </Col>
                </>
              )}
            </Row>
          ))}
          <div className='text-center mt-3'>
            {blobUrl ? (
              <>
                <Button onClick={(e) => { handleDownload(e) }} label="Download Certification" className="golden me-2" disabled={isLoading} />
                <Button onClick={(e) => { router.reload(); }} label="Issue New Certificate" className="golden" disabled={isLoading} />
              </>
            ) : (
              <Button label='Issue Certificate' className='golden ' onClick={issueCertificate} disabled={!isFormValid() || !isLocked || isLoading} />
            )}
          </div>
        </div>
      </div>
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
          <div className='text'>Issuing certification.</div>
          <ProgressBar now={now} label={`${now}%`} />
        </Modal.Body>
      </Modal>

      <Modal onHide={handleClose} className='loader-modal text-center' show={show} centered>
        <Modal.Body>
          {error !== '' ? (
            <>
              <div className='error-icon success-image'>
                <Image
                  src="/icons/invalid-password.gif"
                  layout='fill'
                  objectFit='contain'
                  alt='Loader'
                />
              </div>
              <div className='text' style={{ color: '#ff5500' }}>{error}</div>
              <button className='warning' onClick={handleClose}>Ok</button>
            </>
          ) : (
            <>
              <div className='error-icon success-image'>
                <Image
                  src="/icons/success.gif"
                  layout='fill'
                  objectFit='contain'
                  alt='Loader'
                />
              </div>
              <div className='text' style={{ color: '#CFA935' }}>{success}</div>
              <button className='success' onClick={handleClose}>Ok</button>
            </>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default QrPdfForm;
