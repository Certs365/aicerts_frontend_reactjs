// components/ShowImages.tsx
import React from 'react';
import PropTypes from 'prop-types';
import Image from 'next/legacy/image';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';

interface ShowImagesProps {
    data: { s3Url: string; enrollmentNumber: string }[]; // Modified to match new structure
    handleDownload: (s3Url: string, enrollmentNumber: string) => void; // Download handler
}

const ShowImages: React.FC<ShowImagesProps> = ({ data, handleDownload }) => {
    return (
        <div className="page-bg">
            <Container className="mt-5">
                <Row className="justify-content-md-center">
                    <h3 className="title">Uploaded Certificates</h3>
                    {data.map((image, index) => (
                        <Col xs={12} md={4} key={index}>
                            <Card className="p-0">
                                <Card.Header>Certificate {index + 1}</Card.Header>
                                <Card.Body>
                                    <div className="batch-cert-temp">
                                        <Image
                                            src={image.s3Url}
                                            width={200}
                                            height={400}
                                            objectFit="contain"
                                            alt={`Certificate ${index + 1}`}
                                        />
                                    </div>
                                    <div className="enrollment-number">
                                        <p>Enrollment Number: {image.enrollmentNumber}</p>
                                    </div>
                                    <Button
                                        onClick={() => handleDownload(image.s3Url, image.enrollmentNumber)}
                                        variant="primary"
                                    >
                                        Download Certificate
                                    </Button>
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
    data: PropTypes.arrayOf(
        PropTypes.shape({
            s3Url: PropTypes.string.isRequired,
            enrollmentNumber: PropTypes.string.isRequired,
        }).isRequired
    ),
    handleDownload: PropTypes.func.isRequired,
};

export default ShowImages;
