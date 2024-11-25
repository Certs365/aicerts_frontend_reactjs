import { fabric } from "fabric";

// Tooltip component
export const Tooltip = ({ activeObject, fabricCanvas }) => {
  const [tooltipStyle, setTooltipStyle] = useState({
    display: "none",
    left: "0px",
    top: "0px",
  });
  const [isLocked, setIsLocked] = useState(false); // Track lock state

export const onAddShape = (shape, canvas) => {
  console.log(shape)
  if (!canvas) return;
  
  let shapeObject;
  
  switch (shape) {
    case "Rectangle":
      shapeObject = new fabric.Rect({
        width: 100,
        height: 60,
        fill: "none",
        left: canvas.width / 2 - 50,
        top: canvas.height / 2 - 30,
      });
      break;
    case "Polygon":
      shapeObject = new fabric.Polygon([
        { x: 50, y: 0 },
        { x: 100, y: 0 },
        { x: 125, y: 50 },
        { x: 100, y: 100 },
        { x: 50, y: 100 },
        { x: 25, y: 50 },
        { x: 50, y: 0 }
      ], {
        fill: "none",
        stroke: "black",
        left: canvas.width / 2 - 50,
        top: canvas.height / 2 - 50,
      });
      break;
    case "Heart":
      shapeObject = new fabric.Path('M 272.70141,238.71731 C 206.46141,238.71731 152.70146,292.4773 152.70146,358.71731 C 152.70146,493.47282 288.63461,528.80461 381.26391,662.02535 C 468.83815,529.62199 609.82641,489.17075 609.82641,358.71731 C 609.82641,292.47731 556.06651,238.7173 489.82641,238.71731 C 441.77851,238.71731 400.42481,267.08774 381.26391,307.90481 C 362.10311,267.08773 320.74941,238.7173 272.70141,238.71731 z');
      shapeObject.set({ left: canvas.width / 2 - 50, top: canvas.height / 2 - 50, scaleX: scale, scaleY: scale, fill: 'none' });
      break;
    case "Star":
      shapeObject = new fabric.Polygon([
        { x: 50, y: 0 },
        { x: 61, y: 35 },
        { x: 98, y: 35 },
        { x: 68, y: 57 },
        { x: 79, y: 91 },
        { x: 50, y: 70 },
        { x: 21, y: 91 },
        { x: 32, y: 57 },
        { x: 2, y: 35 },
        { x: 39, y: 35 }
      ], {
        fill: "none",
        left: canvas.width / 2 - 50,
        top: canvas.height / 2 - 50,
      });
      break;
    case "Circle":
      shapeObject = new fabric.Circle({
        radius: 50,
        fill: "none",
        left: canvas.width / 2 - 50,
        top: canvas.height / 2 - 50,
      });
      break;
    case "Square":
      shapeObject = new fabric.Rect({
        width: 60,
        height: 60,
        fill: "none",
        left: canvas.width / 2 - 30,
        top: canvas.height / 2 - 30,
      });
      break;
      case "VerticalLine":
        console.log("VerticalLine")
      shapeObject = new fabric.Line(
        [0, 0, 0, 100], // Vertical line from top to bottom
        {
          stroke: "black",
          strokeWidth: 2,
          left: canvas.width / 2,
          top: canvas.height / 2 - 50,
        }
      );
      break;
    case "HorizontalLine":
      console.log("horizontal")
      shapeObject = new fabric.Line(
        [0, 0, 100, 0], // Horizontal line from left to right
        {
          stroke: "black",
          strokeWidth: 2,
          left: canvas.width / 2 - 50,
          top: canvas.height / 2,
        }
      );
      break;
    default:
      return;
  }

  // Add shape to canvas
  canvas.add(shapeObject);
  canvas.setActiveObject(shapeObject);
  canvas.renderAll();
};


  // Lock shape functionality
  const lockShape = () => {
    activeObject.lockMovementX = true;
    activeObject.lockMovementY = true;
    activeObject.lockScalingX = true;
    activeObject.lockScalingY = true;
    activeObject.lockRotation = true;
    setIsLocked(true); // Set lock state to true
    // alert("Shape locked!");
  };

  // Unlock shape functionality
  const unlockShape = () => {
    activeObject.lockMovementX = false;
    activeObject.lockMovementY = false;
    activeObject.lockScalingX = false;
    activeObject.lockScalingY = false;
    activeObject.lockRotation = false;
    setIsLocked(false); // Set lock state to false
    // alert("Shape unlocked!");
  };

  // Delete shape functionality
  const deleteShape = () => {
    fabricCanvas.remove(activeObject);
    setTooltipStyle({ ...tooltipStyle, display: "none" }); // Hide tooltip after deletion
  };

  // Duplicate shape functionality
  const duplicateShape = () => {

    var object = fabric.util.object.clone(activeObject);
    object.set("top", object.top+20);
    object.set("left", object.left+20);
     fabricCanvas.add(object);



  
    setTooltipStyle({ ...tooltipStyle, display: "none" }); // Hide tooltip after duplication
  };

  // Send object forward
  const bringObjectForward = () => {
    fabricCanvas.bringToFront(activeObject); 
    fabricCanvas.discardActiveObject();
    fabricCanvas.requestRenderAll();
    setTooltipStyle({ ...tooltipStyle, display: "none" }); // Hide tooltip after action
  };

  // Send object backward
  const sendObjectBackward = () => {
    fabricCanvas.sendToBack(activeObject);
    fabricCanvas.discardActiveObject();
    fabricCanvas.requestRenderAll();
    setTooltipStyle({ ...tooltipStyle, display: "none" }); // Hide tooltip after action
  };

  // Run the tooltip positioning when the active object changes
  useEffect(() => {
    updateTooltipPosition();
  }, [activeObject]);

  


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
