// src/components/certificate-designer/panel/ShapesPanel.js
import React from "react";
import { Badge1, Badge2} from "../shapes/Shapes";

const ShapesPanel = ({ onAddShape }) => {
    return (
      <div>
        {/* <h4>Select Shape</h4> */}
        <div className="d-flex flex-wrap justify-content-around mt-3">
          {[
            { Component: Badge1, label: "Rectangle" },
            { Component: Badge2, label: "Polygon" },
            { Component: Badge2, label: "Polygon" },
            { Component: Badge2, label: "Polygon" },
       

          ].map(({ Component, label }) => (
            <div 
              key={label} 
              onClick={() => onAddShape(label)} 
              style={{ cursor: "pointer", margin: "10px", display: "flex", width: "60px", padding:"5px", backgroundColor:"#e5e5e5" }}
              title={label}
            >
              <Component />
            </div>
          ))}
        </div>
      </div>
    );
  };
  

export default ShapesPanel;
