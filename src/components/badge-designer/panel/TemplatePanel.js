import React, { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import Scrollbar from "react-scrollbars-custom";

// Define the API URL
const apiUrl = "YOUR_API_URL"; // Replace with your actual API URL

const TemplatePanel = ({ onTemplateSelect }) => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state

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
    <div className="template-panel">
      {/* <h3>Available Certificate Templates</h3> */}

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
           {/* <div className="predefined-backgrounds"> */}
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
     
      )}
    </div>
  );
};

export default TemplatePanel;
