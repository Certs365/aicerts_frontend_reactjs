import React, { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import Image from 'next/image';
import PrimaryButton from '@/common/button/primaryButton';
import user from '@/services/userServices';
import { toast } from 'react-toastify';

// Define the props for the component
interface QrCodeSelectorProps {
    qrCodes: string[]; // Array of QR code image URLs
}

const QrCodeSelector: React.FC<QrCodeSelectorProps> = ({ qrCodes }) => {
    // State to track the selected QR code and loading state
    const [selectedQr, setSelectedQr] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [qrPrefrence, setQrPrefrence] = useState<string | null>(null);
    const [now, setNow] = useState(0);
    const [show, setShow] = useState(false);  // Assuming this state is used for showing a success message

    // Fetch data when the component mounts
    useEffect(() => {
        const fetchData = async (email: string) => {
            const data = { email: email };

            setIsLoading(true);
            setNow(10); // Set initial progress state

            let progressInterval: NodeJS.Timeout; // Explicitly typing progressInterval

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
                setNow(100); // Progress complete
            };

            startProgress();

            try {
                const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
                if (storedUser?.email) {
                    // Fetch the issuer data using the user service
                    user.getIssuerByEmail(data, (response) => {
                        const userData = response.data;
                        const userDetails = userData?.data;
                        setQrPrefrence(userDetails?.qrPreference || null);
                        setSelectedQr(userDetails?.qrPreference || null);  // Set selected QR based on fetched preference
                    });
                }
            } catch (error) {
                console.error('Error fetching issuer data:', error);
            } finally {
                stopProgress();
                setIsLoading(false);
            }
        };

        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        if (storedUser?.email) {
            fetchData(storedUser.email);
        }
    }, []);

    // Handle QR code selection
    const handleQrClick = (qr: number) => {
        setSelectedQr(qr);
    };

    // Handle QR code change and update preference
    const handleChangeQr = async () => {
        setIsLoading(true);
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        const data = {
            email: storedUser.email, qrPreference: selectedQr, id: storedUser?.issuerId, name: storedUser?.name
        };
        try {
            await user.updateIssuer(data, (response) => {
                const userData = response.data;
                const userDetails = userData?.data;
                toast.success(userData?.message || "Updated Successfully")
                setShow(true); // Assuming this triggers a success message
            });
        } catch (error) {
            toast.error('Error updating QR preference');

        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="org-details">
            <h2 className="title">QR Code</h2>
            <Row className="d-flex align-items-center justify-content-center justify-content-md-start m-3">
                {qrCodes.map((qr, index) => (
                    <Col
                        key={index}
                        xs={16}
                        md={2}
                        onClick={() => handleQrClick(index)}
                        className={`qr-container mx-2 mb-4 mb-md-0 ${selectedQr == index ? 'selected' : ''}`}
                    >
                        <Image
                            src={qr}
                            height={100}
                            width={100}
                            objectFit="contain"
                            alt="QR code"
                        />
                    </Col>
                ))}
            </Row>
            <div className="d-flex flex-row justify-content-end m-2">
                <PrimaryButton
                    classes="p-3"
                    label={'Change QR'}
                    loading={isLoading}
                    loadingText='Updating...'
                    onClick={handleChangeQr}
                    disabled={!selectedQr}
                />
            </div>
        </div>
    );
};

export default QrCodeSelector;
