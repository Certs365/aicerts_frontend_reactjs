import React, { useState, useEffect, useContext } from 'react';
import PlaceholderPosition from "../components/placeholderPosition";
import { createPdfFromImage } from '@/utils/reusableFunctions';
import { useRouter } from 'next/router';
import Button from '../../shared/button/button';
import CertificateContext from '@/utils/CertificateContext';

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
    CertificateNumber: PlaceholderType;
    CourseName: PlaceholderType;
    Name: PlaceholderType;
    IssueDate: PlaceholderType;
    ExpirationDate: PlaceholderType;
    QrCode: PlaceholderType;
    TemplateHeight: number;
    TemplateWidth: number;
};

interface PlaceholderProps {
    file: string;
}

const Placeholder: React.FC<PlaceholderProps> = () => {
    const [file, setFile] = useState<string>('');
    const router = useRouter();
    const { certificateUrl, cardId } = router.query;
    const { setPdfBatchDimentions } = useContext(CertificateContext);

    const [dimentions, setDimentions] = useState<{ width: number | null; height: number | null }>({
        width: null,
        height: null
    });

    const [placeholders, setPlaceholders] = useState<Placeholders>({
        CertificateNumber: { show: true, xpos: 100, ypos: 100, width: 200, height: 50, isLocked: false },
        CourseName: { show: true, xpos: 100, ypos: 200, width: 300, height: 50, isLocked: false },
        Name: { show: true, xpos: 100, ypos: 300, width: 250, height: 50, isLocked: false },
        IssueDate: { show: true, xpos: 100, ypos: 400, width: 200, height: 50, isLocked: false },
        ExpirationDate: { show: true, xpos: 100, ypos: 500, width: 200, height: 50, isLocked: false },
        QrCode: { show: true, xpos: 100, ypos: 600, width: 100, height: 100, isLocked: false },
        TemplateHeight: 793,
        TemplateWidth: 1122
    });

    useEffect(() => {
        const generatePdf = async () => {
            if (certificateUrl) {
                const pdfFile = await createPdfFromImage(certificateUrl as string);
                if (pdfFile) {
                    setFile(pdfFile.url);
                    setDimentions({ width: pdfFile.width, height: pdfFile.height });
                }
            }
        };

        generatePdf();
    }, [certificateUrl]);

    const submitDimentions = async () => {
        setPdfBatchDimentions(placeholders);
        try {
            const response = await fetch(`${apiUrl}/api/update-certificate-template`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    dimentions: { ...placeholders, TemplateHeight: dimentions.height, TemplateWidth: dimentions.width },
                    id: cardId,
                }),
            });

            if (!response.ok) {
                console.error('Network response was not ok');
                // throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log('Placeholders updated successfully:', data);

            router.push({
                pathname: '/certificate/0',
                query: { certificatePath: certificateUrl, isDesign: true, templateId: cardId },
            });
        } catch (error) {
            console.error('Error updating placeholders:', error);
        }
    };

    return (
        <div>
            <PlaceholderPosition
                fileUrl={file}
                scale={1}
                placeholders={placeholders}
                setPlaceholders={setPlaceholders}
            />
            <Button label='Submit' className='golden' onClick={submitDimentions} />
        </div>
    );
};

export default Placeholder;
