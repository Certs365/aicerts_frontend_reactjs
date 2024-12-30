import React from "react";
import A from "../../public/templateAsset/A.png";
import left_align from "../../public/templateAsset/left_align.png";
import center_align from "../../public/templateAsset/center_align.png";
import right_align from "../../public/templateAsset/right_align.png";
import evenly_align from "../../public/templateAsset/evenly_align.png";
import canvas_bottom_color from "../../public/templateAsset/canvas_bottom_color.png";

import Image from "next/image";
const TextCanvasSettings = ({
  type,

  handleText,
  handleCanvas,
  setText,
  setCanvas,
}) => {
  const content = () => {
    if (type === "text") {
      return (
        <div className="text-settings">
          <div className="text-settings-container">
            {/* font dropdown */}
            <div className="font-dropdown">
              <select name="Select your font" id="fontSelect">
                <option value="Arial">Arial</option>
                <option value="Verdana">Verdana</option>
                <option value="Tahoma">Tahoma</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Terminal">Terminal</option>
                <option value="sans">Sans</option>
                <option value="Gill Sans">Gill Sans</option>
                <option value="Calibri">Calibri</option>
                <option value="Bell MT">Bell MT</option>
              </select>
            </div>
            {/* size dropdown */}
            <div className="size-dropdown">
              <select name="Size" id="sizeInput">
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="4">4</option>
                <option value="6">6</option>
                <option value="8">8</option>
                <option value="12">12</option>
                <option value="16">16</option>
                <option value="24">24</option>
                <option value="32">32</option>
              </select>
            </div>
            {/* font color */}
            <div className="text-height-container">
              <div className="text-aligner">
                <Image width={20} height={20} src={A} alt={"A"} />
                {/* <input type="color" id="fontColorPicker" /> */}
              </div>
            </div>
            {/* left align */}
            <div className="text-height-container">
              <div className="text-aligner">
                <Image width={20} height={20} src={left_align} alt={"left"} />
              </div>
            </div>
            {/* center align */}
            <div className="text-height-container">
              <div className="text-aligner">
                <Image
                  width={20}
                  height={20}
                  src={center_align}
                  alt={"center"}
                />
              </div>
            </div>
            {/* right align */}
            <div className="text-height-container">
              <div className="text-aligner">
                <Image width={20} height={20} src={right_align} alt={"right"} />
              </div>
            </div>
            {/* evenly align */}
            <div className="text-height-container">
              <div className="text-aligner">
                <Image
                  width={20}
                  height={20}
                  src={evenly_align}
                  alt={"evenly"}
                />
              </div>
            </div>
          </div>
        </div>
      );
    } else if (type === "canvas") {
      return (
        <div className="canvas-settings">
          <div className=" canvas-settings-container">
            {/* canvas title */}
            <div className="canvas-title-aligner">Canvas:</div>
            {/* font dropdown */}
            <div className="font-dropdown">
              <select name="Select your font" id="fontSelect">
                <option value="twitter">Twitter (1024x512)</option>
                <option value="instagram">Instagram (1080x1080)</option>
                <option value="facebook">Facebook (1200x630)</option>
                <option value="youtube">Youtube (2560x1440)</option>
                <option value="pinterest">Pinterest (1000x1500)</option>
                <option value="tumblr">Tumblr (540x810)</option>
              </select>
            </div>
            {/* font color */}
            <div className="canvas-height-container">
              <div className="canvas-aligner">
                <Image
                  width={20}
                  height={20}
                  src={canvas_bottom_color}
                  alt={"A"}
                />
              </div>
            </div>
          </div>
        </div>
      );
    }
  };
  return <>{content()}</>;
};

export default TextCanvasSettings;
