import React, { useState } from "react";
import template from "../../public/templateAsset/template.png";
import shapes from "../../public/templateAsset/shapes.png";
import text_img from "../../public/templateAsset/text.png";
import image from "../../public/templateAsset/image.png";
import background from "../../public/templateAsset/background.png";
import canvas_img from "../../public/templateAsset/canvas.png";
import back from "../../public/templateAsset/back.png";
import checker from "../../public/templateAsset/checker.png";
import close from "../../public/templateAsset/close.png";
import search_icon from "../../public/templateAsset/search_icon.png";
import image_icon from "../../public/templateAsset/image_icon.png";

import A from "../../public/templateAsset/A.png";
import left_align from "../../public/templateAsset/left_align.png";
import center_align from "../../public/templateAsset/center_align.png";
import right_align from "../../public/templateAsset/right_align.png";
import evenly_align from "../../public/templateAsset/evenly_align.png";
import logo_certs365 from "../../public/templateAsset/logo_certs365.png";
import canvas_bottom_color from "../../public/templateAsset/canvas_bottom_color.png";

import TemplateSidebarSlider from "./template-sidebar-slider";
import TextCanvasSettings from "./text-canvas-settings";
import Image from "next/image";
const Template = () => {
  const [open, setOpen] = useState(true);
  const [sidebarOption, setSidebarOption] = useState("");
  const [text, setText] = useState(false);
  const [canvas, setCanvas] = useState(false);

  const handleText = () => {
    setText(!text);
  }
  const handleCanvas = () => {
    setCanvas(!canvas);
  }

  return (
    <>

      <main>
        <div className="main-content">
          <div className="d-flex flex-row ">
            <div className="sidebar">
              <div className="tools">
                <div className="tools-box" onClick={() => { open ? setOpen(false) : setOpen(true); setSidebarOption("templates"); }} >
                  <Image width={20} height={20} src={template} alt="Templates" />
                  <p>Templates</p>
                </div>
                <div className="tools-box" onClick={() => { open ? setOpen(false) : setOpen(true); setSidebarOption("shapes"); }} >
                  <Image width={20} height={20} src={shapes} alt="Shapes" />
                  <p>Shapes</p>
                </div>
                <div className="tools-box" onClick={() => { open ? setOpen(false) : setOpen(true); setSidebarOption("canvas"); }}>
                  <Image width={20} height={20} src={text_img} alt="Text" />
                  <p>Texts</p>
                </div>
                <div className="tools-box" onClick={() => { open ? setOpen(false) : setOpen(true); setSidebarOption("images"); }}>
                  <Image width={20} height={20} src={image} alt="Image" />
                  <p>Images</p>
                </div>
                <div className="tools-box" onClick={() => { open ? setOpen(false) : setOpen(true); setSidebarOption("background"); }}>
                  <Image width={20} height={20} src={background} alt="Background" />
                  <p>Background</p>
                </div>
                <div className="tools-box" onClick={() => { open ? setOpen(false) : setOpen(true); setSidebarOption("canvas"); }}>
                  <Image width={20} height={20} src={canvas_img} alt="Canvas" />
                  <p>Canvas</p>
                </div>
              </div>
              <div className="back">
                <div className="tools-box">
                  <Image width={20} height={20} src={back} alt="Back" />
                  <p>Back</p>
                </div>
              </div>
            </div>
            <div className={`${open ? "active-sidebar" : ""} sidebar-div`}>
              {/* templates */}
              <TemplateSidebarSlider type={sidebarOption} open={open} setOpen={setOpen} />
            </div>
          </div>

          <div className="canvas-content ">
            <div className="top-bar">
              <div>
                <TextCanvasSettings type={sidebarOption} setText={setText} setCanvas={setCanvas} handleText={handleText} handleCanvas={handleCanvas} />
              </div>

              <div className="move-to">
                <div className="right-text">
                  <Image
                    width={20}
                    height={20}
                    src={logo_certs365}
                    alt={"logo"}
                  />
                  <div>Move to CERTs 365</div>
                </div>
              </div>
            </div>
            <div className="canvas-wrapper">
              <div className="canvas"></div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Template;
