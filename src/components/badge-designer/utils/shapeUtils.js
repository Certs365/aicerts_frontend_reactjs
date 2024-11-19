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
          case "Badge1":
            shapeObject = new Path('M 280.304,124.411h-7.05v-7.006c0-2.761-2.239-5-5-5h-19.102v-1.323c0-2.761-2.239-5-5-5h-203c-2.761,0-5,2.239-5,5v1.323H17.05c-2.761,0-5,2.239-5,5v7.006H5c-2.761,0-5,2.239-5,5v44.811c0,2.761,2.239,5,5,5h24.101c2.761,0,5-2.239,5-5v-7.007h7.051c2.761,0,5-2.239,5-5v-1.323h193v1.323c0,2.761,2.239,5,5,5h7.051v7.007c0,2.761,2.239,5,5,5h24.101c2.761,0,5-2.239,5-5v-44.811C285.304,126.65,283.065,124.411,280.304,124.411z M24.101,169.222H10v-34.811h2.05v27.804c0,2.761,2.239,5,5,5h7.051V169.222z');
            var scale1 = 100 / shapeObject.width;
            shapeObject.set({
              left: 50,
              top: 50,
              scaleX: scale1,
              scaleY: scale1,
              fill: 'none',
            });
            break;
      
          case "Badge2":
            shapeObject = new Path('M305.917,150.268c-0.657-1.152-1.745-1.996-3.024-2.345l-4.124-1.128c-9.656-2.642-19.4-4.929-29.208-6.881l3.648-13.334c0.729-2.664-0.84-5.414-3.503-6.142l-4.125-1.128c-36.56-10.002-74.342-15.073-112.295-15.073c-37.953,0-75.733,5.071-112.293,15.073l-4.125,1.128c-2.664,0.729-4.232,3.479-3.503,6.142l3.648,13.334c-9.807,1.951-19.551,4.239-29.207,6.881l-4.124,1.128c-1.279,0.35-2.367,1.193-3.024,2.345c-0.657,1.152-0.83,2.518-0.479,3.797l12.199,44.592c0.35,1.279,1.193,2.367,2.346,3.024c0.761,0.434,1.616,0.657,2.477,0.657c0.442,0,0.886-0.059,1.319-0.177l4.125-1.128c31.729-8.68,64.519-13.081,97.457-13.081h0.854c1.342,0,2.628-0.54,3.568-1.497c0.94-0.958,1.456-2.253,1.431-3.595l-0.395-21.339c9.218-0.693,18.467-1.054,27.729-1.054c9.262,0,18.511,0.361,27.729,1.054l-0.395,21.339c-0.025,1.342,0.491,2.637,1.431,3.595c0.94,0.958,2.226,1.497,3.568,1.497h0.854c32.938,0,65.727,4.401,97.457,13.081l4.125,1.128c0.434,0.119,0.877,0.177,1.319,0.177c0.861,0,1.716-0.223,2.477-0.657c1.152-0.657,1.996-1.745,2.346-3.024l12.199-44.592C306.746,152.785,306.573,151.419,305.917,150.268z');
            var scale2 = 100 / shapeObject.width;
            shapeObject.set({
              left: 50,
              top: 50,
              scaleX: scale2,
              scaleY: scale2,
              fill: 'none',
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
