import React, { useState, useEffect, useContext } from 'react';
import DisplayPdf from '../components/DisplayPdf';
import Button from '../../shared/button/button';
import jsPDF from 'jspdf';
import { useRouter } from 'next/router';
import axios from 'axios';
import { PDFDocument } from 'pdf-lib';
import CertificateContext from '../utils/CertificateContext';
import DynamicQrForm from '../components/dynamicQrForm';

const SelectQrPdf = () => {
    const router = useRouter();
    const { certificateUrl } = router.query;
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLocked, setIsLocked] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [rectangle, setRectangle] = useState({
    x: 100,
    y: 100,
    width: 130,
    height: 130
  });
 
  const { pdfDimentions,setPdfDimentions, setPdfFile} = useContext(CertificateContext);
  const toggleLock = () => {
    setIsLocked(!isLocked);
  };

  // Convert the image to PDF
  const convertImageToPdf = async (imageUrl,  detail) => {
    try {
      // Set loading state if needed
    //   setIsLoading(true);
  
      // Fetch the image data
      const response = await axios.get(imageUrl, {
        responseType: 'arraybuffer' // Ensure response is treated as an ArrayBuffer
    });
  
      // Create a new PDF document
      const pdfDoc = await PDFDocument.create();
  
      // Adjust page dimensions based on provided detail or default to A4 size
      const imgWidth = detail?.width || 792;
      const imgHeight = detail?.height || 612;// A4 page dimensions in mm
  
      const page = pdfDoc.addPage([imgWidth, imgHeight]);
  
      // Embed the image (assuming it's PNG for now)
      const pngImage = await pdfDoc.embedPng(response.data);
  
      // Draw the image to fit the page
      page.drawImage(pngImage, {
        x: 0,
        y: 0,
        width: imgWidth,
        height: imgHeight,
      });
  
      // Save the PDF and create a Blob
      const pdfBytes = await pdfDoc.save();
      const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });
      // Create a URL for the Blob
      const pdfUrl = window.URL.createObjectURL(pdfBlob);
  
      // Set the Blob URL to the state instead of downloading
      setSelectedFile(pdfUrl); // Set the URL to your desired state
      setPdfFile(pdfBlob)
  
    } catch (error) {
      console.error('Error converting image to PDF:', error);
      // Optionally handle errors by displaying to the user
    } finally {
      // Reset loading state
    //   setIsLoading(false);
    }
  };
  
  const submitDimentions = async () => {
    if (!rectangle) return;
    setPdfDimentions(rectangle);
    setShowForm(true)
    
  };

  useEffect(() => {

    if (certificateUrl) {
      // Convert the S3 image URL to a PDF and display it
      convertImageToPdf(certificateUrl);
    }
  }, [certificateUrl]);

  return (
    <div>
      {showForm ?
        <DynamicQrForm rectangle={rectangle}/>
        :
      <div className='display-wrapper hide-scrollbar bg-white py-4'>
        <DisplayPdf file={selectedFile} scale={1} toggleLock={toggleLock} isLocked={isLocked} setRectangle={setRectangle} rectangle={rectangle} />
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
          <Button label={isLocked ? 'Unlock QR Code Location' : 'Lock QR Code Location'} className='golden' onClick={toggleLock} />
        </div>
        <div className='text-end mt-3'>
       <Button label='Submit' className='golden ' onClick={submitDimentions} disabled={!isLocked } />
  </div>
      </div>
      }

    </div>
  );
};

export default SelectQrPdf;
