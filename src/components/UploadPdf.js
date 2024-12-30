import React, { useState, useRef, useEffect } from 'react';
import DisplayPdf from './DisplayPdf';

const UploadPdf = () => {
    const [file, setFile] = useState(null);
    const [formData, setFormData] = useState({
        email: '',
        certificateNumber: '',
        name: '',
        course: '',
        grantDate: '',
        expirationDate: ''
    });
    const [isFormComplete, setIsFormComplete] = useState(false);
    const [showPdf, setShowPdf] = useState(false);

    const fileInputRef = useRef(null);

    useEffect(() => {
        const { email, certificateNumber, name, course, grantDate, expirationDate } = formData;
        setIsFormComplete(
            email && certificateNumber && name && course && grantDate && expirationDate && file
        );
    }, [formData, file]);




    return (
        <div className="upload-pdf-container">
            {showPdf && <DisplayPdf file={file} scale={1.5} formDetails={formData} />}
        </div>
    );
};

export default UploadPdf;
