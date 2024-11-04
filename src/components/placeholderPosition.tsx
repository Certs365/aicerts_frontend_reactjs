import React, { useState, useRef, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import Modal from 'react-bootstrap/Modal';
import Image from 'next/image';
import { Rnd } from 'react-rnd';
import { PDFPageProxy } from 'pdfjs-dist/types/src/display/api'; // Import the type directly from pdfjs-dist

// Placeholder type definition
interface Placeholder {
    show: boolean;
    xpos: number;
    ypos: number;
    width: number;
    height: number;
    isLocked: boolean;
}

interface Placeholders {
    [key: string]: Placeholder;
}

// Props type definition
interface PlaceholderPositionProps {
    fileUrl: string;
    scale: number;
    placeholders: Placeholders;
    setPlaceholders: React.Dispatch<React.SetStateAction<Placeholders>>;
}

const PlaceholderPosition: React.FC<PlaceholderPositionProps> = ({ fileUrl, scale, placeholders, setPlaceholders }) => {
    const [numPages, setNumPages] = useState<number | null>(null);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [error, setError] = useState<string>("");
    const [success, setSuccess] = useState<string>("");
    const [show, setShow] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [pdfDimensions, setPdfDimensions] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
    const [currentScale, setCurrentScale] = useState<number>(scale);

    pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
        setNumPages(numPages);
    };

    const onPageLoadSuccess = (page: PDFPageProxy) => {
        const { width, height } = page.getViewport({ scale: currentScale });
        setPdfDimensions({ width, height });
    };

    const handlePlaceholderChange = (key: string, changes: Partial<Placeholder>) => {
        setPlaceholders(prevPlaceholders => ({
            ...prevPlaceholders,
            [key]: { ...prevPlaceholders[key], ...changes }
        }));
    };

    // Update scale based on screen width for responsiveness
    useEffect(() => {
        const updateScale = () => {
            const width = window.innerWidth;
            let newScale = 1; // Default scale

            if (width < 768) {
                newScale = 0.5; // Mobile view scale
            } else if (width >= 768 && width < 1200) {
                newScale = 0.75; // Tablet view scale
            }

            setCurrentScale(newScale);
        };

        updateScale(); // Set initial scale

        // Add event listener for window resize
        window.addEventListener('resize', updateScale);
        return () => window.removeEventListener('resize', updateScale);
    }, []);

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.style.width = `${pdfDimensions.width}px`;
            containerRef.current.style.height = `${pdfDimensions.height}px`;
        }
    }, [pdfDimensions, currentScale]);

    return (
        <div 
        className="hide-scrollbar"
            style={{ 
                height: 'fit-content', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                maxWidth: '100%', 
                overflowX: 'auto' 
            }}
        >
            <div
                className="hide-scrollbar"
                ref={containerRef}
                style={{
                    overflow: 'auto',
                    position: 'relative',
                    maxWidth: '100%', 
                    maxHeight: '80vh',
                    touchAction: 'pan-y'
                }}
            >
                <Document 
                    file={fileUrl} 
                    onLoadSuccess={onDocumentLoadSuccess} 
                    onLoadError={console.error}
                >
                    <Page 
                        pageNumber={pageNumber} 
                        scale={currentScale} 
                        renderTextLayer={false} 
                        onLoadSuccess={onPageLoadSuccess} 
                    />
                </Document>
                
                {/* Render all placeholders dynamically */}
                {Object.keys(placeholders).map((key) => {
                    const placeholder = placeholders[key];
                    
                    return (
                        placeholder.show && (
                            <Rnd
    key={key}
    size={{ width: placeholder.width * currentScale, height: placeholder.height * currentScale }}
    position={{ x: placeholder.xpos * currentScale, y: placeholder.ypos * currentScale }}
    onDragStop={(e, d) => {
        if (!placeholder.isLocked) {
            handlePlaceholderChange(key, { 
                xpos: Math.max(0, d.x / currentScale), // Ensure it stays within bounds
                ypos: Math.max(0, d.y / currentScale)
            });
        }
    }}
    onResizeStop={(e, direction, ref, delta, position) => {
        if (!placeholder.isLocked) {
            handlePlaceholderChange(key, {
                width: ref.offsetWidth / currentScale,
                height: ref.offsetHeight / currentScale,
                xpos: Math.max(0, position.x / currentScale), // Ensure it stays within bounds
                ypos: Math.max(0, position.y / currentScale),
            });
        }
    }}
    lockAspectRatio={key === 'QrCode'} // Lock aspect ratio for QR code
    bounds="parent"
    disableDragging={placeholder.isLocked}
    enableResizing={!placeholder.isLocked}
    style={{
        border: '2px solid red',
        backgroundColor: placeholder.isLocked ? 'rgba(255,0,0,0.1)' : 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#ff5500',
        fontSize: '20px',
        fontWeight: 'bold'
    }}
>
    <div>{key}</div>
</Rnd>

                        )
                    );
                })}
            </div>
            
            {/* Modals for loading/error/success */}
            <Modal className='loader-modal' show={isLoading} centered>
                <Modal.Body style={{ display: "flex", flexDirection: "column", textAlign: "center" }}>
                    <div className='certificate-loader'>
                        <Image
                            src="/backgrounds/login-loading.gif"
                            layout='fill'
                            objectFit='contain'
                            alt='Loader'
                        />
                    </div>
                    <p>Please don't reload the page. It may take a few minutes.</p>
                </Modal.Body>
            </Modal>

            <Modal className='loader-modal text-center' show={show} centered onHide={() => setShow(false)}>
                <Modal.Body className='p-5'>
                    {error && (
                        <>
                            <div className='error-icon'>
                                <Image
                                    src="/icons/close.svg"
                                    layout='fill'
                                    objectFit='contain'
                                    alt='Error'
                                />
                            </div>
                            <h3 style={{ color: '#ff5500' }}>{error}</h3>
                            <button className='warning' onClick={() => setShow(false)}>Ok</button>
                        </>
                    )}
                    {success && (
                        <>
                            <div className='error-icon'>
                                <Image
                                    src="/icons/check-mark.svg"
                                    layout='fill'
                                    objectFit='contain'
                                    alt='Success'
                                />
                            </div>
                            <h3 style={{ color: 'green' }}>{success}</h3>
                            <button className='success' onClick={() => setShow(false)}>Ok</button>
                        </>
                    )}
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default PlaceholderPosition;