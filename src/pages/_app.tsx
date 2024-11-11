import 'bootstrap/dist/css/bootstrap.min.css';
import "../../assets/css/styles.scss";
import 'react-datepicker/dist/react-datepicker.css';
import React, { useEffect, useState } from 'react';
import { AppProps } from 'next/app';
import Navigation from '../app/navigation';
import { useRouter } from 'next/router';
import CertificateContext from "../utils/CertificateContext"
import Head from 'next/head';

import { getAuth } from 'firebase/auth';
// @ts-ignore: Implicit any for children prop
import { app } from "../config/firebaseConfig"
const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  const [badgeUrl, setBadgeUrl] = useState("")
  const [logoUrl, setLogoUrl] = useState("")
  const [signatureUrl, setSignatureUrl] = useState("")
  const [issuerName, setIssuerName] = useState("")
  const [issuerDesignation, setissuerDesignation] = useState("")
  const [tab, setTab] = useState("")
  const [selectedCard, setSelectedCard] = useState(0);
  const [certificatesData, setCertificatesData] = useState({});
  const [certificateUrl, setCertificateUrl] = useState("https://html.aicerts.io/Background123.png")
  const [isDesign, setIsDesign] = useState(false)
  const [pdfDimentions, setPdfDimentions] = useState({})
  const [pdfFile, setPdfFile] = useState(null)
  const [pdfBatchDimentions, setPdfBatchDimentions] = useState<{}>({});
  const router = useRouter();
  const isLoginPage = router.pathname === '/' || router.pathname === '/register'|| router.pathname === '/forgot-passwords' ||  router.pathname === '/passwords-confirm' ;
  // @ts-ignore: Implicit any for children prop
  const auth = getAuth(app)

  
  
  return (
    // @ts-ignore: Implicit any for children prop
    <CertificateContext.Provider value={{badgeUrl, logoUrl, signatureUrl,certificateUrl,tab,selectedCard, issuerName, issuerDesignation,certificatesData,isDesign,pdfDimentions,pdfFile,pdfBatchDimentions, setBadgeUrl:setBadgeUrl,setSignatureUrl:setSignatureUrl, setLogoUrl:setLogoUrl, setCertificateUrl:setCertificateUrl,setTab:setTab,setSelectedCard:setSelectedCard, setIssuerName:setIssuerName, setissuerDesignation:setissuerDesignation,setCertificatesData:setCertificatesData,setIsDesign:setIsDesign,setPdfBatchDimentions:setPdfBatchDimentions, setPdfDimentions:setPdfDimentions,setPdfFile}}>
     <Head>
    <title>Certs365 Blockchain Issuance: Secure, Fast, and Reliable</title>
    <meta name="description" content="Blockchain-based issuance is revolutionizing asset management. Explore its benefits and potential in enhancing transparency and security." />

    {/* Favicon */}
    <link rel="icon" href="https://images.netcomlearning.com/ai-certs/favIcon.svg" />

    {/* Open Graph Meta Tags */}
    <meta property="og:title" content="Certs365 Blockchain Issuance: Secure, Fast, and Reliable" />
    <meta property="og:description" content="Blockchain-based issuance is revolutionizing asset management. Explore its benefits and potential in enhancing transparency and security." />
  
    {/* Twitter Meta Tags */}
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="Certs365 Blockchain Issuance: Secure, Fast, and Reliable" />
    <meta name="twitter:description" content="Blockchain-based issuance is revolutionizing asset management. Explore its benefits and potential in enhancing transparency and security." />

   
</Head>

      {!isLoginPage && <Navigation />}
      <Component {...pageProps} router={router} />
    </CertificateContext.Provider>
  );
};

export default App;
