import React from 'react';
import Image from 'next/legacy/image';

const CertificateTemplateOne = () => {
    return (
        <div className='container py-5'>
            <div className='certificate-template position-relative' id="template-3">
                <div className='hero-logo m-auto position-relative'>
                    <Image

                        src='/logo-black.svg'
                        layout='fill'
                        objectFit="contain"
                        alt='AI Certs logo'
                    />
                </div>
                <div className='hero-info text-center'>This is to certify that</div>
                <div className='issued-to text-center'>jyotish nath</div>
                <div className='hero-message text-center'>Has successfully completed the requirements to be recognized as</div>
                <div className='course-name text-center'>AI CERTsTM Certified Trainer(Bitcoin+)</div>
                <div className='issued-by text-center'>
                    <div className='signature position-relative'>
                        <Image
                            src='/backgrounds/russel-signature.svg'
                            layout='fill'
                            objectFit="contain"
                            alt='Russel Sarder'
                        />
                    </div>
                    <hr />
                    <div className='issuer-info d-flex justify-content-between align-items-center'>
                        <div className='issuer-name'>Russell Sarder</div>
                        <div className='issuer-designation'>Chairman & CEO, AI Certs<sup>&trade;</sup></div>
                    </div>
                </div>
                <div className='badge-position position-absolute'>
                    <div className='ai-badge-logo'>
                        <Image
                            src='/backgrounds/bitcoin-certified-trainer-badge.svg'
                            layout='fill'
                            objectFit="contain"
                            alt='Russel Sarder'
                        />
                    </div>
                </div>
                <div className='bottom-info d-flex justify-content-center align-items-center w-100 position-absolute'>
                    <div className='certificate-info'>Certificate No.: 65432E5W</div>
                    <span>|</span>
                    <div className='certificate-info'>Grant Date: 14 March 2024</div>
                    <span>|</span>
                    <div className='certificate-info'>Expiration Date: 14 March 2025</div>
                </div>
            </div>
        </div>
    );
}

export default CertificateTemplateOne;
