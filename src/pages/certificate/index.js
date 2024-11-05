// pages/select-certificate.js
import React, { useState, useEffect, useRef } from "react";
import Button from "../../../shared/button/button";
import {
  Container,
  Row,
  Col,
  Card,
  Tooltip,
  OverlayTrigger,
  Modal,
  Form,
  InputGroup,
  ProgressBar,
} from "react-bootstrap";
import { useRouter } from "next/router"; // Import useRouter hook for navigation
import Image from "next/legacy/image";
import { useContext } from "react";
import { AiOutlineClose, AiOutlineCheckCircle } from "react-icons/ai";
import CertificateContext from "../../utils/CertificateContext";
import AWS from "../../config/aws-config";
import { getImageSize } from "react-image-size";
import { IndexOutOfBoundsError } from "pdf-lib";
import { useTheme } from '../../context/ThemeContext';

const iconUrl = process.env.NEXT_PUBLIC_BASE_ICON_URL;
// import image from "public/images/1709909965183_Badge.png"
const apiUrl = process.env.NEXT_PUBLIC_BASE_URL_admin;
const apiUrl_admin = process.env.NEXT_PUBLIC_BASE_URL_USER;
const CardSelector = () => {
  const { isDarkMode } = useTheme();
  const router = useRouter(); // Initialize useRouter hook
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const [now, setNow] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loginSuccess, setLoginSuccess] = useState("");
  const [showTooltip, setShowTooltip] = useState(false);
  const target = useRef(null);
  const [imageUrl, setImageUrl] = useState("");
  const [token, setToken] = useState(null);
  const [tab, setTab] = useState(null);

  const [badgeFile, setBadgeFile] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [signatureFile, setSignatureFile] = useState(null);

  const [badgeFileName, setBadgeFileName] = useState("");
  const [logoFileName, setLogoFileName] = useState("");
  const [signatureFileName, setSignatureFileName] = useState("");
  const [newTemplate, setNewTemplate] = useState("")
  const [designCerts, setDesignCerts] = useState([])

  const {
    setCertificateUrl,
    certificateUrl,
    badgeUrl,
    setBadgeUrl,
    logoUrl,
    issuerName,
    issuerDesignation,
    setLogoUrl,
    signatureUrl,
    setSignatureUrl,
    setSelectedCard,
    selectedCard,
    setIssuerName,
    setissuerDesignation,
    setIsDesign,
    isDesign
  } = useContext(CertificateContext);

  useEffect(() => {
    // Check if the token is available in localStorage
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const { tab } = router.query;

    setTab(tab);
    if (storedUser && storedUser.JWTToken) {
      // If token is available, set it in the state
      setToken(storedUser.JWTToken);
    } else {
      // If token is not available, redirect to the login page
      router.push("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query]);

  // let newTemplate = "";
  useEffect(() => {
    // Function to retrieve data from session storage and set local stat
    sessionStorage.removeItem("certificatesList");
    const retrieveDataFromSessionStorage = () => {
      const badgeUrlFromStorage = JSON.parse(
        sessionStorage.getItem("badgeUrl")
      );
      const logoUrlFromStorage = JSON.parse(sessionStorage.getItem("logoUrl"));
      const signatureUrlFromStorage = JSON.parse(
        sessionStorage.getItem("signatureUrl")
      );
      const issuerNameFromStorage = sessionStorage.getItem("issuerName");
      const issuerDesignationFromStorage =
        sessionStorage.getItem("issuerDesignation");


      if (badgeUrlFromStorage) {
        setBadgeUrl(badgeUrlFromStorage.url);
        setBadgeFileName(badgeUrlFromStorage.fileName);
      }
      if (logoUrlFromStorage) {
        setLogoUrl(logoUrlFromStorage.url);
        setLogoFileName(logoUrlFromStorage.fileName);
      }
      if (signatureUrlFromStorage) {
        setSignatureUrl(signatureUrlFromStorage.url);
        setSignatureFileName(signatureUrlFromStorage.fileName);
      }
      if (issuerNameFromStorage) {
        setIssuerName(issuerNameFromStorage);
      }
      if (issuerDesignationFromStorage) {
        setissuerDesignation(issuerDesignationFromStorage);
      }
    };

 
    retrieveDataFromSessionStorage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleIssuerNameChange = (e) => {
    const inputValue = e.target.value;
    // Validation for preventing space at the start
    if (inputValue.startsWith(" ")) {
      return; // Do nothing if there's a space at the start
    }

    // Validation for disallowing special characters using regex
    if (!/^[a-zA-Z0-9\s]*$/.test(inputValue)) {
      return; // Do nothing if the value contains special characters
    }

    // Validation for disallowing numbers
    if (/\d/.test(inputValue)) {
      return; // Do nothing if the value contains numbers
    }

    // Other validations such as length checks
    if (inputValue.length > 30) {
      return; // Do nothing if the length exceeds 30 characters
    }

    // If all validations pass, update the state and sessionStorage
    setIssuerName(inputValue);
    sessionStorage.setItem("issuerName", inputValue);
    // if (inputValue.length <= 30) {
    //   setIssuerName(inputValue);
    //   sessionStorage.setItem('issuerName', inputValue);
    // } else {
    //   // Show error message here, for example:
    //   // alert('Issuer name must be 30 characters or less');
    // }
  };

  const handleIssuerDesignationChange = (e) => {
    const inputValue = e.target.value;
    // Validation for preventing space at the start
    if (inputValue.startsWith(" ")) {
      return; // Do nothing if there's a space at the start
    }
    if (inputValue.length <= 30) {
      setissuerDesignation(inputValue);
      sessionStorage.setItem("issuerDesignation", inputValue);
    } else {
      // Show error message here, for example:
      // alert("Issuer designation must be 30 characters or less");
    }
  };

  const handleClose = () => {
    setShow(false);
    setLoginError("");
  };

  const hasErrors = () => {
    const errorFields = Object.values(errors);
    return errorFields.some((error) => error !== "");
  };

  const fileInputRefs = {
    badge: useRef(),
    logo: useRef(),
    signature: useRef(),
  };

  const handleChange = async (event, fileType) => {
    const file = event.target.files[0];

    if (!file) return; // Ensure a file is selected

    try {
      const { width, height } = await getImageSize(URL.createObjectURL(file));
      const fileSize = file.size; // File size in bytes

      let maxWidth, maxHeight, minSize, maxSize;

      switch (fileType) {
        case "badge":
          maxWidth = 175;
          maxHeight = 175;
          minSize = 10 * 1024; // 10 KB
          maxSize = 30 * 1024; // 30 KB
          break;
        case "logo":
          maxWidth = 400;
          maxHeight = 65;
          minSize = 5 * 1024; // 5 KB
          maxSize = 30 * 1024; // 30 KB
          break;
        case "signature":
          maxWidth = 220;
          maxHeight = 65;
          minSize = 5 * 1024; // 5 KB
          maxSize = 30 * 1024; // 30 KB
          break;
        default:
          maxWidth = null;
          maxHeight = null;
          minSize = null;
          maxSize = null;
      }

      if (fileSize < minSize || fileSize > maxSize) {
        setLoginError(
          `File size for ${fileType} must be between ${minSize / 1024}KB and ${maxSize / 1024
          }KB.`
        );
        setShow(true);
        // Clear the input field
        event.target.value = "";
        return;
      }

      if (maxWidth && maxHeight && (width > maxWidth || height > maxHeight)) {
        setLoginError(
          `Invalid dimensions for ${fileType}. Maximum dimensions are ${maxWidth}x${maxHeight}.`
        );
        setShow(true);
        // Clear the input field
        event.target.value = "";
        return;
      }

      // If dimensions and file size are valid, proceed to set the file
      switch (fileType) {
        case "badge":
          setBadgeFile(file);
          break;
        case "logo":
          setLogoFile(file);
          break;
        case "signature":
          setSignatureFile(file);
          break;
        default:
          break;
      }
    } catch (error) {
      console.error(error);
      // Handle error fetching image size
      setLoginError("Please upload a correct image file.");
      setShow(true);
    }
  };

  // const handleClick = async () => {
  //   if (!selectedFile) {
  //     console.error('No file selected.');
  //     return;
  //   }

  //   const formData = new FormData();
  //   formData.append('file', selectedFile);

  //   try {
  //     const response = await fetch('/api/upload', {
  //       method: 'POST',
  //       body: formData,
  //     });

  //     if (response.ok) {
  //       const data = await response.json();

  //       // Save the image reference as needed in your application state or database
  //     } else {
  //       console.error('Failed to upload image:', response.statusText);
  //     }
  //   } catch (error) {
  //     console.error('Error uploading image:', error);
  //   }
  // };

  const generatePresignedUrl = async (key) => {
    const s3 = new AWS.S3();
    const params = {
      Bucket: "certs365",
      Key: key,
      Expires: 36000,
    };

    try {
      const url = await s3.getSignedUrlPromise("getObject", params);
      return url;
    } catch (error) {
      console.error("Error generating pre-signed URL:", error);
      return null;
    }
  };

  const removeFile = (fileType) => {
    switch (fileType) {
      case "badge":
        sessionStorage.removeItem("badgeUrl");
        setBadgeFile(null);
        setBadgeUrl("");
        setBadgeFileName("");
        break;
      case "logo":
        sessionStorage.removeItem("logoUrl");
        setLogoFile(null);
        setLogoUrl("");
        setLogoFileName("");
        break;
      case "signature":
        sessionStorage.removeItem("signatureUrl");
        setSignatureFile(null);
        setSignatureUrl("");
        setSignatureFileName("");
        break;
      default:
        break;
    }
    // fileInputRefs[fileType].current.value = null;
  };

  const uploadFile = async (fileType) => {
    let selectedFile = null;

    switch (fileType) {
      case "badge":
        selectedFile = badgeFile;
        break;
      case "logo":
        selectedFile = logoFile;
        break;
      case "signature":
        selectedFile = signatureFile;
        break;
      default:
        console.error("Invalid file type:", fileType);
        return;
    }

    if (!selectedFile) {
      setLoginError("No file selected.");
      setShow(true);
      console.error("No file selected.");
      return;
    }

    // Check file type
    const allowedTypes = ["image/jpeg", "image/png", "image/svg+xml"];
    if (!allowedTypes.includes(selectedFile.type)) {
      setLoginError(
        "Invalid file type. Please upload a JPG, PNG, or SVG file."
      );
      setShow(true);
      console.error(
        "Invalid file type. Please upload a JPG, PNG, or SVG file."
      );
      return;
    }

    setIsLoading(true);
    setNow(10);

    // Check file size
    const maxSize = 170 * 170; // Adjust the size limit as needed
    // if (selectedFile.size > maxSize) {
    //   setLoginError('File size exceeds the allowed limit.');
    //   setShow(true);
    //   console.error('File size exceeds the allowed limit.');
    //   return;
    // }

    if (selectedFile.size > maxSize) {
      setLoginError("File dimension exceeds the allowed limit.");
      setShow(true);
      console.error("File dimension exceeds the allowed limit.");
      setIsLoading(false);
      setNow(100);
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    let progressInterval;
    const startProgress = () => {
      progressInterval = setInterval(() => {
        setNow((prev) => {
          if (prev < 90) return prev + 5;
          return prev;
        });
      }, 100);
    };

    const stopProgress = () => {
      clearInterval(progressInterval);
      setNow(100); // Progress complete
    };

    startProgress();

    try {
      const response = await fetch(`${apiUrl}/api/upload`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();

        if (data.status === "SUCCESS") {
          switch (fileType) {
            case "badge":
              generatePresignedUrl(selectedFile?.name)
                .then((url) => {
                  setBadgeUrl(url || null);
                  setBadgeFileName(selectedFile?.name);
                  sessionStorage.setItem(
                    "badgeUrl",
                    JSON.stringify({ fileName: selectedFile?.name, url: url })
                  );
                  setLoginError("");
                  setLoginSuccess("Badge uploaded successfully");
                  setShow(true);
                })
                .catch((error) => {
                  console.error("Error generating pre-signed URL:", error);
                  setLoginError("Failed to generate pre-signed URL for badge");
                });
              break;
            case "logo":
              generatePresignedUrl(selectedFile?.name)
                .then((url) => {
                  setLogoUrl(url || null);
                  setLogoFileName(selectedFile?.name);
                  sessionStorage.setItem(
                    "logoUrl",
                    JSON.stringify({ fileName: selectedFile?.name, url: url })
                  );
                  setLoginError("");
                  setLoginSuccess("Logo uploaded successfully");
                  setShow(true);
                })
                .catch((error) => {
                  console.error("Error generating pre-signed URL:", error);
                  setLoginError("Failed to generate pre-signed URL for logo");
                });
              break;
            case "signature":
              generatePresignedUrl(selectedFile?.name)
                .then((url) => {
                  setSignatureUrl(url || null);
                  setSignatureFileName(selectedFile?.name);
                  sessionStorage.setItem(
                    "signatureUrl",
                    JSON.stringify({ fileName: selectedFile?.name, url: url })
                  );
                  setLoginError("");
                  setLoginSuccess("Signature uploaded successfully");
                  setShow(true);
                })
                .catch((error) => {
                  console.error("Error generating pre-signed URL:", error);
                  setLoginError(
                    "Failed to generate pre-signed URL for signature"
                  );
                });
              break;
            default:
              break;
          }

          setIsLoading(false);
          // Save the image reference as needed in your application state or database
        } else {
          setLoginError(
            "Error in Uploading " +
            fileType.charAt(0).toUpperCase() +
            fileType.slice(1)
          );
          setShow(true);
          setIsLoading(false);
        }
      } else {
        setLoginError(
          "Failed to upload " +
          fileType.charAt(0).toUpperCase() +
          fileType.slice(1)
        );
        setShow(true);
        setIsLoading(false);
        console.error("Failed to upload image:", response.statusText);
      }
    } catch (error) {
      setLoginError(
        "Failed to upload " +
        fileType.charAt(0).toUpperCase() +
        fileType.slice(1)
      );
      setIsLoading(false);
      setShow(true);
      console.error("Error uploading image:", error);
    } finally {
      stopProgress();
      setIsLoading(false);
    }
  };

  const handleDesignCardSelect = (url) => {
    setCertificateUrl(url);
    setIsDesign(true)
  }
  const handleCardSelect = (cardIndex) => {
    setSelectedCard(cardIndex);
    let certificateUrl;
    switch (cardIndex) {
      case 0:
        certificateUrl = "https://html.aicerts.io/Background123.png";
        break;
      case 1:
        certificateUrl = "https://html.aicerts.io/Background111.png";
        break;

      case 2:
        certificateUrl = "https://html.aicerts.io/Background_2.png";
        break;

      case 3:
        certificateUrl =
          "https://html.aicerts.io/Blank%20Certificate_%2304.png";
        break;
      case 4:
        certificateUrl = "https://html.aicerts.io/Background233.png";
        break;
      case 5:
        certificateUrl = "https://html.aicerts.io/Background.png";
        break;

      default:
        certificateUrl = "https://html.aicerts.io/Background123.png";
        break;
    }
    setCertificateUrl(certificateUrl);
    setIsDesign(false)
  };

  const handleSelectTemplate = () => {
    if (!isDesign) {

      if (!logoUrl) {
        setLoginError("Please upload the logo ");
        setShow(true);
        return;
      }

      if (!certificateUrl) {
        setLoginError("Please upload the certificate ");
        setShow(true);
        return;
      }

      if (!signatureUrl) {
        setLoginError("Please upload the signature");
        setShow(true);
        return;
      }

      if (!issuerName.trim()) {
        setLoginError("Issuer Name cannot be empty");
        setShow(true);
        return;
      } else if (issuerName.trim().length === 1) {
        setLoginError("Issuer Name should contain more than one character");
        setShow(true);
        return;
      }

      if (!issuerDesignation.trim()) {
        setLoginError("Issuer Designation cannot be empty");
        setShow(true);
        return;
      } else if (issuerDesignation.trim().length === 1) {
        setLoginError(
          "Issuer Designation should contain more than one character"
        );
        setShow(true);
        return;
      }
    }
  }
  if (tab == 1 && !isDesign) {
    router.push(`/certificate/${selectedCard}`);
  } else if (tab == 0 && isDesign) {
    // Sending route with state
    router.push({
      pathname: '/selectQrPdf', // Example route
      query: { certificateUrl },         // You can pass any other state you need here
    });
  } else {
    router.push(`/issue-certificate`);
  }

  const customTemplate = () => {
    // remove any previos customTemplate
    sessionStorage.getItem('customTemplate') && sessionStorage.removeItem('customTemplate');
    sessionStorage.setItem('tab', tab);
    const newTab = window.open('', '_blank');
    newTab.location.href = '/templates.html';
  };

  const cards = [
    {
      id: 1,
      imageUrl:
        "https://images.netcomlearning.com/ai-certs/Certificate_template_1.png",
    },
    {
      id: 2,
      imageUrl:
        "https://images.netcomlearning.com/ai-certs/Certificate_template_2.png",
    },
    {
      id: 3,
      imageUrl:
        "https://images.netcomlearning.com/ai-certs/Certificate_template_3.png",
    },
    {
      id: 4,
      imageUrl: "/backgrounds/Certificate_template_4.png",
    },
    {
      id: 5,
      imageUrl: "/backgrounds/Certificate_template_6.png",
    },
    {
      id: 6,
      imageUrl: "/backgrounds/Certificate_template_5.png",
    },
  ];

  useEffect(() => {
    const fetchTemplates = async () => {
      var storedUser = JSON.parse(localStorage.getItem("user") ?? "null");
      var userEmail;

      if (storedUser && storedUser.JWTToken) {
        userEmail = storedUser.email.toLowerCase();
      }

      // Fetch the templates from the API
      try {
        const response = await fetch(
          `${apiUrl_admin}/api/get-certificate-templates`,
          {
            method: "POST",
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: userEmail,
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          setDesignCerts(data?.data); // Assuming `setDesignCerts` updates state
        } else {
          console.error("Error fetching template: Response not ok");
        }
      } catch (error) {
        console.error("Error fetching template:", error);
      }
    };

    fetchTemplates();
  }, []);

  useEffect(() => {
    // Select the first card onLoad
    const customTemplateFromStorage = sessionStorage.getItem("customTemplate");
    if (customTemplateFromStorage) {
      console.log(customTemplateFromStorage);  //clg
      setNewTemplate(customTemplateFromStorage);  //for preview
      setCertificateUrl(customTemplateFromStorage);
      setIsDesign(true)
      // setCertificateUrl(customTemplateFromStorage); // for later, in issue-certification, next part
    } else {
      handleCardSelect(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array means it runs only once after the component is mounted

  const InfoIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
    >
      <path
        d="M7 5.6C6.82694 5.6 6.65777 5.54868 6.51388 5.45254C6.36999 5.35639 6.25783 5.21974 6.19161 5.05985C6.12538 4.89997 6.10805 4.72403 6.14182 4.5543C6.17558 4.38457 6.25891 4.22865 6.38128 4.10628C6.50365 3.98391 6.65956 3.90058 6.8293 3.86682C6.99903 3.83305 7.17496 3.85038 7.33485 3.91661C7.49474 3.98283 7.63139 4.09499 7.72754 4.23888C7.82368 4.38277 7.875 4.55194 7.875 4.725C7.875 4.95707 7.78281 5.17963 7.61872 5.34372C7.45463 5.50782 7.23207 5.6 7 5.6ZM7 6.65C7.18565 6.65 7.3637 6.72375 7.49498 6.85503C7.62625 6.9863 7.7 7.16435 7.7 7.35V9.45C7.7 9.63565 7.62625 9.8137 7.49498 9.94498C7.3637 10.0763 7.18565 10.15 7 10.15C6.81435 10.15 6.6363 10.0763 6.50503 9.94498C6.37375 9.8137 6.3 9.63565 6.3 9.45V7.35C6.3 7.16435 6.37375 6.9863 6.50503 6.85503C6.6363 6.72375 6.81435 6.65 7 6.65ZM7 14C5.61553 14 4.26215 13.5895 3.11101 12.8203C1.95987 12.0511 1.06266 10.9579 0.532846 9.67879C0.00303299 8.3997 -0.13559 6.99224 0.134506 5.63437C0.404603 4.2765 1.07129 3.02922 2.05026 2.05026C3.02922 1.07129 4.2765 0.404603 5.63437 0.134506C6.99224 -0.135591 8.3997 0.00303268 9.67879 0.532846C10.9579 1.06266 12.0511 1.95987 12.8203 3.11101C13.5895 4.26216 14 5.61553 14 7C13.998 8.85589 13.2598 10.6352 11.9475 11.9475C10.6352 13.2598 8.85589 13.998 7 14ZM7 1.4C5.89243 1.4 4.80972 1.72844 3.88881 2.34377C2.96789 2.95911 2.25013 3.83371 1.82628 4.85698C1.40243 5.88024 1.29153 7.00621 1.50761 8.09251C1.72368 9.1788 2.25703 10.1766 3.0402 10.9598C3.82338 11.743 4.8212 12.2763 5.9075 12.4924C6.99379 12.7085 8.11976 12.5976 9.14303 12.1737C10.1663 11.7499 11.0409 11.0321 11.6562 10.1112C12.2716 9.19028 12.6 8.10758 12.6 7C12.5981 5.51536 12.0076 4.09205 10.9578 3.04225C9.90795 1.99245 8.48465 1.40186 7 1.4Z"
        fill="#5B5A5F"
      />
    </svg>
  );

  const InfoIconDark = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M7 5.6C6.82694 5.6 6.65777 5.54868 6.51388 5.45254C6.36999 5.35639 6.25783 5.21974 6.19161 5.05985C6.12538 4.89997 6.10805 4.72403 6.14182 4.5543C6.17558 4.38457 6.25891 4.22865 6.38128 4.10628C6.50365 3.98391 6.65956 3.90058 6.8293 3.86682C6.99903 3.83305 7.17496 3.85038 7.33485 3.91661C7.49474 3.98283 7.63139 4.09499 7.72754 4.23888C7.82368 4.38277 7.875 4.55194 7.875 4.725C7.875 4.95707 7.78281 5.17963 7.61872 5.34372C7.45463 5.50782 7.23207 5.6 7 5.6ZM7 6.65C7.18565 6.65 7.3637 6.72375 7.49498 6.85503C7.62625 6.9863 7.7 7.16435 7.7 7.35V9.45C7.7 9.63565 7.62625 9.8137 7.49498 9.94498C7.3637 10.0763 7.18565 10.15 7 10.15C6.81435 10.15 6.6363 10.0763 6.50503 9.94498C6.37375 9.8137 6.3 9.63565 6.3 9.45V7.35C6.3 7.16435 6.37375 6.9863 6.50503 6.85503C6.6363 6.72375 6.81435 6.65 7 6.65ZM7 14C5.61553 14 4.26215 13.5895 3.11101 12.8203C1.95987 12.0511 1.06266 10.9579 0.532846 9.67879C0.00303299 8.3997 -0.13559 6.99224 0.134506 5.63437C0.404603 4.2765 1.07129 3.02922 2.05026 2.05026C3.02922 1.07129 4.2765 0.404603 5.63437 0.134506C6.99224 -0.135591 8.3997 0.00303268 9.67879 0.532846C10.9579 1.06266 12.0511 1.95987 12.8203 3.11101C13.5895 4.26216 14 5.61553 14 7C13.998 8.85589 13.2598 10.6352 11.9475 11.9475C10.6352 13.2598 8.85589 13.998 7 14ZM7 1.4C5.89243 1.4 4.80972 1.72844 3.88881 2.34377C2.96789 2.95911 2.25013 3.83371 1.82628 4.85698C1.40243 5.88024 1.29153 7.00621 1.50761 8.09251C1.72368 9.1788 2.25703 10.1766 3.0402 10.9598C3.82338 11.743 4.8212 12.2763 5.9075 12.4924C6.99379 12.7085 8.11976 12.5976 9.14303 12.1737C10.1663 11.7499 11.0409 11.0321 11.6562 10.1112C12.2716 9.19028 12.6 8.10758 12.6 7C12.5981 5.51536 12.0076 4.09205 10.9578 3.04225C9.90795 1.99245 8.48465 1.40186 7 1.4Z" fill="#A9A7B0"/>
    </svg>
  );

  return (
    <>
      <div className="page-bg">
        <div className="position-relative">
          <div className="dashboard mt-5">
            <Container className="pt-5">
              {tab == 0 && <h3 className="title mt-5">Issue Certifications</h3>}
              {tab == 1 && <h3 className="title mt-5">Batch Issuance</h3>}

              <div className="register issue-new-certificate issue-with-pdf">
                <Form className="register-form">
                  <Card>
                    <Card.Body>
                      <Card.Title>Certification Details</Card.Title>
                      <div className="input-elements">
                        <Row className="justify-content-md-center">
                          <Col md={{ span: 6 }} xs={{ span: 12 }}>
                            <Form.Group
                              controlId="name"
                              className="mb-3 mb-md-0"
                            >
                              <Form.Label>
                                Issuer Name{" "}
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <InputGroup>
                                <Form.Control
                                  type="text"
                                  name="name"
                                  value={issuerName}
                                  disabled={isDesign}
                                  onChange={handleIssuerNameChange}
                                  required
                                  maxLength={14} // Limit the input to 30 characters
                                />
                                <InputGroup.Text>
                                  {issuerName.length}/14
                                </InputGroup.Text>{" "}
                                {/* Display character count */}
                              </InputGroup>
                            </Form.Group>
                          </Col>
                          <Col md={{ span: 6 }} xs={{ span: 12 }}>
                            <Form.Group
                              controlId="date-of-issue"
                              className="mb-3 mb-md-0"
                            >
                              <Form.Label>
                                Issuer Designation{" "}
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <InputGroup>
                                <Form.Control
                                  type="text"
                                  name="issuerDesignation"
                                  value={issuerDesignation}
                                  disabled={isDesign}
                                  onChange={handleIssuerDesignationChange}
                                  required
                                  maxLength={20} // Limit the input to 30 characters
                                />
                                <InputGroup.Text>
                                  {issuerDesignation.length}/20
                                </InputGroup.Text>{" "}
                                {/* Display character count */}
                              </InputGroup>
                            </Form.Group>
                          </Col>
                          <Col md={{ span: 4 }} xs={{ span: 12 }} >
                            <div className="upload-badge-container"  >
                              <div className="label" style={{fontSize:"Montserrat"}}>
                                Upload Badge (Optional)
                              </div>
                              <div className="upload-column">
                                {badgeFileName ? (
                                  <div className="file-info">
                                    <span>{badgeFileName} </span>
                                    <AiOutlineClose
                                      onClick={() => removeFile("badge")}
                                      className="close-icon"
                                    />
                                  </div>
                                ) : (
                                  <></>
                                )}
                                {badgeUrl ? (
                                  <AiOutlineCheckCircle className="check-icon" />
                                ) : (
                                  <>
                                    <div className="file-upload ">
                                      <input
                                        type="file"
                                        accept="image/*"
                                        ref={fileInputRefs.badge}
                                        disabled={isDesign}
                                        onChange={(event) =>
                                          handleChange(event, "badge")
                                        }
                                      />
                                    </div>
                                    <Button
                                      label="Upload"
                                      disabled={isDesign}
                                      className="golden-upload d-none d-md-block"
                                      onClick={() => uploadFile("badge")}
                                    />
                                    <Button
                                      label=""
                                      disabled={isDesign}
                                      className="golden-upload m-upload d-block d-md-none"
                                      onClick={() => uploadFile("badge")}
                                    />
                                  </>
                                )}
                              </div>
                              <div className="upload-info">
                                <div className="details">
                                  {isDarkMode ? <InfoIconDark /> : <InfoIcon /> }                                  
                                  <div className="info-text">
                                    <span>Please use .png on</span>
                                  </div>
                                </div>
                                <div className="details">
                                  {isDarkMode ? <InfoIconDark /> : <InfoIcon /> }
                                  <div className="info-text">
                                    Badge dimensions:{" "}
                                    <span>H 175px, W 175px</span>
                                  </div>
                                </div>
                                <div className="details">
                                  {isDarkMode ? <InfoIconDark /> : <InfoIcon /> }
                                  <div className="info-text">
                                    File size: <span>10-30kb</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Col>
                          <Col md={{ span: 4 }} xs={{ span: 12 }}>
                            <div className="upload-badge-container">
                              <div className="label">Upload Logo</div>
                              <div className="upload-column">
                                {logoFileName ? (
                                  <div className="file-info">
                                    <span>{logoFileName}</span>
                                    <AiOutlineClose
                                      onClick={() => removeFile("logo")}
                                      className="close-icon"
                                    />
                                  </div>
                                ) : (
                                  <></>
                                )}
                                {logoUrl ? (
                                  <AiOutlineCheckCircle className="check-icon" />
                                ) : (
                                  <>
                                    <div className="file-upload">
                                      <input
                                        required
                                        type="file"
                                        accept="image/*"
                                        ref={fileInputRefs.logo}
                                        disabled={isDesign}
                                        onChange={(event) =>
                                          handleChange(event, "logo")
                                        }
                                      />
                                    </div>
                                    <Button
                                      label="Upload"
                                      disabled={isDesign}
                                      className="golden-upload d-none d-md-block"
                                      onClick={() => uploadFile("logo")}
                                    />
                                    <Button
                                      label=""
                                      disabled={isDesign}
                                      className="golden-upload m-upload d-block d-md-none"
                                      onClick={() => uploadFile("logo")}
                                    />
                                  </>
                                )}
                                <input
                                  required
                                  type="file"
                                  accept="image/*"
                                  ref={fileInputRefs.logo}
                                  disabled={isDesign}
                                  onChange={(event) =>
                                    handleChange(event, "logo")
                                  }
                                  hidden
                                />
                              </div>
                              <div className="upload-info">
                                <div className="details">
                                  {isDarkMode ? <InfoIconDark /> : <InfoIcon /> }
                                  <div className="info-text">
                                    <span >Please use .png on</span>
                                  </div>
                                </div>
                                <div className="details">
                                  {isDarkMode ? <InfoIconDark /> : <InfoIcon /> }
                                  <div className="info-text">
                                    Logo dimensions:{" "}
                                    <span>H 65px, W 400px</span>
                                  </div>
                                </div>
                                <div className="details">
                                  {isDarkMode ? <InfoIconDark /> : <InfoIcon /> }
                                  <div className="info-text">
                                    File size: <span>5-30kb</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Col>
                          <Col md={{ span: 4 }} xs={{ span: 12 }}>
                            <div className="upload-badge-container">
                              <div className="label">Upload Signature</div>
                              <div className="upload-column">
                                {signatureFileName ? (
                                  <div className="file-info">
                                    <span>{signatureFileName}</span>
                                    <AiOutlineClose
                                      onClick={() => removeFile("signature")}
                                      className="close-icon"
                                    />
                                  </div>
                                ) : (
                                  <></>
                                )}
                                {signatureUrl ? (
                                  <AiOutlineCheckCircle className="check-icon" />
                                ) : (
                                  <>
                                    <div className="file-upload">
                                      <input
                                        type="file"
                                        accept="image/*"
                                        ref={fileInputRefs.signature}
                                        disabled={isDesign}
                                        onChange={(event) =>
                                          handleChange(event, "signature")
                                        }
                                      />
                                    </div>
                                    <Button
                                      label="Upload"
                                      disabled={isDesign}
                                      className="golden-upload d-none d-md-block"
                                      onClick={() => uploadFile("signature")}
                                    />
                                    <Button
                                      label=""
                                      disabled={isDesign}
                                      className="golden-upload m-upload d-block d-md-none"
                                      onClick={() => uploadFile("signature")}
                                    />
                                  </>
                                )}
                              </div>
                              <div className="upload-info">
                                <div className="details">
                                  {isDarkMode ? <InfoIconDark /> : <InfoIcon /> }
                                  <div className="info-text">
                                    <span>Please use .png on</span>
                                  </div>
                                </div>
                                <div className="details">
                                  {isDarkMode ? <InfoIconDark /> : <InfoIcon /> }
                                  <div className="info-text">
                                    Signature dimensions:{" "}
                                    <span>H:65px W:220px</span>
                                  </div>
                                </div>
                                <div className="details">
                                  {isDarkMode ? <InfoIconDark /> : <InfoIcon /> }
                                  <div className="info-text">
                                    File size: <span>5-30kb</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Col>
                        </Row>
                      </div>
                    </Card.Body>
                  </Card>
                </Form>
              </div>
              <Row>
                <Col xs={12} md={6}>
                  <Card className="p-0 template-thumb">
                    <Card.Header>Design Templates</Card.Header>
                    <Row className="p-3">
                      {designCerts?.slice(-3)?.map((card, index) => (
                        <Col key={index} xs={6} md={4}>
                          <Card
                            className="cert-thumb"
                            style={{ cursor: "pointer" }}
                            onClick={() => handleDesignCardSelect(card?.url)}
                          >
                            <Card.Img
                              variant="top" src={card?.url} />
                          </Card>
                        </Col>
                      ))}
                    </Row>
                    <Card.Header>Available Templates</Card.Header>
                    <Row className="p-3">
                      {cards.map((card, index) => (
                        <Col key={card.id} xs={6} md={4}>
                          <Card
                            className="cert-thumb"
                            style={{ cursor: "pointer" }}
                            onClick={() => handleCardSelect(index)}
                          >
                            <Card.Img variant="top" src={card.imageUrl} />
                          </Card>
                        </Col>
                      ))}

                    </Row>

                  </Card>
                </Col>
                <Col xs="12" md={6}>
                  {selectedCard !== null && (
                    <Card className="preview-certificate h-auto">
                      <Card.Header>Preview</Card.Header>
                      <Card.Body className="p-4 text-center">
                        <div className="preview-cert">
                          <Image
                            layout="fill"
                            objectFit="contain"
                            src={certificateUrl}
                            alt={
                              newTemplate !== null
                                ? "Custom Template"
                                : `Card ${cards[selectedCard].id}`
                            }
                          />
                        </div>
                        <Button
                          label="Select this template"
                          className="golden w-100"
                          onClick={handleSelectTemplate}
                        />
                      </Card.Body>
                    </Card>
                  )}
                </Col>
              </Row>
            </Container>
          </div>
          <div className="page-footer-bg"></div>
        </div>
      </div>

      {/* Loading Modal for API call */}
      <Modal className="loader-modal" show={isLoading} centered>
        <Modal.Body>
          <div className="certificate-loader">
            <Image
              src="/backgrounds/login-loading.gif"
              layout="fill"
              objectFit="contain"
              alt="Loader"
            />
          </div>
          <div className="text">Uploading image.</div>
          <ProgressBar now={now} label={`${now}%`} />
        </Modal.Body>
      </Modal>

      <Modal
        onHide={handleClose}
        className="loader-modal text-center"
        show={show}
        centered
      >
        <Modal.Body>
          {loginError !== "" ? (
            <>
              <div className="error-icon success-image">
                <Image
                  src="/icons/invalid-password.gif"
                  layout="fill"
                  objectFit="contain"
                  alt="Loader"
                />
              </div>
              <div className="text" style={{ color: "#ff5500" }}>
                {loginError}
              </div>
              <button className="warning" onClick={handleClose}>
                Ok
              </button>
            </>
          ) : (
            <>
              <div className="error-icon success-image">
                <Image
                  src="/icons/success.gif"
                  layout="fill"
                  objectFit="contain"
                  alt="Loader"
                />
              </div>
              <div className="text mt-3" style={{ color: "#CFA935" }}>
                {loginSuccess}
              </div>
              <button className="success" onClick={handleClose}>
                Ok
              </button>
            </>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default CardSelector;
