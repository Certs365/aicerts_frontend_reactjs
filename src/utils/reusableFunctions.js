import CryptoJS from 'crypto-js';
import { PDFDocument } from 'pdf-lib';
// Debounced function to fetch suggestions
const secretKey = process.env.NEXT_PUBLIC_BASE_ENCRYPTION_KEY;
  // @ts-ignore: Implicit any for children prop
   const encryptData = (data) => {
  // @ts-ignore: Implicit any for children prop
    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
    return encrypted;
};
  // @ts-ignore: Implicit any for children prop
  const createPdfFromImage = async (imageUrl) => {
    try {
      // Fetch the image data
      const imageResponse = await fetch(imageUrl);
      if (!imageResponse.ok) {
        throw new Error(`Failed to fetch image: ${imageResponse.statusText}`);
      }
      const imageArrayBuffer = await imageResponse.arrayBuffer();
      
      // Create a new PDF document
      const pdfDoc = await PDFDocument.create();
      
      // Embed the image into the PDF document
      const image = await pdfDoc.embedPng(imageArrayBuffer); 
      const page = pdfDoc.addPage([image.width, image.height]);
      
      // Draw the image on the page
      page.drawImage(image, {
        x: 0,
        y: 0,
        width: image.width,
        height: image.height,
      });
  
      // Serialize the PDFDocument to bytes (Uint8Array)
      const pdfBytes = await pdfDoc.save();
      
      // Create a Blob URL for the PDF
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      return {url: URL.createObjectURL(blob), height:image.height, width:image.width};
  
    } catch (error) {
      console.error("Error creating PDF from image:", error);
      return null;
    }
  };
  
export {encryptData, createPdfFromImage}