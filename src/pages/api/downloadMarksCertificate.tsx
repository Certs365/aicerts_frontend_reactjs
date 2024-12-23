import { NextApiRequest, NextApiResponse } from 'next';
const puppeteer = require('puppeteer');

interface CertificateData {
  certificateNumber: string;
  name: string;
  course: string;
  grantDate: string;
  expirationDate: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { data } = req.body;

    if (!data) {
      return res.status(400).json({ error: 'Certificate data not available.' });
    }

    const subjects = data?.studentData?.Subjects;
    const semesterRecords = data?.studentData?.SemesterRecords || [];
    console.log(data)
    // Destructure subjects and create an array of objects with subjectName and other details
    const subjectArray = subjects
      ? Object.entries(subjects).map(([subjectName, subjectData]) => ({
        subjectName,
        ...subjectData,
      }))
      : [];

    console.log(subjectArray);

    // Generate HTML content for the subject rows using `.map()`
    const subjectRows = subjectArray.map((subject, index) => `
      <tr key="${index}">
        <td>${index + 1}</td>
        <td>${subject.subjectName}</td>
        <td>${subject.Max || 'N/A'}</td>
        <td>${subject.MinMarks || 'N/A'}</td>
        <td>${subject.ObtainedMarks || 'N/A'}</td>
        <td>${subject.ObtainedMarks || 'N/A'}</td>
        <td>${subject.Grade || 'N/A'}</td>
        <td>${subject.CP || 'N/A'}</td>
        <td>${subject.Credit || 'N/A'}</td>
        <td>${subject.CP || 'N/A'}</td>
      </tr>
    `).join(''); // `.join('')` converts the array into a single string

    // Generate HTML content for the semester records section using `.map()`
    const semesterRows = semesterRecords.map(semester => `
      <tr class="no-row-borders">
        <td colspan="2">${semester.Semester}</td>
        <td colspan="2">${semester.Credit}</td>
        <td>${semester.GP}</td>
        <td>${semester.SGPA}</td>
        <td>${semester.CGPA}</td>
        <td>${semester.MaxMarks}</td>
        <td>${semester.ObtainedMarks}</td>
        <td>${semester.Percentage}</td>
      </tr>
    `).join('');

