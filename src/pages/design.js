import React, { useState } from 'react';
import { Container, Row, Col, Card, Pagination, Form, InputGroup } from 'react-bootstrap';
import Button from '../../shared/button/button';
import Image from 'next/legacy/image';

export default function CertificateDesign() {
  const [activeTab, setActiveTab] = useState('Certificates'); // State to track the active tab

  const certificates = Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    title: 'Bitcoin+ Certificate',
    date: '15/12/2024',
    image: '/backgrounds/Certificate_template_1.png',
  }));

  const badges = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    title: 'AI Badge',
    date: '10/11/2024',
    image: '/badge-assets/bases/b3.jpg',
  }));

  const displayedItems = activeTab === 'Certificates' ? certificates : badges;

  return (
    <Container fluid className="certificate-design py-4">
      {/* Header with Navigation */}
      <div className="section-header d-flex justify-content-between align-items-center mb-4">
        <h2>Certificate Design</h2>
        <div className="d-flex align-items-center">
          <Button
            className={`design-tabs ${activeTab === 'Certificates' ? 'active golden' : ''}`}
            label="Certificates"
            onClick={() => setActiveTab('Certificates')}
          />
          <Button
            className={`design-tabs ${activeTab === 'Badges' ? 'active' : ''}`}
            label="Badges"
            onClick={() => setActiveTab('Badges')}
          />
        </div>
        <InputGroup style={{ maxWidth: '300px' }}>
          <Form.Control placeholder="Search..." />
          <Image 
            src='/icons/search-submit.svg'
            width={40}
            height={40}
            alt='Search'
          />
        </InputGroup>
        <Button className="golden" label="Design Certificate" />
      </div>

      {/* Display Grid Based on Active Tab */}
      <Row className="section-body g-4">
        {displayedItems.map((item) => (
          <Col key={item.id} md={3}>
            <Card className="h-100 shadow-sm border-0">
              <Card.Img
                variant="top"
                src={item.image}
                alt={item.title}
                className="p-2"
                style={{ borderRadius: '8px' }}
              />
              <Card.Body>
                <Card.Title className="h6">{item.title}</Card.Title>
                <div className="d-flex justify-content-between align-items-center mt-3">
                  <div className="card-date d-flex align-items-center gap-2">
                    <Image 
                      src='/icons/calendar-outline.svg'
                      width={14}
                      height={14}
                      alt='View Certificate'
                    />
                    <h5>{item.date}</h5>
                  </div>
                  <div className="action-icons d-flex gap-2">
                    <Image 
                      src='/icons/eye-grey.svg'
                      width={40}
                      height={40}
                      alt='View Certificate'
                    />
                    <Image 
                      src='/icons/edit-pencil.svg'
                      width={40}
                      height={40}
                      alt='View Certificate'
                    />
                    <Image 
                      src='/icons/delete.svg'
                      width={40}
                      height={40}
                      alt='View Certificate'
                    />
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Pagination */}
      <div className="card-pagination d-flex justify-content-between align-items-center mt-4">
        <div className='lenght'>Showing {displayedItems.length} of 24</div>
        <Pagination>
          <Pagination.Prev />
          <Pagination.Item active>{1}</Pagination.Item>
          <Pagination.Item>{2}</Pagination.Item>
          <Pagination.Item>{3}</Pagination.Item>
          <Pagination.Next />
        </Pagination>
        <Form.Group className="page-jump d-flex align-items-center gap-2">
          <Form.Label className="mb-0">Jump to</Form.Label>
          <Form.Control type="number" size="sm" style={{ maxWidth: '60px' }} />
        </Form.Group>
      </div>
    </Container>
  );
}
