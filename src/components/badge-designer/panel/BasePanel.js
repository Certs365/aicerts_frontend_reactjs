// src/components/certificate-designer/panel/ShapesPanel.js
import React from "react";
import { Circle, DownArrow, Heart, LeftArrow, PolygonShape, Rectangle, RightArrow, Square, Star, UpArrow } from "../shapes/Shapes";

const ShapesPanel = ({ onAddShape }) => {
    return (
      <div>
        {/* <h4>Select Shape</h4> */}
        <div className="d-flex flex-wrap justify-content-around mt-3">
          {[
            { Component: Rectangle, label: "Rectangle" },
            { Component: PolygonShape, label: "Polygon" },
            { Component: Heart, label: "Heart" },
            { Component: Star, label: "Star" },
            { Component: Circle, label: "Circle" },
            { Component: Square, label: "Square" },
            { Component: UpArrow, label: "UpArrow" },
            { Component: DownArrow, label: "DownArrow" },
            { Component: LeftArrow, label: "LeftArrow" },
            { Component: RightArrow, label: "RightArrow" },

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