    const htmlContent = `
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>JG University Marks Statement</title>
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Sofia&family=Sofia+Sans:ital,wght@0,1..1000;1,1..1000&display=swap" rel="stylesheet">
          <style>
            body {
              margin: 0;
              padding: 0;
              font-family: "Sofia", serif;
              width: 100%;
              min-height: 100vh;
              display: flex;
              color: #221E20;
              justify-content: center;
              align-items: center;
            }
            .content {
              position: relative;
              width: 595px;
              min-height: 100vh;
              background: url('https://certs365-live.s3.amazonaws.com/uploads/01_JG%20University.png') no-repeat center center;
              background-size: cover;
              padding: 170px 40px 0 40px;
              box-sizing: border-box;
            }
            .table-container {
              width: 100%;
              border-collapse: collapse;
            }
            .table-container th,
            .table-container td {
              border: 1px solid #C32026;
              padding: 5px 4px;
              font-size: 10px;
              font-family: "Sofia Sans Condensed";
            }
            .table-header {
              background-color: #C32026;
              color: white;
              font-weight: bold;
            }
            .footer {
              font-family: "Inter", serif;
              text-align: center;
              font-size: 10px;
              font-weight: 500;
              letter-spacing: 0.3px;
              display: flex;
              flex-direction: row;
              justify-content: space-between;
              margin-top: 30px;
              font-size: 12px;
              left: 50px;
              right: 50px;
            }

        .sub-header th {
          line-height: 1;
          /* Reduce height by adjusting line spacing */
          padding: 2px;
          /* Minimal padding */
          border: none;
          /* Remove borders for a seamless look */
      }

      /* Main header row styling */
      .table-header-primary {
          text-align: center;
          vertical-align: middle;
          /* Align text properly */
          background-color: #fff;
          color: #000;
          font-size: 12px;
          font-family: "Inter", serif;
          font-weight: 600;
          border: 1px solid #C32026;
          /* Border only for primary headers */
      }

      .table-header-secondary {
          text-align: center;
          font-size: 10px;
          color: #000;
          border: none;
          /* Remove border for sub-headers */
          font-family: "Inter", serif;
          background-color: transparent;
          /* Seamless with the row above */
      }

      .no-row-borders td {
          border-top: none;
          /* Remove the top border */
          border-bottom: none;
          /* Remove the bottom border */
      }

      .no-row-borders:last-child td {
          border-top: none;
          border-bottom: 1px solid #C32026;
          /* Remove only the top border of the last row */
      }
          </style>
        </head>
        <body>
        
          <div class="content">
           <div style="
            position: absolute;
            right: 40px;
            top: 75px;
          ">
    <img 
        src="${data.qrData}" 
        alt="QR info" 
        style="width: 70px; height: 70px;" 
    />
  </div> 
            <table class="table-container">
              <!-- Student's Details Section -->
              <tr>
                <th colspan="10" class="table-header">STUDENT'S DETAIL</th>
              </tr>
              <tr>
                <td colspan="5">Name: <strong>${data.studentData?.Name}</strong></td>
                <td colspan="5">Enrollment No: <strong>${data.studentData?.EnrollmentNo}</strong></td>
              </tr>
              <tr>
                <td colspan="5">Programme: <strong>${data.studentData?.Programme}</strong></td>
                <td colspan="5">Semester: <strong>${data.studentData?.Semester}</strong></td>
              </tr>
              <tr>
                <td colspan="5">School: <strong>${data.studentData?.School}</strong></td>
                <td colspan="5">Examination: <strong>${data.studentData?.Examination}</strong></td>
              </tr>
              <tr>
                <th colspan="10" class="table-header-white">STATEMENT OF MARKS AND GRADES</th>
              </tr>
              <!-- Subjects Section -->
              <tr>
                <th rowspan="2" class="table-header-primary">No.</th>
                <th rowspan="2" class="table-header-primary">Subject Name</th>
                <th style="border-bottom:none;" colspan="3" class="table-header-primary">Internal / External Evaluation</th>
                <th rowspan="2" class="table-header-primary">Total</th>
                <th rowspan="2" class="table-header-primary">Grade</th>
                <th rowspan="2" class="table-header-primary">GP</th>
                <th rowspan="2" class="table-header-primary">Credit</th>
                <th rowspan="2" class="table-header-primary">CP</th>
              </tr>
              <tr class="sub-header">
                <th class="table-header-secondary">Max.</th>
                <th class="table-header-secondary">Min.</th>
                <th class="table-header-secondary">Obt.</th>
              </tr>
              ${subjectRows} <!-- Insert the subject rows here -->
              <!-- Semester Records Section -->
              <tr class="header">
                <td colspan="10"></td>
              </tr>
              <tr class="header no-row-borders1">
                <td class="table-header-primary" colspan="2">Semester</td>
                <td class="table-header-primary" colspan="2">Credit</td>
                <td class="table-header-primary" colspan="1">GP</td>
                <td class="table-header-primary" colspan="1">SGPA</td>
                <td class="table-header-primary" colspan="1">CGPA</td>
                <td class="table-header-primary" colspan="1">Max Marks</td>
                <td class="table-header-primary" colspan="1">Obtained Marks</td>
                <td class="table-header-primary" colspan="1">Percentage</td>
              </tr>
              ${semesterRows} <!-- Insert the semester rows here -->
              <!-- Summary Section -->
              <tr >
                <td colspan="2">Result: <strong>${data.studentData?.Result}</strong></td>
                <td colspan="3"></td>
                <td colspan="1">Total: <strong>${data?.studentData?.TotalMarks}</strong></td>
                <td colspan="1"></td>
                <td colspan="1">TGP: <strong>${data?.studentData?.TGP}</strong></td>
                <td colspan="1">TCr: <strong>${data?.studentData?.TCr}</strong></td>
                <td colspan="1">TCP: <strong>${data?.studentData?.TCP}</strong></td>
              </tr>
            </table>
            <div class="footer">
              <p>Date of Issue: </p>
              <p style="width: 210px;">Note: No change in any entry is to be made except by the authority issuing the certificate and that the infringement of the rule will be severely dealt with</p>
              <p>Registrar (I/C)</p>
            </div>
          </div>
        </body>
      </html>
    `;

    try {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      
      await page.setViewport({
          width: 722, // Double the original dimensions
          height: 893,
          deviceScaleFactor: 6 // Simulates a high-DPI screen
      });
      
      await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
      
      const screenshotBuffer = await page.screenshot({
          type: 'png' // PNG is already lossless, so no quality setting needed
      });
      
      await browser.close();
      
      res.setHeader('Content-Type', 'image/png');
      res.setHeader('Content-Disposition', 'attachment; filename=output.png');
      res.send(screenshotBuffer);
      
    } catch (error) {
      console.error('Error generating image:', error);
      res.status(500).json({ error: 'Image generation failed' });
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
