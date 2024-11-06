import React, { useEffect } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'
import { useRouter } from 'next/router'
import Image from 'next/legacy/image'
const paymentSuccess = () => {

    const router = useRouter();
    const [sessionId, setSessionId] = React.useState('');
    // useEffect(() => {
    //     setSessionId(router.query['session_id'] || '');
    // }, [router.query['session-id']]);

    useEffect(() => {
      if (router.isReady) {
        // Ensure that the query parameters are ready before accessing them
        setSessionId(router.query.session_id || '');
      }
    }, [router.isReady, router.query.session_id]);
  
    const handleOnClick = (e) => {
        e.preventDefault();
        router.push('/settings');
    }
    // const handleOnClick = () => {
    //      window.location.href = '/settings';
    // }

    // copy function
    const handleSubmit = (e) => {
            e.preventDefault();
            const inputElement = e.target.elements[0];
            if (inputElement) {
                inputElement.select();
                document.execCommand('copy');
            
        }}

    return (
        <div>
            <Modal className='modal-wrapper extend-modal'  show="true" centered>
                    <Modal.Header className='extend-modal-header'>
                      <span className='extend-modal-header-text'>Payment Successful</span>
                    </Modal.Header>
                    <Modal.Body >
                       <div className='error-icon'>
                         <Image
                            src="/icons/success.gif"
                            layout='fill'
                            objectFit='contain'
                            alt='Loader'
                          />
                       </div>

                        <div className='text-xs modal-text' style={{ fontSize: '18px'}}>Save this transaction ID for future reference.</div>

                        {/* <div className='text-sm modal-text'>Your payment was successful, Please save this transaction ID for future reference.</div> */}
                        
                       <div className='d-flex flex-row justify-content-center align-items-baseline gap-4' style={{height: '36px'}}>
                        <Form className='d-flex align-items-baseline gap-3' onSubmit={handleSubmit}>
                            <Form.Group controlId="formBasicEmail" className='mb-0'>
                                {/* <Form.Label>Transaction ID</Form.Label> */}
                                <Form.Control type="text" placeholder="Transaction ID" style={{ width: '200px', outline: 'none', boxShadow: 'none', disabled: true  }} value={sessionId} />
                                {/* <Form.Text className="text-muted overflow-hidden" style={{ display: 'inline-block', width: '100px' }}>{sessionId}</Form.Text> */}
                                {/* <Form.Control type="text" placeholder="Transaction ID" style={{ width: '200px' }} />
                                <Form.Text className="text-muted" style={{ display: 'inline-block', width: '100px' }}></Form.Text> */}
                            </Form.Group>
                            <Button type="submit" className='ml-2 border-none' variant="success" >Copy</Button>
                        </Form>
                        </div>

                    </Modal.Body>
                    <Modal.Footer className='d-flex justify-content-center'>
                      {/* <Button  className='red-btn px-4' label='Go to Main site' onClik
                      {/* <Button  className='red-btn px-4' label='Go to Main site' onCick={handleOnClick} /> */}
                      <Button  style={{backgroundColor: "#CFA235", border: 'none'}}  onClick={handleOnClick}>Go to main site</Button>
                    </Modal.Footer>
                  </Modal>
        </div>
      )
}
export default paymentSuccess;

