import React, { useEffect, useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'
import { useRouter } from 'next/router'
import Image from 'next/legacy/image'

const PaymentSuccess = () => {  // Capitalize the component name

    const router = useRouter();
    const [sessionId, setSessionId] = useState('');

    useEffect(() => {
      if (router.isReady) {
        setSessionId(router.query.session_id || '');
      }
    }, [router.isReady, router.query.session_id]);

    const handleOnClick = (e) => {
        e.preventDefault();
        router.push('/settings');
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const inputElement = e.target.elements[0];
        if (inputElement) {
            inputElement.select();
            document.execCommand('copy');
        }
    }

    if (!router.isReady) {
        return null; // or a loading indicator
    }

    return (
        <div>
            <Modal className='modal-wrapper extend-modal' show={true} centered>
                <Modal.Header className='extend-modal-header'>
                    <span className='extend-modal-header-text'>Payment Successful</span>
                </Modal.Header>
                <Modal.Body>
                    <div className='error-icon'>
                        <Image
                            src="/icons/success.gif"
                            layout='fill'
                            objectFit='contain'
                            alt='Loader'
                        />
                    </div>

                    <div className='text-xs modal-text' style={{ fontSize: '18px' }}>Save this transaction ID for future reference.</div>
                    
                    <div className='d-flex flex-row justify-content-center align-items-baseline gap-4' style={{ height: '36px' }}>
                        <Form className='d-flex align-items-baseline gap-3' onSubmit={handleSubmit}>
                            <Form.Group controlId="formBasicEmail" className='mb-0'>
                                <Form.Control type="text" placeholder="Transaction ID" style={{ width: '200px', outline: 'none', boxShadow: 'none' }} value={sessionId} disabled />
                            </Form.Group>
                            <Button type="submit" className='ml-2 border-none' variant="success">Copy</Button>
                        </Form>
                    </div>
                </Modal.Body>
                <Modal.Footer className='d-flex justify-content-center'>
                    <Button style={{ backgroundColor: "#CFA235", border: 'none' }} onClick={handleOnClick}>Go to main site</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default PaymentSuccess;
