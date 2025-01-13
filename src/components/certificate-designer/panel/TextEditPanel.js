import React from 'react';
import { FaBold, FaItalic, FaUnderline, FaAlignLeft, FaAlignCenter, FaAlignRight } from 'react-icons/fa';

const TextEditPanel = ({
  onFontStyleChange,
  onBoldToggle,
  onItalicToggle,
  onUnderlineToggle,
  onTransparencyChange,
  onTextColorChange,
  textStyles, // Pass the textStyles object
  onAlignLeft,
  onAlignCenter,
  onAlignRight,
}) => {
  return (
    <div className="d-flex gap-3 align-items-center text-edit-panel "
    style={{boxShadow: "rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px", padding:"5px" }}>
      {/* Font Style Dropdown */}
      <span onClick={onFontStyleChange} className="font-style-btn">Font Style</span>

      {/* Bold, Italic, Underline Controls */}
      <button onClick={onBoldToggle} className={`btn ${textStyles.isBold ? ' active-btn' : 'non-active'}`}><FaBold /></button>
      <button onClick={onItalicToggle} className={`btn ${textStyles.isItalic ? 'active-btn' : 'non-active'}`}><FaItalic /></button>
      <button onClick={onUnderlineToggle} className={`btn ${textStyles.isUnderline ? 'active-btn' : 'non-active'}`}><FaUnderline /></button>

      {/* Text Color */}
      <input
        type="color"
        value={textStyles.color} // Bind color to textStyles
        onInput={onTextColorChange}
        className="form-control-color"
        style={{border:"none", background:"none" , }}
      />

      {/* Text Alignment */}
      <button onClick={onAlignLeft} className={`btn ${textStyles.alignment === 'left' ? 'active-btn' : 'non-active'}`}><FaAlignLeft /></button>
      <button onClick={onAlignCenter} className={`btn ${textStyles.alignment === 'center' ? 'active-btn' : 'non-active'}`}><FaAlignCenter /></button>
      <button onClick={onAlignRight} className={`btn ${textStyles.alignment === 'right' ? 'active-btn' : 'non-active'}`}><FaAlignRight /></button>

      {/* Transparency Control */}
      <label className="d-flex align-items-center gap-2">
        <span style={{color:'#CFA935'}}>Transparency:</span>
        <input
       
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={textStyles.transparency} // Bind slider position to transparency state
          onChange={(e) => onTransparencyChange(parseFloat(e.target.value))} // Parse to float
          className="transparency-slider" // Add this class
        />
      </label>
    </div>
  );
};

export default TextEditPanel;
