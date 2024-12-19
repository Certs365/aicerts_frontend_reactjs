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
import { fabric } from "fabric";
import ImagesPanel from "../components/certificate-designer/panel/ImagesPanel";

import { Tooltip } from "../components/certificate-designer/utils/shapeActions";
import {
  setBackgroundImage,
  setImage,
} from "../components/certificate-designer/utils/templateUtils";
import TemplatePanel from "../components/certificate-designer/panel/TemplatePanel";
import { Button, Spinner } from "react-bootstrap";
import { AlignGuidelines } from "fabric-guideline-plugin";
import { setup } from "../components/certificate-designer/utils/setup";
import { useCanvasStore } from "../components/certificate-designer/utils/canvasStore";
import ElementPanel from "../components/certificate-designer/panel/ElementPanel";
import { useRouter } from "next/router";
import UnsavedChangesPopup from "../components/certificate-designer/UnsavedChangesPopup";

const Designer = () => {
  const canvasRef = useRef(true);
  const [canvas, setCanvas] = useState(null);
  const [targetId, setTargetId] = useState(null); // For updating existing template
  const [activePanel, setActivePanel] = useState(null);
  const [isActivePanel, setIsActivePanel] = useState();
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
  const [activeObject, setActiveObject] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [fileUrl, setFileUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [guideline, setGuideline] = useState(null);
  const [showPopup, setShowPopup] = useState(false); // Control popup visibility
  const [pendingRoute, setPendingRoute] = useState(null); // Store pending navigation route
  const router = useRouter();
  const [currentRoute, setCurrentRoute] = useState(null); // Store the current route

  // Use effect to fetch and load the user's email from localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") ?? "null");
    if (storedUser && storedUser.JWTToken) {
      setUserEmail(storedUser.email.toLowerCase());
    }
  }, []);

  // Function to convert dataURL to Blob
  const dataURLToBlob = (dataURL) => {
    const [header, data] = dataURL.split(",");
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
      // alert("Canvas is empty. Please add content before saving.");
      return;
    }

    // showLoader();
    setLoading(true);

    const templateData = canvas.toJSON(); // Get the canvas data

    const dataURL = canvas.toDataURL({ format: "png" }); // Convert canvas to PNG data URL
    const blob = dataURLToBlob(dataURL);
    const fd = new FormData();
    const date = new Date().getTime();
    const filename = `template_${date}.png`; // Create a filename based on the timestamp
    fd.append("file", blob, filename);

    try {
      // Upload image to server (S3)
      const uploadResponse = await fetch(
        `https://adminapidev.certs365.io/api/upload`,
        {
          method: "POST",
          body: fd,
        }
      );

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
       
        return uploadedFileUrl;
      } else {
        // alert("Failed to upload template.");
      }
    } catch (error) {
      console.error("Error uploading template:", error);
      // alert("An error occurred while uploading the template.");
    } finally {
      // hideLoader();
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!canvas) return;

    const saveCanvasState = () => {
      const canvasState = JSON.stringify(canvas.toJSON());
      localStorage.setItem("fabricCanvasState", canvasState);
    };

    // Listen to object addition/modification/removal
    canvas.on("object:modified", saveCanvasState);
    canvas.on("object:added", saveCanvasState);
    canvas.on("object:removed", saveCanvasState);

    return () => {
      canvas.off("object:modified", saveCanvasState);
      canvas.off("object:added", saveCanvasState);
      canvas.off("object:removed", saveCanvasState);
    };
  }, [canvas]);

  useEffect(() => {
    setCurrentRoute(router.asPath); // Set the initial route when the component mounts
    const handleRouteChangeStart = (url) => {
      if (!canvas || canvas.isEmpty()) {
        return; // Allow navigation
      }
    
      setShowPopup(true); // Show the confirmation popup
      setPendingRoute(url); // Store the route user wants to navigate to
      return false; // Prevent the route change temporarily
    };
    
    

    // Listen to route change start to show the popup
    router.events.on("routeChangeStart", handleRouteChangeStart);

    return () => {
      router.events.off("routeChangeStart", handleRouteChangeStart);
    };
  }, [router,canvas, currentRoute]);

  useEffect(() => {

    // Use beforePopState to capture navigation (back/forward)
    router.beforePopState(({ url }) => {
      if (!canvas || canvas.isEmpty()) {
        return true; // Allow navigation
      }
    
      setShowPopup(true);
      setPendingRoute(url);
      return false; // Prevent the default behavior
    });
    

    return () => {
      router.beforePopState(() => true); // Reset to default behavior
    };
  }, [router,canvas, currentRoute]);

  const handleDiscardChanges = () => {
    localStorage.removeItem("fabricCanvasState"); // Clear saved canvas state
    // setIsSaved(true);
    setShowPopup(false);
  
    if (pendingRoute) {
      router.push(pendingRoute); // Navigate to the pending route
      setPendingRoute(null); // Clear the pending route
    }
  };
  

  const handlePopupClose = () => {
    setShowPopup(false);
    setPendingRoute(null); // Reset pending navigation if the user cancels
  };

  const handleSavedChanges = async () => {
    try {
      console.log("Saving changes...");
      const url = await handleTemplateSave();
  
      localStorage.removeItem("fabricCanvasState");
      setShowPopup(false);
  
      if (pendingRoute) {
        router.push(pendingRoute); // Navigate to the pending route
        setPendingRoute(null);
      }
    } catch (error) {
      console.error("Failed to save changes:", error);
    }
  };
  

  // Function to update an existing certificate template
  const updateTemplate = async (id, fileUrl, templateData) => {
    try {
      const response = await fetch(
        `https://userdevapi.certs365.io/api/update-certificate-template`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id,
            url: fileUrl,
            designFields: templateData,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        // alert("Template updated successfully!");
      } else {
        // alert("Failed to update template.");
      }
    } catch (error) {
      console.error("Error updating template:", error);
      // alert("An error occurred while updating the template.");
    }
  };

  // Function to create a new certificate template
  const createTemplate = async (fileUrl, templateData) => {
    try {
      const response = await fetch(
        `https://userdevapi.certs365.io/api/add-certificate-template`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: userEmail,
            url: fileUrl,
            designFields: templateData,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        // alert("Template added successfully!");
      } else {
        // alert("Failed to add template.");
      }
    } catch (error) {
      console.error("Error adding template:", error);
      // alert("An error occurred while adding the template.");
    }
  };

  const moveToIssuance = async () => {
    try {
      // First, save the template
      const fileUrl = await handleTemplateSave();

      // Ensure fileUrl has been set before moving to issuance
      if (fileUrl) {
        sessionStorage.setItem("customTemplate", fileUrl); // Store the uploaded template URL
        sessionStorage.setItem("cerf", "true"); // Mark as certificate-ready
        const tab = sessionStorage.getItem("tab") || 0;

        // Redirect to the certificate page
        window.location.href = `/certificate?tab=${tab}`;
      } else {
        // alert("Template upload failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during Move to Issuance:", error);
      // alert("An error occurred while processing your request.");
    }
  };

  const { paperSize, orientation } = useCanvasStore((state) => state); // Access Zustand state

  useEffect(() => {
    if (canvasRef.current) {
      console.log(canvasRef.current);
      // const fabricCanvas = setup({
      //   normalBoxCount: 10,
      //   rotateBoxCount: 2,
      //   paperSize,
      //   orientation
      // });
      const fabricCanvas = new fabric.Canvas("myCanvas", {
        width: 900,
        height: 650,
        backgroundColor: "white",
      });
      fabricCanvas.backgroundColor = "#fff";

      // fabricCanvas.renderAll();
      setCanvas(fabricCanvas);

      // Load saved state from localStorage
      const savedCanvasState = localStorage.getItem("fabricCanvasState");
      if (savedCanvasState) {
        fabricCanvas.loadFromJSON(savedCanvasState, () => {
          fabricCanvas.renderAll(); // Ensure canvas is rendered after loading
        });
      }
      const guidelineInstance = new AlignGuidelines({
        canvas: fabricCanvas,
        // pickObjTypes: [{ key: "myType", value: "box" }],
        aligningOptions: {
          lineColor: "#32D10A",
          lineMargin: 8,
        },
      });
      guidelineInstance.init();

      setGuideline(guidelineInstance);

      fabricCanvas.on("selection:created", () => {
        const activeObject = fabricCanvas.getActiveObject();
        setActiveObject(activeObject);

        if (activeObject) {
          //  handleShapeActions(activeObject,fabricCanvas)

          console.log("New object created");
          console.log(activeObject.type);
          setActiveShape(activeObject);
          updateActiveObjectStyles(activeObject);
        }
      });

      fabricCanvas.on("mouse:move", () => {
        const activeObject = fabricCanvas.getActiveObject();
        setActiveObject(activeObject);
        if (activeObject) {
          // handleShapeActions(activeObject,fabricCanvas)
        }
      });

      fabricCanvas.on("selection:updated", () => {
        const activeObject = fabricCanvas.getActiveObject();
        setActiveObject(activeObject);
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
  const containerWidth = 700; // Example: Update this based on your outer container width
  const aspectRatios = {
    A4: 595 / 842,
    "US Letter": 612 / 792,
  };

  const paperSizes = {
    A4: {
      Portrait: {
        width: containerWidth,
        height: containerWidth / aspectRatios.A4,
      },
      Landscape: {
        width: containerWidth / aspectRatios.A4,
        height: containerWidth,
      },
    },
    "US Letter": {
      Portrait: {
        width: containerWidth,
        height: containerWidth / aspectRatios["US Letter"],
      },
      Landscape: {
        width: containerWidth / aspectRatios["US Letter"],
        height: containerWidth,
      },
    },
  };

  useEffect(() => {
    if (canvas) {
      const { width, height } = paperSizes[paperSize][orientation];
      canvas.setWidth(width);
      canvas.setHeight(height);
      canvas.renderAll();
    }
  }, [paperSize, orientation, canvas]);

  const handleFontChange = (font) => {
    const activeObject = canvas?.getActiveObject();
    setActiveObject(activeObject);
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
      console.log(activeObject.type);
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
    } else if (activeObject.type === "line") {
      // Handle line-specific properties
      setShapeStyles({
        bgColor: "transparent", // Lines don’t have a fill property
        borderColor: activeObject.stroke || "black", // Stroke is the line's color
        borderRadius: 0, // Lines don’t have corners
        borderWeight: activeObject.strokeWidth || 1,
        transparency: activeObject.opacity || 1,
      });

      // Clear text styles if a line object is active
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
    setActiveObject(activeObject);

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
    console.log("template is", template);
    canvas.clear();
    setTargetId(template._id);

    // Add background image to canvas
    const backgroundImage = template.designFields.backgroundImage;

    if (backgroundImage && backgroundImage.src) {
      setBackgroundImage(backgroundImage.src, canvas);
    }

    // Add objects (images, text, etc.) from the designFields
    template.designFields.objects.forEach(async (obj) => {
      if (obj.type === "image" || obj.type === "Image") {
        fabric.Image.fromURL(
          obj.src,
          function (img) {
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
          },

          {
            crossOrigin: "anonymous",
          }
        );
      } else if (obj.type === "textbox" || obj.type === "Textbox") {
        const text = new fabric.Textbox(obj.text, {
          left: obj.left,
          top: obj.top,
          fontSize: obj.fontSize,
          fontFamily: obj.fontFamily,
          fill: obj.fill,
          width: obj.width,
        });
        canvas.add(text);
      } else if (obj.type === "Rect" || obj.type === "rect") {
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
      } else if (obj.type === "Polygon" || obj.type === "polygon") {
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
      } else if (obj.type === "Circle" || obj.type === "circle") {
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
  };

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
    // {
    //   icon: FaShapes,
    //   label: "Shapes",
    //   panel: (
    //     <ShapePanel
    //       canvas={canvas}
    //       onAddShape={(shape) => {
    //         onAddShape(shape, canvas, guideline);
    //       }}
    //     />
    //   ),
    // },
    {
      icon: LuLayoutTemplate,
      label: "Templates",
      panel: <TemplatePanel onTemplateSelect={renderTemplateOnCanvas} />,
    },
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
    // {
    //   icon: FaImages,
    //   label: "Images",
    //   panel: (
    //     <ImagesPanel
    //       onSelectImage={(imageUrl) => {
    //         setImage(imageUrl, canvas);
    //       }}
    //     />
    //   ),
    // },
    {
      icon: TbIcons,
      label: "Elements",
      panel: <ElementPanel canvas={canvas} />,
    },
    { icon: IoReturnUpBackOutline, label: "Back" },
  ];

  const SidebarIcon = ({ icon: Icon, label, onClick, isActive }) => {
    return (
      <div
        className={
          isActive
            ? "active-panels my-4 d-flex flex-column align-items-center text-white py-1 "
            : " my-4 d-flex flex-column align-items-center text-white py-1"
        }
        onClick={onClick}
        style={{ cursor: "pointer" }}
      >
        <Icon size={20} color={isActive ? "#CFA935" : "white"} />
        {/* <TbIcons color=""/> */}
        <small style={{ color: isActive ? "#CFA935" : "white" }}>{label}</small>
      </div>
    );
  };
  const handelPanelClick = (panel, label) => {
    setActivePanel(panel);
    setIsActivePanel(label);
  };

  return (
    <div className="page-bg position-absolute" style={{ top: "90px" }}>
      {loading && (
        <div className="loader-overlay position-absolute">
          <Spinner
            style={{ width: "100px", height: "100px" }}
            animation="border"
            variant="warning"
          />
        </div>
      )}
      <div className="w-100 h-100 d-flex ">
        <div className="w-25 d-flex align-items-center">
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
                isActive={isActivePanel === iconData.label}
              />
            ))}
            <div className="action-buttons d-flex gap-2 flex-column px-1">
              <button
                style={{
                  background: "none",
                  border: "2px solid white",
                  borderRadius: "5px",
                  fontSize: "13px",
                  color: "white",
                  fontWeight: "bold",
                }}
                onClick={handleTemplateSave}
              >
                {targetId ? "Save Template" : "Save as Template"}
              </button>
              <button
                style={{
                  background: "none",
                  border: "2px solid white",
                  borderRadius: "5px",
                  fontSize: "13px",
                  color: "white",
                  fontWeight: "bold",
                }}
                onClick={moveToIssuance}
              >
                Move to Issuance
              </button>
            </div>
          </div>
          <div className="w-75 h-100 d-flex flex-column pt-4 px-1">
            {activePanel}
          </div>
        </div>
        <div className="w-75 d-flex gap-3 align-items-center flex-column overflow-y-auto mt-4">
          <div
            className="  px-3 d-flex align-items-center"
            style={{ height: "10%", width: "85%" }}
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
          <div
            className="d-flex p-2  overflow-y-scroll"
            style={{
              width: "93%",
              justifyContent: "center",
              alignItems: "center",
              boxShadow:
                "rgba(0, 0, 0, 0.16) 0px 1px 4px, #CFA935 0px 0px 0px 3px",
            }}
          >
            <canvas
              id="myCanvas"
              ref={canvasRef}
              style={{
                width: "100%", // Can adjust to a specific value if you want to fix it
                height: "100%", // Same for height if you want it fixed
                boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
              }}
            />
          </div>
        </div>
      </div>
      <Tooltip activeObject={activeObject} fabricCanvas={canvas} />
      <UnsavedChangesPopup
        show={showPopup}
        handleSave={handleSavedChanges}
        // handleDiscard={handleDiscardChanges}
        handleClose={handleDiscardChanges}
      />
    </div>
  );
};

export default Designer;
