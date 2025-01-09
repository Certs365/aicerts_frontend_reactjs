import React, { useState, useEffect } from "react";
import FileUpload from "../../FileUpload";
import Scrollbar from "react-scrollbars-custom";
import { Spinner } from "react-bootstrap";
import certificate from "../../../services/certificateServices";

function BadgePanel({ onSelectImage, certificate1 }) {
  const [activeTab, setActiveTab] = useState("predefined");
  const [uploadedBackgrounds, setUploadedBackgrounds] = useState([]);
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch predefined badges from the API
  const getAllBadges = async () => {

    try {
      const storedUser = JSON.parse(localStorage.getItem("user") ?? "null");
      let userEmail = "";

      if (storedUser && storedUser.JWTToken) {
        userEmail = storedUser.email.toLowerCase();
      }

      certificate.getBadgeTemplates({ email: userEmail }, (response) => {

        if (response.status === "SUCCESS") {
            const fetchedBadges = response.data;
            const badgeUrls = fetchedBadges?.data
              ?.map(item => item.url)
              ?.filter(url => url !== undefined && url !== null);
            
            setBadges(badgeUrls);
            
        } else {
          console.error("Failed to fetch badges:", response.error || "Unknown error");
        }
      });
    } catch (error) {
      console.error("Unexpected error fetching badges:", error);
    }
  };

  // ✅ Fetch badges when the component mounts
  useEffect(() => {
    getAllBadges();
  }, []);

  // ✅ Fetch uploaded backgrounds on tab change
  useEffect(() => {
    if (activeTab === "uploaded") {
      fetchUploadedBackgrounds();
    }
  }, [activeTab]);

  // ✅ Fetch uploaded backgrounds
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
    } finally {
      setLoading(false);
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

      {/* ✅ Predefined Images Section */}
      {activeTab === "predefined" && (
        <div className="predefined-backgrounds">
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
                      backgroundColor: "#CFA935",
                      borderRadius: "8px",
                    }}
                  />
                );
              },
            }}
          >
            <div className="backgrounds-grid">
              {badges.map((badge, index) => (
                <div key={index} className="background-item">
                  {/* eslint-disable-next-line */}
                  <img
                    crossorigin="anonymous"
                    src={badge}
                    alt={`Badge ${index + 1}`}
                    width="40px"
                    height="40px"
                    onClick={() => onSelectImage(badge)}
                  />
                </div>
              ))}
            </div>
          </Scrollbar>
        </div>
      )}

      {/* ✅ Uploaded Images Section */}
      {activeTab === "uploaded" && (
        <div className="uploaded-backgrounds">
          <div className="upload-section">
            <FileUpload
              onUploadSuccess={fetchUploadedBackgrounds}
              imageType={"image"}
            />
          </div>

          {loading ? (
            <div className="loader">
              <Spinner
                style={{ width: "100px", height: "100px" }}
                animation="border"
                variant="warning"
              />
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
                        backgroundColor: "#CFA935",
                        borderRadius: "8px",
                      }}
                    />
                  );
                },
              }}
            >
              <div className="backgrounds-grid">
                {uploadedBackgrounds.map((image) => (
                  <div key={image.id} className="background-item d-flex justify-content-center mt-2">
                    {/* eslint-disable-next-line */}
                    <img
                      crossorigin="anonymous"
                      src={image.imageUrl}
                      alt="Uploaded Background"
                      width="60"
                      height="60"
                      onClick={() => onSelectImage(image.imageUrl)}
                    />
                    <div
                      style={{
                        position: "relative",
                        top: "-10px",
                        right: "0px",
                        cursor: "pointer",
                      }}
                      onClick={() => handleDelete(image.id)}
                    >
                      {/* eslint-disable-next-line */}
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
          )}
        </div>
      )}
    </div>
  );
}

export default BadgePanel;
