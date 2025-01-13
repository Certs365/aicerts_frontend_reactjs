// @ts-nocheck

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

  const reduceImageResolution = async (imageUrl, scalingFactor = 4) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous'; // Handle cross-origin if needed
      img.src = imageUrl;
  
      img.onload = () => {
        // Create an off-screen canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
  
        // Set canvas dimensions to 1X
        canvas.width = img.naturalWidth / scalingFactor;
        canvas.height = img.naturalHeight / scalingFactor;
  
        // Draw the image onto the canvas with scaled dimensions
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  
        // Convert the canvas content to a data URL
        const resizedImageUrl = canvas.toDataURL('image/png'); // Use desired format
        resolve(resizedImageUrl);
      };
  
      img.onerror = (error) => reject(error);
    });
  };
  
  
export {encryptData, createPdfFromImage,reduceImageResolution}