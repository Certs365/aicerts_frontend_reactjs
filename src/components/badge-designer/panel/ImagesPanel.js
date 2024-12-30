import React, { useState, useEffect } from "react";
import FileUpload from "../../FileUpload";
import Scrollbar from "react-scrollbars-custom";
import { Spinner } from "react-bootstrap";

function ImagesPanel({ onSelectImage }) {
  const [activeTab, setActiveTab] = useState("predefined");
  const [uploadedBackgrounds, setUploadedBackgrounds] = useState([]);
  const apiUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const [loading, setLoading] = useState(true);

  const predefinedImages = [
    "./poc-assets/badges/gold badge.png",
    "./poc-assets/badges/award ribbon badge.png",
    "./poc-assets/badges/gold shield badge.png",
    "./poc-assets/badges/green badge.png",
    "./poc-assets/badges/red ribbon badge.png",
    "./poc-assets/badges/black badge.png",
    "./poc-assets/badges/gold oval badge.png",
    "./poc-assets/badges/1st badge.png",
    "./poc-assets/badges/blue ribbon.png",
    "./poc-assets/badges/blue gradient waves.png",
    "./poc-assets/badges/golden ribbon.png",
    "./poc-assets/badges/blue golden black banner.png",
    "./poc-assets/badges/blue ocean wave.png",
    "./poc-assets/badges/pink blue gradient.png",
    "./poc-assets/badges/blue title ribbon.png",
    "./poc-assets/badges/green title ribbon.png",
    "./poc-assets/badges/orange title ribbon.png",
    "./poc-assets/badges/white title ribbon.png",
    "./poc-assets/badges/golden title ribbon.png",
    "./poc-assets/badges/black triangle.png",
    "./poc-assets/badges/black diamond.png",
    "./poc-assets/badges/black llgram.png",
  ];

  useEffect(() => {
    if (activeTab === "uploaded") {
      fetchUploadedBackgrounds();
    }
  }, [activeTab]);

  // Fetch uploaded backgrounds
  const fetchUploadedBackgrounds = async () => {
    const userObject = JSON.parse(localStorage.getItem("user"));
    const issuerId = userObject ? userObject.issuerId : null;

    if (!issuerId) {
      console.error("Issuer ID not found.");
      return;
    }

    try {
      const response = await fetch(
        `https://userdevapi.certs365.io/api/get/certificate/image/${issuerId}`
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to fetch uploaded backgrounds."
        );
      }
      const images = await response.json();
      setUploadedBackgrounds(images);
    } catch (error) {
      console.error("Error fetching uploaded backgrounds:", error);
    }  finally {
      setLoading(false); // Stop loading after fetching
    }
  };

  const handleDelete = (backgroundId) => {
    
    setUploadedBackgrounds((prevBg) =>
      prevBg.filter((bg) => bg.id !== backgroundId)
    );
  };

  return (
    <div className="backgrounds-panel">
      <div className="background-tabs">
        <button
          onClick={() => setActiveTab("predefined")}
          className={activeTab === "predefined" ? "active-panel" : ""}
        >
          Images
        </button>
        <button
          onClick={() => setActiveTab("uploaded")}
          className={activeTab === "uploaded" ? "active-panel" : ""}
        >
          Your Uploads
        </button>
      </div>

      {activeTab === "predefined" && (
        <div className="predefined-backgrounds">
          {/* <h3>Predefined Backgrounds</h3> */}
          {/* Display predefined backgrounds here */}
          <Scrollbar
            style={{ height: "100%" }}
            noScrollX
            thumbYProps={{
              renderer: (props) => {
                const { elementRef, ...restProps } = props;
                return (
                  <div
                    {...restProps}
                    ref={elementRef}
                    style={{
                      backgroundColor: "#CFA935", // Thumb color
                      borderRadius: "8px", // Optional: rounded corners for the scrollbar thumb
                    }}
                  />
                );
              },
            }}
          >
            <div className="backgrounds-grid">
              {predefinedImages.map((src, index) => (
                <div key={index} className="background-item">
                  <img
                  crossorigin="anonymous"
                    src={src}
                    alt={`Image ${index + 1}`}
                    width="40px"
                    height="40px"
                    onClick={() => onSelectImage(src)}
                  />
                  
                </div>
              ))}
            </div>
          </Scrollbar>
        </div>
      )}

      {activeTab === "uploaded" && (
        <div className="uploaded-backgrounds">
          <div className="upload-section">
            {/* <input type="file" onChange={handleFileChange} /> */}
            <FileUpload
              onUploadSuccess={fetchUploadedBackgrounds}
              imageType={"image"}
            />
            {/* <button onClick={uploadBackground}>Upload Background</button> */}
          </div>

          {loading ? (
        <div className="loader">
          <Spinner style={{width:"100px", height:"100px"}} animation="border" variant="warning" />
        </div>
      ) : (
        <Scrollbar
        style={{ height: "100%" }}
        noScrollX
        thumbYProps={{
          renderer: (props) => {
            const { elementRef, ...restProps } = props;
            return (
              <div
                {...restProps}
                ref={elementRef}
                style={{
                  backgroundColor: "#CFA935", // Thumb color
                  borderRadius: "8px", // Optional: rounded corners for the scrollbar thumb
                }}
              />
            );
          },
        }}
      >
        <div className="backgrounds-grid">
          {uploadedBackgrounds.map((image) => (
            <div key={image.id} className="background-item d-flex justify-content-center mt-2" >
              <img
              crossorigin="anonymous"
                src={image.imageUrl}
                alt="Uploaded Background"
                width="60"
                height="60"
                onClick={() => onSelectImage(image.imageUrl)}
              />
              {/* Delete button or additional options can be added here */}
              <div
            
            style={{
              position: "relative",
              top: "-10px",
              right: "0px",
              cursor: "pointer",
            }}
            onClick={() => handleDelete(image.id)}
          >
            <img
              src="./templateAsset/close.png"
              alt="close"
              style={{ width: "16px", height: "16px" }}
            />
          </div>
            </div>
          ))}
        </div>
      </Scrollbar>

      )
    }
         
        </div>
      )}
    </div>
  );
}

export default ImagesPanel;
