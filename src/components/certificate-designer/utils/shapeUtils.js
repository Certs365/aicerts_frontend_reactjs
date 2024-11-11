import { Path, Polygon, Rect,Circle } from "fabric";


export const onAddShape = (shape,canvas) => {
    if (!canvas) return;
  
    let shapeObject;
    switch (shape) {
      case "Rectangle":
        shapeObject = new Rect({
          width: 100,
          height: 60,
          fill: "none",
          left: 50,
          top: 50,
        });
        break;
        case "Polygon":
      shapeObject = new Polygon([
        {x:50 , y:0},
        {x:100, y:0},
        {x:125, y:50},
        {x:100, y:100},
        {x:50,y:100},
        {x:25,y:50},
        {x:50,y:0}
      ], {
        fill: "none",
        stroke:"black",
        
        left: 50,
        top: 50,
      });
      break;
      case "Heart":
        shapeObject = new Path('M 272.70141,238.71731 \
          C 206.46141,238.71731 152.70146,292.4773 152.70146,358.71731  \
          C 152.70146,493.47282 288.63461,528.80461 381.26391,662.02535 \
          C 468.83815,529.62199 609.82641,489.17075 609.82641,358.71731 \
          C 609.82641,292.47731 556.06651,238.7173 489.82641,238.71731  \
          C 441.77851,238.71731 400.42481,267.08774 381.26391,307.90481 \
          C 362.10311,267.08773 320.74941,238.7173 272.70141,238.71731  \
          z ');    
      var scale = 100 / shapeObject.width;
      shapeObject.set({ left: 20, top: 0, scaleX: scale, scaleY: scale,  fill: 'none', });
        break;
      case "Star":
        shapeObject = new Polygon([
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
          left: 50,
          top: 50,
        });
        break;
        case "Circle":
          shapeObject = new Circle({
            radius: 50,
            fill: "none",
            left: 50,
            top: 50,
          });
          break;
        case "Square":
          shapeObject = new Rect({
            width: 60,
            height: 60,
            fill: "none",
            left: 50,
            top: 50,
          });
          break;
      default:
        return;
    }
  
    // Add shape to canvas
    canvas.add(shapeObject);
    canvas.setActiveObject(shapeObject);
    canvas.renderAll();
  };


export const handleShapeBgColorChange = (canvas, setShapeStyles, updateActiveObjectStyles) => (e) => {
    const activeObject = canvas?.getActiveObject();
    if (activeObject && ["rect", "circle", "polygon"].includes(activeObject.type)) {
        const newColor = e.target.value; // Get new color from event
        activeObject.set({ fill: newColor });
        setShapeStyles((prevStyles) => ({
            ...prevStyles,
            bgColor: newColor,
        }));
        if (updateActiveObjectStyles) updateActiveObjectStyles(activeObject);
        canvas.renderAll();
    }
};

export const handleShapeBorderColorChange = (canvas, setShapeStyles, updateActiveObjectStyles) => (e) => {
    const activeObject = canvas?.getActiveObject();
    if (activeObject && ["rect", "circle", "polygon"].includes(activeObject.type)) {
        const newColor = e.target.value; // Get new color from event
        activeObject.set({ stroke: newColor });
        setShapeStyles((prevStyles) => ({
            ...prevStyles,
            borderColor: newColor,
        }));
        if (updateActiveObjectStyles) updateActiveObjectStyles(activeObject);
        canvas.renderAll();
    }
};

export const handleShapeBorderRadiusChange = (canvas, setShapeStyles, updateActiveObjectStyles) => (value) => {
    const activeObject = canvas?.getActiveObject();
    
    if (activeObject) {
        if (activeObject.type === "rect") {
            // Set rounded corners for rectangles
            activeObject.set({ rx: value, ry: value });
        } else if (activeObject.type === "circle") {
            // Scaling the circle may give a "rounded" appearance, but won't use `borderRadius`
            activeObject.set({ scaleX: 1 + value / 100, scaleY: 1 + value / 100 });
        } else {
            console.warn("Border radius is not supported for this shape type.");
        }

        // Update the shape styles
        setShapeStyles((prevStyles) => ({
            ...prevStyles,
            borderRadius: value,
        }));

        if (updateActiveObjectStyles) updateActiveObjectStyles(activeObject);
        canvas.renderAll();
    }
};


export const handleShapeBorderWeightChange = (canvas, setShapeStyles, updateActiveObjectStyles) => (value) => {
    const activeObject = canvas?.getActiveObject();
    if (activeObject && ["rect", "circle", "polygon"].includes(activeObject.type)) {
        activeObject.set({ strokeWidth: parseInt(value) });
        setShapeStyles((prevStyles) => ({
            ...prevStyles,
            borderWeight: value,
        }));
        if (updateActiveObjectStyles) updateActiveObjectStyles(activeObject);
        canvas.renderAll();
    }
};

export const handleShapeTransparencyChange = (canvas, setShapeStyles, updateActiveObjectStyles) => (value) => {
    const activeObject = canvas?.getActiveObject();
    if (activeObject) {
        activeObject.set({ opacity: value });
        setShapeStyles((prevStyles) => ({
            ...prevStyles,
            transparency: value,
        }));
        if (updateActiveObjectStyles) updateActiveObjectStyles(activeObject);
        canvas.renderAll();
    }
};
