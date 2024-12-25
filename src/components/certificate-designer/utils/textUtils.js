import { fabric } from "fabric";

export const handleAddTextBox = (canvas, text, style) => {
    const textBox = new fabric.Textbox(text, {
      left: canvas.width / 2 - 50,
      top: canvas.height / 2 - 30,
        fontSize: style === 'heading' ? 24 : style === 'subheading' ? 18 : 14,
        fill: '#000',
        fontWeight: style === 'heading' || style === 'subheading' ? 'bold' : 'normal',
        fontFamily: 'Arial', // Use a web-safe font for better rendering
        shadow: {
            color: "#000",
            offsetX: 0,
            offsetY: 0,
            blur: 0,
        },
        editable: true,
        textAlign: "center",
        backgroundColor: "transparent",
    });
    canvas.add(textBox);
    canvas.renderAll();
};

export const handleBoldToggle = (canvas, setTextStyles,updateActiveObjectStyles) => {
    const activeObject = canvas?.getActiveObject();
    if (activeObject && activeObject.type === 'textbox') {
        const isBold = activeObject.fontWeight === 'bold';
        activeObject.set({ fontWeight: isBold ? 'normal' : 'bold' });
           // Update the designer state for bold property
           setTextStyles((prevState) => ({
            ...prevState,
            isBoldActive: !isBold, // Toggle the bold state
        }));
        canvas.renderAll();
        if (updateActiveObjectStyles) updateActiveObjectStyles(activeObject);
    }
};

export const handleItalicToggle = (canvas, setTextStyles,updateActiveObjectStyles) => {
    const activeObject = canvas?.getActiveObject();
    if (activeObject && activeObject.type === 'textbox') {
        const isItalic = activeObject.fontStyle === 'italic';
        activeObject.set({ fontStyle: isItalic ? 'normal' : 'italic' });
        setTextStyles((prevState) => ({
            ...prevState,
            isItalic: !isItalic, // Toggle the bold state
        }));
        canvas.renderAll();
        if (updateActiveObjectStyles) updateActiveObjectStyles(activeObject);
    }
};

export const handleUnderlineToggle = (canvas, setTextStyles,updateActiveObjectStyles) => {
    const activeObject = canvas?.getActiveObject();
    if (activeObject && activeObject.type === 'textbox') {
        const isUnderline = activeObject.underline;
        activeObject.set({ underline: !isUnderline });
        setTextStyles((prevState) => ({
            ...prevState,
            isUnderline: !isUnderline, // Toggle the bold state
        }));
        canvas.renderAll();
        if (updateActiveObjectStyles) updateActiveObjectStyles(activeObject);
    }


};

export const handleTextColorChange = (canvas, color,updateActiveObjectStyles) => {
    const activeObject = canvas?.getActiveObject();
    if (activeObject && activeObject.type === 'textbox') {
        activeObject.set({ fill: color }); // Update text color
        canvas.renderAll();
        if (updateActiveObjectStyles) updateActiveObjectStyles(activeObject);
    }
};


export const handleAlignCenter = (canvas,setTextStyles,updateActiveObjectStyles) => {
    const activeObject = canvas?.getActiveObject();
    if (activeObject && activeObject.type === "textbox") {
      activeObject.set({ textAlign: "center" });
      setTextStyles((prevState) => ({
        ...prevState,
        alignment: "center", // Toggle the bold state
    }));
      canvas.renderAll();
      if (updateActiveObjectStyles) updateActiveObjectStyles(activeObject);
    }
  };

  export const handleAlignRight = (canvas,setTextStyles,updateActiveObjectStyles) => {
    const activeObject = canvas?.getActiveObject();
    if (activeObject && activeObject.type === "textbox") {
      activeObject.set({ textAlign: "right" });
      setTextStyles((prevState) => ({
        ...prevState,
        alignment: "right", // Toggle the bold state
    }));
      canvas.renderAll();
      if (updateActiveObjectStyles) updateActiveObjectStyles(activeObject);
    }
  };
  export const handleAlignLeft = (canvas,setTextStyles,updateActiveObjectStyles) => {
    const activeObject = canvas?.getActiveObject();
    if (activeObject && activeObject.type === "textbox") {
      activeObject.set({ textAlign: "left" });
      setTextStyles((prevState) => ({
        ...prevState,
        alignment: "left", // Toggle the bold state
    }));
      canvas.renderAll();
      if (updateActiveObjectStyles) updateActiveObjectStyles(activeObject);
    }
  };


  export const loadFont = async(font) => {
    // Check if the font is already loaded
    if (!document.getElementById(`preload-${font}`)) {
      const link = document.createElement('link');
      link.id = `preload-${font}`;
      link.href = `https://fonts.googleapis.com/css2?family=${font.replace(/ /g, '+')}:wght@400&display=swap`;
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }
  };
