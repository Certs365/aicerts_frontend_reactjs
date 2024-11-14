import React, { useState, useRef, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import Modal from 'react-bootstrap/Modal';
import Image from 'next/image';
import { Rnd } from 'react-rnd';
import { PDFPageProxy } from 'pdfjs-dist/types/src/display/api';
import ClipLoader from 'react-spinners/ClipLoader';

interface Placeholder {
    show: boolean;
    xpos: number;
    ypos: number;
    width: number;
    height: number;
    isLocked: boolean;
    text: string;
}

interface Placeholders {
    [key: string]: Placeholder;
}

interface PlaceholderPositionProps {
    fileUrl: string;
    scale: number;
    placeholders: Placeholders;
    setPlaceholders: React.Dispatch<React.SetStateAction<Placeholders>>;
    isPdfGenerating: boolean;
}

const PlaceholderPosition: React.FC<PlaceholderPositionProps> = ({ fileUrl, scale, placeholders, setPlaceholders, isPdfGenerating }) => {
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
        const viewport = page.getViewport({ scale: currentScale });
        setPdfDimensions({ width: viewport.width, height: viewport.height });
    };

    const handlePlaceholderChange = (key: string, changes: Partial<Placeholder>) => {
        setPlaceholders(prevPlaceholders => ({
            ...prevPlaceholders,
            [key]: { ...prevPlaceholders[key], ...changes }
        }));
    };

    const handleTextChange = (key: string, text: string) => {
        handlePlaceholderChange(key, { text });
    };

    const toggleLock = (key: string) => {
        const isCurrentlyLocked = placeholders[key].isLocked;
        handlePlaceholderChange(key, { isLocked: !isCurrentlyLocked });
    };

    useEffect(() => {
        const updateScale = () => {
            const width = window.innerWidth;
            let newScale = 1;

            if (width < 768) {
                newScale = 0.5;
            } else if (width >= 768 && width < 1200) {
                newScale = 0.75;
            }

            setCurrentScale(newScale);
        };

        updateScale();
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
             {isPdfGenerating ? (
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    zIndex: 10
                }}>
                  <ClipLoader color="#555" size={40} />
                    <p>Loading Certificate...</p>
                </div>
            ) : (
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
                
                {Object.keys(placeholders).filter((key) => key !== 'TemplateHeight' && key !== 'TemplateWidth').map((key) => {
                    const placeholder = placeholders[key];
                    
                    return (
                        <Rnd
                            key={key}
                            size={{ width: placeholder.width * currentScale, height: placeholder.height * currentScale }}
                            position={{ x: placeholder.xpos * currentScale, y: placeholder.ypos * currentScale }}
                            onDragStop={(e, d) => {
                                if (!placeholder.isLocked) {
                                    handlePlaceholderChange(key, { 
                                        xpos: d.x / currentScale,
                                        ypos: d.y / currentScale
                                    });
                                }
                            }}
                            onResizeStop={(e, direction, ref, delta, position) => {
                                // Allow resizing even when locked
                                handlePlaceholderChange(key, {
                                    width: ref.offsetWidth / currentScale,
                                    height: ref.offsetHeight / currentScale,
                                    xpos: position.x / currentScale,
                                    ypos: position.y / currentScale,
                                });
                            }}
                            lockAspectRatio={key === 'QrCode'}
                            bounds="parent"
                            disableDragging={placeholder.isLocked}
                            enableResizing={true} // Always allow resizing
                            style={{
                                border: placeholder.isLocked ? '2px solid gray' : '2px dashed black',
                                borderRadius: '10px',
                                backgroundColor: placeholder.isLocked ? 'transparent' : 'rgba(200,200,200,0.1)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '5px',
                                opacity: placeholder.isLocked ? 0.7 : 1 // Slight transparency when locked
                            }}
                            onClick={() => placeholder.isLocked && toggleLock(key)}
                        >
                            <div style={{ 
                                fontSize: '20px',
                                color: 'gray',
                                textAlign: 'center',
                            }}>
                                {placeholder.isLocked ? (placeholder.text || key): 
                                <input
                                    type="text"
                                    value={placeholder.text}
                                    onChange={(e) => handleTextChange(key, e.target.value)}
                                    onBlur={() => handlePlaceholderChange(key, { isLocked: true })}
                                    onFocus={(e) => e.target.style.border = 'transparent'} // Change border to transparent on focus
                                    disabled={key === 'QrCode'}
                                    style={{
                                        border: '1px solid lightgray',
                                        borderRadius: '5px',
                                        background: 'transparent',
                                        color: 'gray',
                                        fontSize: '20px',
                                        fontWeight: 'bold',
                                        textAlign: 'center',
                                        width: '90%',
                                        margin: '0',
                                        outline: 'none', // Remove default outline
                                    }}
                                    placeholder={`${key}`}
                                    autoFocus
                                />}
                            </div>
                        </Rnd>
                    );
                })}
            </div>
            )}
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
