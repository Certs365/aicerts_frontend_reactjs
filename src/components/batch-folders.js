import Image from 'next/image';
import React, { useState } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';

const BatchFolders = () => {
    const [isImageLoading, setIsImageLoading] = useState(false);
    const [filteredCertificatesArray, setFilteredCertificatesArray] = useState([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 12, 13, 11, 11, 11, 11, 11]);

    return (
        <Container fluid className="my-4">
            <Row className='d-flex flex-row justify-content-start'>
                {filteredCertificatesArray && filteredCertificatesArray?.map((detail, index) => (
                    <Col key={index}  className="mb-4">
                        <div className=''>

                        </div>
                    </Col>
                ))}
            </Row>
        </Container>
    );
}

export default BatchFolders;
