// src/components/certificate-designer/panel/ShapesPanel.js
import React, { Component } from "react";
import { Circle, DownArrow, Heart, HorizontalLine, LeftArrow, PolygonShape, Rectangle, RightArrow, Square, Star, UpArrow, VerticalLine } from "../shapes/Shapes";

const ShapesPanel = ({ onAddShape }) => {
    return (
      <div style={{ padding:"5px", marginBottom:"20px" ,height:"30%"}}>
        <h5 style={{color: "#CFA935"}}>Select Shape</h5>
        <div className="d-flex flex-wrap justify-content-around ">
          {[
            { Component: Rectangle, label: "Rectangle" },
            // { Component: PolygonShape, label: "Polygon" },
            // { Component: Heart, label: "Heart" },
            // { Component: Star, label: "Star" },
            { Component: Circle, label: "Circle" },
            { Component: Square, label: "Square" },
            {Component:VerticalLine, label:"VerticalLine"},
            {Component:HorizontalLine, label:"HorizontalLine"},
          
          ].map(({ Component, label }) => (
            <div 
          
              key={label} 
              onClick={() => onAddShape(label)} 
              style={{ cursor: "pointer", margin: "5px", display: "flex", width: "60px", padding:"5px",  }}
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
