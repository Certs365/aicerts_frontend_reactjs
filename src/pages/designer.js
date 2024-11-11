import React, { useEffect, useRef, useState } from "react";
import { Canvas } from "fabric";
import { CiText } from "react-icons/ci";
import { FaShapes } from "react-icons/fa";
import { LuLayoutTemplate } from "react-icons/lu";
import { TbBackground } from "react-icons/tb";
import { IoReturnUpBackOutline } from "react-icons/io5";
import { FaImages } from "react-icons/fa";
import { TbIcons } from "react-icons/tb";
import TextPanel from "../components/certificate-designer/panel/TextPanel";
import {
  handleAddTextBox,
  handleAlignCenter,
  handleAlignLeft,
  handleAlignRight,
  handleBoldToggle,
  handleItalicToggle,
  handleTextColorChange,
  handleUnderlineToggle,
} from "../components/certificate-designer/utils/textUtils";
import TextEditPanel from "../components/certificate-designer/panel/TextEditPanel";
import FontPanel from "../components/certificate-designer/panel/FontPanel";
import ShapePanel from "../components/certificate-designer/panel/ShapePanel";
import ShapeEditPanel from "../components/certificate-designer/panel/ShapeEditPanel";
import {
  handleShapeBgColorChange,
  handleShapeBorderColorChange,
  handleShapeBorderRadiusChange,
  handleShapeBorderWeightChange,
  handleShapeTransparencyChange,
  onAddShape,
} from "../components/certificate-designer/utils/shapeUtils";
import BackgroundsPanel from "../components/certificate-designer/panel/BackgroundsPanel";
import * as fabric from "fabric";
import ImagesPanel from "../components/certificate-designer/panel/ImagesPanel";

import {  Tooltip } from "../components/certificate-designer/utils/shapeActions";
import { setBackgroundImage, setImage } from "../components/certificate-designer/utils/templateUtils";
import TemplatePanel from "../components/certificate-designer/panel/TemplatePanel";


