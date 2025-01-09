import { useState, useEffect } from "react";
import { BsLayerBackward, BsLayerForward } from "react-icons/bs";
import { CiLock, CiUnlock } from "react-icons/ci"; // Import unlock icon as well
import { IoDuplicateOutline } from "react-icons/io5";
import { RiDeleteBinLine } from "react-icons/ri";
import { toast } from "react-toastify";

// Tooltip component
export const Tooltip = ({ activeObject, fabricCanvas }) => {
  const [tooltipStyle, setTooltipStyle] = useState({
    display: "none",
    left: "0px",
    top: "0px",
  });
  const [isLocked, setIsLocked] = useState(false); // Track lock state

  // Update tooltip position when the activeObject is set or updated
  const updateTooltipPosition = () => {
    if (activeObject && fabricCanvas) {
      const tooltip = document.getElementById("tooltip");
      const canvasPosition = fabricCanvas.upperCanvasEl.getBoundingClientRect();
      const objectPosition = activeObject.getBoundingRect();

      const newTooltipStyle = {
        left: `${canvasPosition.left + objectPosition.left + activeObject.width / 2 - tooltip.offsetWidth / 2}px`,
        top: `${canvasPosition.top + objectPosition.top - tooltip.offsetHeight - 90}px`, // 10px offset above the object
        display: "flex",
      };

      setTooltipStyle(newTooltipStyle);
    }
  };

  // Lock shape functionality
  const lockShape = () => {
    activeObject.lockMovementX = true;
    activeObject.lockMovementY = true;
    activeObject.lockScalingX = true;
    activeObject.lockScalingY = true;
    activeObject.lockRotation = true;
    setIsLocked(true); // Set lock state to true
    toast.error("Shape locked!");
  };

  // Unlock shape functionality
  const unlockShape = () => {
    activeObject.lockMovementX = false;
    activeObject.lockMovementY = false;
    activeObject.lockScalingX = false;
    activeObject.lockScalingY = false;
    activeObject.lockRotation = false;
    setIsLocked(false); // Set lock state to false
    toast.error("Shape unlocked!");
  };

  // Delete shape functionality
  const deleteShape = () => {
    fabricCanvas.remove(activeObject);
    setTooltipStyle({ ...tooltipStyle, display: "none" }); // Hide tooltip after deletion
  };

  // Duplicate shape functionality
  const duplicateShape = () => {
    activeObject.clone().then((clone) => {
      clone.set({
        left: activeObject.left + 20, // Offset the position of the cloned object
        top: activeObject.top + 20,
      });
      fabricCanvas.add(clone);
    });
    setTooltipStyle({ ...tooltipStyle, display: "none" }); // Hide tooltip after duplication
  };

  // Send object forward
  const bringObjectForward = () => {
    fabricCanvas.bringObjectForward(activeObject);
    fabricCanvas.discardActiveObject();
    fabricCanvas.requestRenderAll();
    setTooltipStyle({ ...tooltipStyle, display: "none" }); // Hide tooltip after action
  };

  // Send object backward
  const sendObjectBackward = () => {
    fabricCanvas.sendObjectBackwards(activeObject);
    fabricCanvas.discardActiveObject();
    fabricCanvas.requestRenderAll();
    setTooltipStyle({ ...tooltipStyle, display: "none" }); // Hide tooltip after action
  };

  // Run the tooltip positioning when the active object changes
  /* eslint-disable */
  useEffect(() => {
    updateTooltipPosition();
  }, [activeObject]);
  /* eslint-disable */

  if (!activeObject) return null; // Don't render tooltip if there's no active object

  return (
    <div
      id="tooltip"
      style={{
        position: "absolute",
        display: tooltipStyle.display,
        left: tooltipStyle.left,
        top: tooltipStyle.top,
      }}
    >
      <button id="lockShape" onClick={isLocked ? unlockShape : lockShape}>
        {isLocked ? <CiUnlock /> : <CiLock />} {/* Show unlock icon if locked, else lock */}
      </button>
      <button id="deleteShape" onClick={deleteShape}>
        <RiDeleteBinLine />
      </button>
      <button id="duplicateShape" onClick={duplicateShape}>
        <IoDuplicateOutline />
      </button>
      <button id="obj-forward" onClick={bringObjectForward}>
        <BsLayerForward />
      </button>
      <button id="obj-backword" onClick={sendObjectBackward}>
        <BsLayerBackward />
      </button>
    </div>
  );
};
