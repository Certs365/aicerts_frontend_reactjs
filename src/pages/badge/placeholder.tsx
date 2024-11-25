// @ts-nocheck
import React, { useState, useEffect, useContext } from 'react';
import { createPdfFromImage } from '@/utils/reusableFunctions';
import { useRouter } from 'next/router';
import CertificateContext from '@/utils/CertificateContext';
import { Modal, ProgressBar } from 'react-bootstrap';
import Image from 'next/image';
import { FaTrash } from 'react-icons/fa';
import PlaceholderPosition from '@/components/placeholderPosition';
import Button from '../../../shared/button/button';

const apiUrl = process.env.NEXT_PUBLIC_BASE_URL_USER;

type PlaceholderType = {
    show: boolean;
    xpos: number;
    ypos: number;
    width: number;
    height: number;
    isLocked: boolean;
};

type Placeholders = {
    [key: string]: PlaceholderType;
    TemplateHeight: number;
    TemplateWidth: number;
};

const Placeholder: React.FC = () => {
    const [file, setFile] = useState<string>('');
    const router = useRouter();
    const { certificateUrl, cardId } = router.query;
    const { setPdfBatchDimentions } = useContext(CertificateContext);
    const [isLoading, setIsLoading] = useState(false);
    const [isPdfGenerating, setIsPdfGenerating] = useState<boolean>(true);

    const [placeholders, setPlaceholders] = useState<Placeholders>({
        CertificateNumber: { show: true, xpos: 100, ypos: 100, width: 200, height: 50, isLocked: false },
        Name: { show: true, xpos: 100, ypos: 150, width: 200, height: 50, isLocked: false },
        TemplateHeight: 793,
        TemplateWidth: 1122
    });

    const [otherState, setOtherState] = useState<{ [key: string]: string }>({});
    const [newField, setNewField] = useState<{ key: string; value: string }>({ key: '', value: '' });

    useEffect(() => {
        const generatePdf = async () => {
            if (certificateUrl) {
                setIsPdfGenerating(true);
                const pdfFile = await createPdfFromImage(certificateUrl as string);
                if (pdfFile) {
                    setFile(pdfFile.url);
                }
                setIsPdfGenerating(false);
            }
        };

        generatePdf();
    }, [certificateUrl]);

    const addField = () => {
        const { key, value } = newField;
        if (key && value && !placeholders[key]) {
            setPlaceholders({
                ...placeholders,
                [key]: { show: true, xpos: 100, ypos: 100, width: 200, height: 50, isLocked: false },
            });
            setOtherState({
                ...otherState,
                [key]: value,
            });
            setNewField({ key: '', value: '' });
        }
    };

    const removeField = (key: string) => {
        const updatedPlaceholders = { ...placeholders };
        const updatedOtherState = { ...otherState };
        delete updatedPlaceholders[key];
        delete updatedOtherState[key];
        setPlaceholders(updatedPlaceholders);
        setOtherState(updatedOtherState);
    };

    const handleInputChange = (field: keyof typeof newField, value: string) => {
        setNewField({ ...newField, [field]: value });
    };

    const submitDimentions = async () => {
        setIsLoading(true);
        setPdfBatchDimentions(placeholders);

        try {
            const response = await fetch(`${apiUrl}/api/update-certificate-template`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    dimentions: placeholders,
                    id: cardId,
                }),
            });

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            await router.push({
                pathname: '/certificate/0',
                query: { certificatePath: certificateUrl, isDesign: true, templateId: cardId },
            });
        } catch (error) {
            console.error('Error updating placeholders:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="page-bg">
                <div className="position-relative h-100">
                    <div className="vertical-center">
                        <div className="d-flex flex-column justify-content-center align-items-center">
                            <PlaceholderPosition
                                fileUrl={file}
                                scale={1}
                                placeholders={placeholders}
                                setPlaceholders={setPlaceholders}
                                isPdfGenerating={isPdfGenerating}
                            />
                            <div className="mt-4">
                                <input
                                    type="text"
                                    placeholder="Field Key"
                                    value={newField.key}
                                    onChange={(e) => handleInputChange('key', e.target.value)}
                                    className="me-2"
                                />
                                <input
                                    type="text"
                                    placeholder="Field Value"
                                    value={newField.value}
                                    onChange={(e) => handleInputChange('value', e.target.value)}
                                    className="me-2"
                                />
                                <Button label="Add Field" className="golden" onClick={addField} />
                            </div>
                            <div className="mt-3">
                                {Object.keys(placeholders).map((key) => {
                                    if (key === 'TemplateHeight' || key === 'TemplateWidth') return null;
                                    return (
                                        <div key={key} className="d-flex align-items-center my-2">
                                            <span>{key}</span>
                                            <Button
                                                label={<FaTrash />}
                                                className="btn-danger ms-2"
                                                onClick={() => removeField(key)}
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                            <Button label="Submit" className="golden mt-3" onClick={submitDimentions} />
                        </div>
                    </div>
                </div>
            </div>
            <Modal className="loader-modal" show={isLoading} centered>
                <Modal.Body>
                    <div className="certificate-loader">
                        <Image
                            src="/backgrounds/login-loading.gif"
                            layout="fill"
                            objectFit="contain"
                            alt="Loader"
                        />
                    </div>
                    <div className="text">Updating Dimentions</div>
                    <ProgressBar now={0} label={`0%`} />
                </Modal.Body>
            </Modal>
        </>
    );
};

export default Placeholder;
