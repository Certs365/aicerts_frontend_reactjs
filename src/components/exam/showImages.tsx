// components/ShowImages.tsx
import React from 'react';
import PropTypes from 'prop-types';
import Image from 'next/legacy/image';
import { Container, Row, Col, Card } from 'react-bootstrap';

interface ShowImagesProps {
    imageUrls: string[];
}

const ShowImages: React.FC<ShowImagesProps> = ({ imageUrls }) => {
    return (
        <div className="page-bg">
            <Container className="mt-5">
                <Row className="justify-content-md-center">
                    <h3 className="title">Uploaded Certificates</h3>
                    {imageUrls.map((url, index) => (
                        <Col xs={12} md={4} key={index}>
                            <Card className="p-0">
                                <Card.Header>Certificate {index + 1}</Card.Header>
                                <Card.Body>
                                    <div className="batch-cert-temp">
                                        <Image
                                            src={url}
                                            layout="fill"
                                            objectFit="contain"
                                            alt={`Certificate ${index + 1}`}
                                        />
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>
        </div>
    );
};

ShowImages.propTypes = {
    imageUrls: PropTypes.arrayOf(PropTypes.string.isRequired),
};

export default ShowImages;
