// @ts-nocheck

import React, { useState, useEffect, useContext } from 'react';
import PlaceholderPosition from "../components/placeholderPosition";
import { createPdfFromImage } from '@/utils/reusableFunctions';
import { useRouter } from 'next/router';
import Button from '../../shared/button/button';
import CertificateContext from '@/utils/CertificateContext';
import { Modal, ProgressBar } from 'react-bootstrap';
import Image from 'next/image';

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
    // @ts-ignore: Implicit any for children prop
    const { setPdfBatchDimentions } = useContext(CertificateContext);
    const [loginError, setLoginError] = useState('');
    const [loginSuccess, setLoginSuccess] = useState('');
    const [show, setShow] = useState(false);
    const [now, setNow] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const [dimentions, setDimentions] = useState<{ width: number | null; height: number | null }>({
        width: null,
        height: null
    });

    const [placeholders, setPlaceholders] = useState<Placeholders>({
        CertificateNumber: { show: true, xpos: 100, ypos: 100, width: 200, height: 50, isLocked: false },
        CourseName: { show: true, xpos: 100, ypos: 150, width: 200, height: 50, isLocked: false },
        Name: { show: true, xpos: 100, ypos: 200, width: 200, height: 50, isLocked: false },
        IssueDate: { show: true, xpos: 100, ypos: 250, width: 200, height: 50, isLocked: false },
        ExpirationDate: { show: true, xpos: 100, ypos: 300, width: 200, height: 50, isLocked: false },
        QrCode: { show: true, xpos: 100, ypos: 400, width: 100, height: 100, isLocked: false },
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
        setIsLoading(true); // Start loading state
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
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
    
            const data = await response.json();
            console.log('Placeholders updated successfully:', data);
    
            await router.push({
                pathname: '/certificate/0',
                query: { certificatePath: certificateUrl, isDesign: true, templateId: cardId },
            });
        } catch (error) {
            console.error('Error updating placeholders:', error);
        } finally {
            setIsLoading(false); // End loading state after everything completes
        }
    };
    
    const handleClose = () => {
        setShow(false);
        setLoginError("")
      };
    
    return (
        <div className='d-flex flex-column justify-content-center align-items-center'>
            <PlaceholderPosition
                fileUrl={file}
                scale={1}
                placeholders={placeholders}
                setPlaceholders={setPlaceholders}
            />
            <Button label='Submit' className='golden mt-3' onClick={submitDimentions} />
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
          <div className='text'>Updating Dimentions</div>
          <ProgressBar now={now} label={`${now}%`} />
        </Modal.Body>
      </Modal>

      <Modal onHide={handleClose} className='loader-modal text-center' show={show} centered>
        <Modal.Body>
          {loginError !== '' ? (
            <>
              <div className='error-icon'>
                <Image
                  src="/icons/invalid-password.gif"
                  layout='fill'
                  objectFit='contain'
                  alt='Loader'
                />
              </div>
              <div className='text' style={{ color: '#ff5500' }}>{loginError}</div>
              <button className='warning' onClick={handleClose}>Ok</button>
            </>
          ) : (
            <>
              <div className='error-icon success-image' style={{ marginBottom: '20px' }}>
                <Image
                  src="/icons/success.gif"
                  layout='fill'
                  objectFit='contain'
                  alt='Loader'
                />
              </div>
              <div className='text' style={{ color: '#CFA935' }}>{loginSuccess}</div>
              <button className='success' onClick={handleClose}>Ok</button>
            </>
          )}


        </Modal.Body>
      </Modal>
        </div>
    );
};

export default Placeholder;
