import React, { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import Scrollbar from "react-scrollbars-custom";

// Define the API URL
const apiUrl = "YOUR_API_URL"; // Replace with your actual API URL

const TemplatePanel = ({ onTemplateSelect }) => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [activeTab, setActiveTab] = useState("predefined");

  const predefinedTemplates = [
    "./poc-assets/b1.jpg",
    "./poc-assets/b2.png",
    "./poc-assets/b3.png",
    "./poc-assets/b4.png",
    "./poc-assets/b5.jpg",
    "./poc-assets/b6.jpg",
    "./poc-assets/b7.png",
    "./poc-assets/b8.jpg",
    "./poc-assets/b9.png",
    "./poc-assets/b10.png",
    "./poc-assets/b11.png",
    "./poc-assets/b12.png",
    "./poc-assets/b13.png",
    "./poc-assets/b14.png",
    "./poc-assets/b15.png",
    "./poc-assets/b16.png",
    "./poc-assets/b17.png",
    "./poc-assets/b18.png",
    "./poc-assets/b19.png",
    "./poc-assets/b20.png",
    "./poc-assets/b21.png",
    "./poc-assets/b22.png",
    "./poc-assets/b23.png",
    "./poc-assets/b24.png",
    "./poc-assets/b25.png",
    "./poc-assets/b26.png",
    
  ];

  useEffect(() => {
    // Fetch the templates when the component mounts
    const fetchTemplates = async () => {
      const storedUser = JSON.parse(localStorage.getItem("user") ?? "null");
      let userEmail;
      if (storedUser && storedUser.JWTToken) {
        userEmail = storedUser.email.toLowerCase();
      }

      try {
        const response = await fetch(
          `https://userdevapi.certs365.io/api/get-certificate-templates`, 
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: userEmail,
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data.status === "SUCCESS" && data.data.length > 0) {
            setTemplates(data.data); // Store templates in state
          } else {
            console.error("No templates found.");
          }
        } else {
          console.error("Can't fetch template", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching template:", error);
      } finally {
        setLoading(false); // Stop loading after fetching
      }
    };

    fetchTemplates();
  }, []);

  const handleDelete = (templateId) => {
    console.log("Deleting template with ID:", templateId);
    setTemplates((prevTemplates) =>
      prevTemplates.filter((template) => template._id !== templateId)
    );
  };

  const handleTemplateClick = (template) => {
    onTemplateSelect(template); // Pass the selected template to the parent
  };

  return (
    <div className="backgrounds-panel">
      {/* <h3>Available Certificate Templates</h3> */}
      <div className="background-tabs">
        <button
          onClick={() => setActiveTab("predefined")}
          className={activeTab === "predefined" ? "active-panel" : ""}
        >
          Templates
        </button>
        <button
          onClick={() => setActiveTab("uploaded")}
          className={activeTab === "uploaded" ? "active-panel" : ""}
        >
          Your Designed
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
            {/* Map over predefined backgrounds and display them */}
            {predefinedTemplates.map((bg, index) => (
              <div key={index} className="background-item">
                 {/* eslint-disable-next-line  */}
                <img
                crossorigin="anonymous"
                  src={`${bg}`}
                  alt={`Background ${index + 1}`}
                  // onClick={() => onSelectBackground(bg)}
                />
              </div>
            ))}
          </div>

          </Scrollbar>
         
        </div>
      )}

      {
        activeTab === "uploaded" && 
// loading ? (
//           <div className="loader">
//             <Spinner style={{width:"100px", height:"100px"}} animation="border" variant="warning" />
//           </div>
//         ) : (
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
            
            {templates.map((template) => (
              <div
                key={template._id}
                className="template-box"
                style={{ position: "relative", display: "inline-block", margin: "10px" }}
                onClick={() => handleTemplateClick(template)}
              >
                 {/* eslint-disable-next-line  */}
                <img
                  src={template.url}
                  alt={`Template ${template._id}`}
                  width="60"
                  height="60"
                  data-design-fields={JSON.stringify(template.designFields)}
                />
                
                <div
                  className="close"
                  style={{
                    position: "absolute",
                    top: "-10px",
                    right: "-10px",
                    cursor: "pointer",
                  }}
                  onClick={() => handleDelete(template._id)}
                >
                   {/* eslint-disable-next-line  */}
                  <img
                    src="./templateAsset/close.png"
                    alt="close"
                    style={{ width: "16px", height: "16px" }}
                  />
                </div>
              </div>
            ))}
          
  
        </Scrollbar>
       
        
      }

      
    </div>
  );
};

export default TemplatePanel;