const Designer = () => {
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);
  const [targetId, setTargetId] = useState(null); // For updating existing template
  const [activePanel, setActivePanel] = useState(null);
  const [isActivePanel, setIsActivePanel]=useState()
  const [activeShape, setActiveShape] = useState(null);
  const [textStyles, setTextStyles] = useState({
    isBold: false,
    isItalic: false,
    isUnderline: false,
    alignment: "center",
    transparency: 1,
    color: "#000000",
  });
  const [shapeStyles, setShapeStyles] = useState({
    bgColor: "black", // Default background color
    borderColor: "black", // Default border color
    borderRadius: 0, // Default border radius
    borderWeight: 1, // Default border weight
    transparency: 1, // Default transparency
  });
  const [activeObject , setActiveObject]=useState(null)
  const [userEmail, setUserEmail] = useState(null);
  const [fileUrl, setFileUrl] = useState("");

   // Use effect to fetch and load the user's email from localStorage
   useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") ?? "null");
    if (storedUser && storedUser.JWTToken) {
      setUserEmail(storedUser.email.toLowerCase());
    }
  }, []);

    // Function to convert dataURL to Blob
    const dataURLToBlob = (dataURL) => {
      const [header, data] = dataURL.split(',');
      const mime = header.match(/:(.*?);/)[1];
      const binary = atob(data);
      const array = [];
      for (let i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
      }
      return new Blob([new Uint8Array(array)], { type: mime });
    };


    const handleTemplateSave = async () => {
      if (!canvas || canvas.isEmpty()) {
        alert("Canvas is empty. Please add content before saving.");
        return;
      }
  
      // showLoader();
  
      const templateData = canvas.toJSON(); // Get the canvas data
  
      const dataURL = canvas.toDataURL({ format: "png" }); // Convert canvas to PNG data URL
      const blob = dataURLToBlob(dataURL);
      const fd = new FormData();
      const date = new Date().getTime();
      const filename = `template_${date}.png`; // Create a filename based on the timestamp
      fd.append("file", blob, filename);
  
      try {
        // Upload image to server (S3)
        const uploadResponse = await fetch(`https://adminapidev.certs365.io/api/upload`, {
          method: "POST",
          body: fd,
        });
  
        if (uploadResponse.ok) {
          const data = await uploadResponse.json();
          const uploadedFileUrl = data.fileUrl;
          setFileUrl(uploadedFileUrl); // Store file URL
  
          if (targetId) {
            // If template ID exists, update the template
            await updateTemplate(targetId, uploadedFileUrl, templateData);
          } else {
            // Otherwise, create a new template
            await createTemplate(uploadedFileUrl, templateData);
          }
        } else {
          alert("Failed to upload template.");
        }
      } catch (error) {
        console.error("Error uploading template:", error);
        alert("An error occurred while uploading the template.");
      } finally {
        hideLoader();
      }
    };

    // Function to update an existing certificate template
  const updateTemplate = async (id, fileUrl, templateData) => {
    try {
      const response = await fetch(`https://userdevapi.certs365.io/api/update-certificate-template`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          url: fileUrl,
          designFields: templateData,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        alert("Template updated successfully!");
      } else {
        alert("Failed to update template.");
      }
    } catch (error) {
      console.error("Error updating template:", error);
      alert("An error occurred while updating the template.");
    }
  };

  // Function to create a new certificate template
  const createTemplate = async (fileUrl, templateData) => {
    try {
      const response = await fetch(`https://userdevapi.certs365.io/api/add-certificate-template`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userEmail,
          url: fileUrl,
          designFields: templateData,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        alert("Template added successfully!");
      } else {
        alert("Failed to add template.");
      }
    } catch (error) {
      console.error("Error adding template:", error);
      alert("An error occurred while adding the template.");
    }
  };




  useEffect(() => {
    if (canvasRef.current) {
      const fabricCanvas = new Canvas(canvasRef.current, {
        width: 950,
        height: 600,
      });
      fabricCanvas.backgroundColor = "#fff";

      fabricCanvas.renderAll();
      setCanvas(fabricCanvas);
     

      fabricCanvas.on("selection:created", () => {
        const activeObject = fabricCanvas.getActiveObject();
        setActiveObject(activeObject)
       
        if (activeObject) {
        //  handleShapeActions(activeObject,fabricCanvas)

          console.log("New object created");
          console.log(activeObject.type);
          setActiveShape(activeObject);
          updateActiveObjectStyles(activeObject);
        }
      });

      fabricCanvas.on("mouse:move", ()=>{
        const activeObject = fabricCanvas.getActiveObject();
        setActiveObject(activeObject)
        if (activeObject) {
          // handleShapeActions(activeObject,fabricCanvas)

        }

      })

      fabricCanvas.on("selection:updated", () => {
        const activeObject = fabricCanvas.getActiveObject();
        setActiveObject(activeObject)
        if (activeObject) {
          // handleShapeActions(activeObject,fabricCanvas)
          console.log("New object selected");
          setActiveShape(activeObject);
          console.log(activeObject.type);
          updateActiveObjectStyles(activeObject); // Pass the activeObject to the function
        } else {
          // Handle case where no object is selected
          resetStyles();
        }
      });

      return () => {
        fabricCanvas.dispose();
      };
    }
  }, []);

  const handleFontChange = (font) => {
    const activeObject = canvas?.getActiveObject();
    setActiveObject(activeObject)
    if (activeObject && activeObject.type === "textbox") {
      activeObject.set({ fontFamily: font });
      canvas.renderAll();
    }
  };

  const handleOpenFontPanel = () => {
    setActivePanel(<FontPanel onFontChange={handleFontChange} />);
  };

  const updateActiveObjectStyles = (activeObject) => {
    if (activeObject.type === "textbox") {
      const { fontWeight, fontStyle, underline, fill, textAlign, opacity } =
        activeObject;
      setTextStyles({
        isBold: fontWeight === "bold",
        isItalic: fontStyle === "italic",
        isUnderline: underline,
        alignment: textAlign || "left",
        transparency: opacity || 1,
        color: fill || "#000000",
      });
      // Clear shape styles if a text object is active
      setShapeStyles({
        bgColor: "#FFFFFF",
        borderColor: "#000000",
        borderRadius: 0,
        borderWeight: 1,
        transparency: 1,
      });
    } else if (
      activeObject.type === "rect" ||
      activeObject.type === "circle" ||
      activeObject.type === "polygon" ||
      activeObject.type === "path"
    ) {
      console.log(activeObject.fill);
      setShapeStyles({
        bgColor:
          activeObject.fill === "none" ? "black" : activeObject.fill || "black",
        borderColor: activeObject.stroke || "black",
        borderRadius: activeObject.cornerRadius || 0,
        borderWeight: activeObject.strokeWidth,
        transparency: activeObject.opacity || 1,
      });

      // Clear text styles if a shape object is active
      setTextStyles({
        isBold: false,
        isItalic: false,
        isUnderline: false,
        alignment: "center",
        transparency: 1,
        color: "#000000",
      });
    } else {
      resetStyles();
    }
  };

  const resetStyles = () => {
    console.log("calling reset");
    setTextStyles({
      isBold: false,
      isItalic: false,
      isUnderline: false,
      alignment: "center",
      transparency: 1,
      color: "#000000",
    });
    setShapeStyles({
      bgColor: "#FFFFFF",
      borderColor: "#000000",
      borderRadius: 0,
      borderWeight: 1,
      transparency: 1,
    });
  };

  const handleTransparencyChange = (value) => {
    const activeObject = canvas?.getActiveObject();
    setActiveObject(activeObject)

    if (activeObject && activeObject.type === "textbox") {
      activeObject.set({ opacity: value }); // Set the new opacity on the active object
      setTextStyles((prevStyles) => ({
        ...prevStyles,
        transparency: value, // Update the transparency in textStyles state
      }));

      canvas.renderAll(); // Re-render the canvas to reflect the change
    }
  };

  const renderTemplateOnCanvas = (template) => {

    // Clear the canvas before rendering the new template
    console.log("template is", template)
    canvas.clear();
    setTargetId(template._id)

    // Add background image to canvas
    const backgroundImage = template.designFields.backgroundImage;
    
    if (backgroundImage && backgroundImage.src) {
    setBackgroundImage(backgroundImage.src , canvas)
    }

    // Add objects (images, text, etc.) from the designFields
    template.designFields.objects.forEach(async(obj) => {
      if (obj.type === "image" || obj.type === "Image") {
        const img = await fabric.FabricImage.fromURL(obj.src,{
          crossOrigin: "anonymous",
        });
        
          img.set({
            left: obj.left,
            top: obj.top,
            width: obj.width,
            height: obj.height,
            scaleX: obj.scaleX || 1,
            scaleY: obj.scaleY || 1,
            opacity: obj.opacity,
          });
          canvas.add(img);
   
      } else if (obj.type === "textbox" ||obj.type === "Textbox") {
        const text = new fabric.Textbox(obj.text, {
          left: obj.left,
          top: obj.top,
          fontSize: obj.fontSize,
          fontFamily: obj.fontFamily,
          fill: obj.fill,
          width: obj.width,
        });
        canvas.add(text);
      } else if (obj.type === "Rect" || obj.type ==="rect") {
        const rect = new fabric.Rect({
          left: obj.left,
          top: obj.top,
          width: obj.width,
          height: obj.height,
          fill: obj.fill,
          stroke: obj.stroke,
          strokeWidth: obj.strokeWidth,
        });
        canvas.add(rect);
      }else if (obj.type === "Polygon" ||obj.type === "polygon") {
        // Check if points are available for the polygon
        if (obj.points && Array.isArray(obj.points)) {
          const polygon = new fabric.Polygon(obj.points, {
            left: obj.left,
            top: obj.top,
            fill: obj.fill,
            stroke: obj.stroke,
            strokeWidth: obj.strokeWidth,
            opacity: obj.opacity,
          });
          canvas.add(polygon);
        }
      } else if (obj.type === "Circle" ||obj.type === "circle") {
        const circle = new fabric.Circle({
          left: obj.left,
          top: obj.top,
          radius: obj.radius, // You can use a radius property for circles
          fill: obj.fill,
          stroke: obj.stroke,
          strokeWidth: obj.strokeWidth,
          opacity: obj.opacity,
        });
        canvas.add(circle);
      }
    });
  }

 
  // Icon data array
  const icons = [
    {
      icon: CiText,
      label: "Text",
      panel: (
        <TextPanel
          onAddTextBox={(text, style) => handleAddTextBox(canvas, text, style)}
        />
      ),
    },
    {
      icon: FaShapes,
      label: "Shapes",
      panel: (
        <ShapePanel
          canvas={canvas}
          onAddShape={(shape) => {
            onAddShape(shape, canvas);
          }}
        />
      ),
    },
    { icon: LuLayoutTemplate, label: "Templates", panel:<TemplatePanel onTemplateSelect={renderTemplateOnCanvas}/> },
    {
      icon: TbBackground,
      label: "Background",
      panel: ( 
        <BackgroundsPanel
          onSelectBackground={(imageUrl) => {
            setBackgroundImage(imageUrl, canvas);
          }}
        />
      ),
    },
    {
      icon: FaImages,
      label: "Images",
      panel: (
        <ImagesPanel
          onSelectImage={(imageUrl) => {
            setImage(imageUrl, canvas);
          }}
        />
      ),
    },
    { icon: TbIcons, label: "Elements" },
    { icon: IoReturnUpBackOutline, label: "Back" },
  ];

  const SidebarIcon = ({ icon: Icon, label, onClick, isActive }) => {
  

    return (
      <div
        className={isActive?"active-panels my-4 d-flex flex-column align-items-center text-white py-1 ": " my-4 d-flex flex-column align-items-center text-white py-1"}
        onClick={onClick}
        style={{ cursor: "pointer" ,    }}
      >
        <Icon size={20} color={isActive?"#CFA935":"white"}  />
        {/* <TbIcons color=""/> */}
        <small style={{color:isActive?"#CFA935":"white"}}>{label}</small>
      </div>
    );
  };
  const handelPanelClick = (panel, label)=>{
    
    setActivePanel(panel)
    setIsActivePanel(label)
  }

  return (
    <div className="page-bg position-absolute" style={{ top: "70px" }}>
      <div className="w-100 h-100 d-flex ">
        <div className="w-25 d-flex align-items-center" >
          <div
            className="w-25 h-100"
            style={{
              background:
                "linear-gradient(to bottom, #CFA935 0%, #A3852B 100%)",
                
            }}
          >
            {icons.map((iconData, index) => (
              <SidebarIcon
                key={index}
                icon={iconData.icon}
                label={iconData.label}
                onClick={() => handelPanelClick(iconData.panel, iconData.label)}
                isActive = {isActivePanel === iconData.label}
              />
            ))}
             <div className="action-buttons">
        <button onClick={handleTemplateSave} className="save-template-btn">
          {targetId ? "Save Template" : "Save as New Template"}
        </button>
      </div>
          </div>
          <div
            className="w-75 h-100 d-flex flex-column py-4 px-1"
           
          >
            {activePanel }
          </div>
        </div>
        <div
          className="w-75 d-flex gap-3  flex-column overflow-y-auto mt-4"

        >
          <div
            className="  px-3 d-flex align-items-center"
            style={{ height: "10%", width:"85%" }}
          >
            {activeShape ? (
              activeShape.type === "textbox" ? (
                <TextEditPanel
                  onFontStyleChange={handleOpenFontPanel}
                  onBoldToggle={() =>
                    handleBoldToggle(
                      canvas,
                      setTextStyles,
                      updateActiveObjectStyles
                    )
                  }
                  onItalicToggle={() =>
                    handleItalicToggle(
                      canvas,
                      setTextStyles,
                      updateActiveObjectStyles
                    )
                  }
                  onUnderlineToggle={() =>
                    handleUnderlineToggle(
                      canvas,
                      setTextStyles,
                      updateActiveObjectStyles
                    )
                  }
                  onTextColorChange={(e) =>
                    handleTextColorChange(
                      canvas,
                      e.target.value,
                      updateActiveObjectStyles
                    )
                  }
                  onAlignLeft={() =>
                    handleAlignLeft(
                      canvas,
                      setTextStyles,
                      updateActiveObjectStyles
                    )
                  }
                  onAlignCenter={() =>
                    handleAlignCenter(
                      canvas,
                      setTextStyles,
                      updateActiveObjectStyles
                    )
                  }
                  onAlignRight={() =>
                    handleAlignRight(
                      canvas,
                      setTextStyles,
                      updateActiveObjectStyles
                    )
                  }
                  textStyles={textStyles} // Pass the entire textStyles object
                  onTransparencyChange={handleTransparencyChange} // Pass transparency handler
                />
              ) : (
                <ShapeEditPanel
                  onBgColorChange={(e) =>
                    handleShapeBgColorChange(
                      canvas,
                      setShapeStyles,
                      updateActiveObjectStyles
                    )(e)
                  }
                  onBorderColorChange={(e) =>
                    handleShapeBorderColorChange(
                      canvas,
                      setShapeStyles,
                      updateActiveObjectStyles
                    )(e)
                  }
                  onBorderRadiusChange={(value) =>
                    handleShapeBorderRadiusChange(
                      canvas,
                      setShapeStyles,
                      updateActiveObjectStyles
                    )(value)
                  }
                  onBorderWeightChange={(value) =>
                    handleShapeBorderWeightChange(
                      canvas,
                      setShapeStyles,
                      updateActiveObjectStyles
                    )(value)
                  }
                  onTransparencyChange={(value) =>
                    handleShapeTransparencyChange(
                      canvas,
                      setShapeStyles,
                      updateActiveObjectStyles
                    )(value)
                  }
                  shapeStyles={shapeStyles}
                />
              )
            ) : (
              <></>
            )}
          </div>
          <div className="w-100 d-flex px-3  ">
            <canvas
              ref={canvasRef}
              style={{
                // border: "4px solid #ccc",
                width: "100%",
                height: "100%",
                boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px"
              }}
            />
          </div>
        </div>
      </div>
      <Tooltip activeObject={activeObject} fabricCanvas={canvas} />

     
    </div>
  );
};

export default Designer;
