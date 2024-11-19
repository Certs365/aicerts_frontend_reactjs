import React, { useEffect, useRef, useState } from "react";

const ShapeEditPanel = ({
  onBgColorChange,
  onBorderColorChange,
  onBorderRadiusChange,
  onBorderWeightChange,
  onTransparencyChange,
  shapeStyles,
}) => {
  const bgColorRef = useRef(null);
  const borderColorRef = useRef(null);
  const [filledCircleStyle, setFilledCircleStyle] = useState({});
  const [outlinedCircleStyle, setOutlinedCircleStyle] = useState({});

  useEffect(() => {
    console.log(shapeStyles)
    setFilledCircleStyle({
      backgroundColor: `${shapeStyles.bgColor}`,
      borderRadius: "50%",
      border: `${shapeStyles.borderWeight}px solid ${shapeStyles.borderColor}`,
      opacity: shapeStyles.transparency,
      width: "40px",
      height: "40px",
    });

    setOutlinedCircleStyle({
      backgroundColor: "transparent",
      borderRadius: "50%",
      border: `${shapeStyles.borderWeight}px solid ${shapeStyles.borderColor}`,
      opacity: shapeStyles.transparency,
      width: "40px",
      height: "40px",
    });
  }, [shapeStyles]);


  return (
    <div className="d-flex gap-3 align-items-center shape-edit-panel bg-white w-100 p-2">
      <div className="d-flex gap-2">
        {/* Filled Circle */}
        <div
          onClick={() => bgColorRef.current.click()}
          style={filledCircleStyle}
        ></div>

        {/* Outlined Circle */}
        <div
          onClick={() => borderColorRef.current.click()}
          style={outlinedCircleStyle}
        ></div>
      </div>
      {/* Background Color */}
      <input
        style={{ display: "none" }}
        ref={bgColorRef}
        type="color"
        value={shapeStyles.bgColor || "#000000"} // default to black if undefined
        onInput={onBgColorChange}
      />

      {/* Border Color */}
      <input
        style={{ display: "none", }}
        ref={borderColorRef}
        type="color"
        value={shapeStyles.borderColor || "#000000"} // default to black if undefined
        onInput={onBorderColorChange}
        
      />

      {/* Border Radius */}
      {/* <input type="number"  min="0" max={"10"} step="1" value={shapeStyles.borderRadius} onInput={(e) => onBorderRadiusChange(e.target.value)} placeholder="Border Radius" /> */}

      {/* Border Weight */}
      <input
        type="number"
        min="0"
        max={"10"}
        step="1"
        value={shapeStyles.borderWeight || 1} // default to 1 if undefined
        onInput={(e) => onBorderWeightChange(e.target.value)}
        placeholder="Border Weight"
        
      />

      {/* Transparency */}
      <label className="d-flex align-items-center gap-2">
        <span>Transparency:</span>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={shapeStyles.transparency || 1} // default to 1 if undefined
          onInput={(e) => onTransparencyChange(parseFloat(e.target.value))}
        />
      </label>
    </div>
  );
};

export default ShapeEditPanel;
