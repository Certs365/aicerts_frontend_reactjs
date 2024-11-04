import React, { useState } from 'react'
import template from "../../public/templateAsset/template.png";
import shapes from "../../public/templateAsset/shapes.png";
import text from "../../public/templateAsset/text.png";
import image from "../../public/templateAsset/image.png";
import background from "../../public/templateAsset/background.png";
import canvas from "../../public/templateAsset/canvas.png";
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
import Image from "next/image";
const TemplateSidebarSlider = ({ type, open, setOpen, setAddRect }) => {
    const types = type;
    console.log(types);

    const content = () => {
        if (types === "templates") {
            return (
                <div className="sliders">
                    <div className="slider-container">
                        {/* Headline */}
                        <div className="headline" onClick={() => setOpen(false)}>
                            <h4>
                                <b>Templates</b>
                            </h4>
                            <div className='close'>
                                <Image width={20} height={20} src={close} alt="close" />
                            </div>
                        </div>
                        {/* tabs */}
                        <div className="multi-tab">
                            <div>
                                <h5>
                                    <b>Designed</b>
                                </h5>
                            </div>
                            <div>
                                <h5>
                                    <b>Your Saves</b>
                                </h5>
                            </div>
                        </div>
                        {/* search box */}
                        <div className="search-box">
                            <div className="search-icon">
                                <Image
                                    width={15}
                                    height={15}
                                    src={search_icon}
                                    alt="search"
                                />
                            </div>
                            <input
                                type="text"
                                name="search"
                                id="search"
                                placeholder="Search..."
                            />
                        </div>
                        {/* image-grid */}
                        <div className="image-grid">
                            <div className="grid-box">
                                <Image
                                    width={65}
                                    height={60}
                                    src={checker}
                                    alt="skeleton"
                                />
                            </div>
                            <div className="grid-box">
                                <Image
                                    width={65}
                                    height={60}
                                    src={checker}
                                    alt="skeleton"
                                />
                            </div>
                            <div className="grid-box">
                                <Image
                                    width={65}
                                    height={60}
                                    src={checker}
                                    alt="skeleton"
                                />
                            </div>

                            <div className="grid-box">
                                <Image
                                    width={65}
                                    height={60}
                                    src={checker}
                                    alt="skeleton"
                                />
                            </div>
                            <div className="grid-box">
                                <Image
                                    width={65}
                                    height={60}
                                    src={checker}
                                    alt="skeleton"
                                />
                            </div>
                            <div className="grid-box">
                                <Image
                                    width={65}
                                    height={60}
                                    src={checker}
                                    alt="skeleton"
                                />
                            </div>

                            <div className="grid-box">
                                <Image
                                    width={65}
                                    height={60}
                                    src={checker}
                                    alt="skeleton"
                                />
                            </div>
                            <div className="grid-box">
                                <Image
                                    width={65}
                                    height={60}
                                    src={checker}
                                    alt="skeleton"
                                />
                            </div>
                            <div className="grid-box">
                                <Image
                                    width={65}
                                    height={60}
                                    src={checker}
                                    alt="skeleton"
                                />
                            </div>

                            <div className="grid-box">
                                <Image
                                    width={65}
                                    height={60}
                                    src={checker}
                                    alt="skeleton"
                                />
                            </div>
                            <div className="grid-box">
                                <Image
                                    width={65}
                                    height={60}
                                    src={checker}
                                    alt="skeleton"
                                />
                            </div>
                            <div className="grid-box">
                                <Image
                                    width={65}
                                    height={60}
                                    src={checker}
                                    alt="skeleton"
                                />
                            </div>

                            <div className="grid-box">
                                <Image
                                    width={65}
                                    height={60}
                                    src={checker}
                                    alt="skeleton"
                                />
                            </div>
                            <div className="grid-box">
                                <Image
                                    width={65}
                                    height={60}
                                    src={checker}
                                    alt="skeleton"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
        else if (types === "images") {
            return (
                <div className="sliders">
                    <div className="slider-container">
                        {/* Headline */}
                        <div className="headline">
                            <h4>
                                <b>Images</b>
                            </h4>
                            <div className="close" onClick={() => setOpen(false)}>
                                <Image width={20} height={20} src={close} alt="close" />
                            </div>
                        </div>
                        {/* upload image */}
                        <div className="upload-image">
                            <div className="brownbg">
                                <div className="dotted-border">
                                    <div className="upload-container">
                                        <div>
                                            <Image
                                                width={30}
                                                height={30}
                                                src={image_icon}
                                                alt="upload"
                                            />
                                        </div>
                                        <h6>Upload Image(s)</h6>
                                    </div>
                                </div>
                            </div>
                            <div style={{ height: "0.625rem" }}></div>
                        </div>
                        {/* tabs */}
                        <div className="multi-tab">
                            <div>
                                <h5>
                                    <b>Images</b>
                                </h5>
                            </div>
                            <div>
                                <h5>
                                    <b>Your Uploads</b>
                                </h5>
                            </div>
                        </div>
                        {/* search box */}
                        <div className="search-box">
                            <div className="search-icon">
                                <Image width={15} height={15} src={search_icon} alt="search" />
                            </div>
                            <input
                                type="text"
                                name="search"
                                id="search"
                                placeholder="Search..."
                            />
                        </div>
                        {/* image-grid */}
                        <div className="image-grid">
                            <div className="grid-box">
                                <Image width={65} height={60} src={checker} alt="skeleton" />
                            </div>
                            <div className="grid-box">
                                <Image width={65} height={60} src={checker} alt="skeleton" />
                            </div>
                            <div className="grid-box">
                                <Image width={65} height={60} src={checker} alt="skeleton" />
                            </div>

                            <div className="grid-box">
                                <Image width={65} height={60} src={checker} alt="skeleton" />
                            </div>
                            <div className="grid-box">
                                <Image width={65} height={60} src={checker} alt="skeleton" />
                            </div>
                            <div className="grid-box">
                                <Image width={65} height={60} src={checker} alt="skeleton" />
                            </div>

                            <div className="grid-box">
                                <Image width={65} height={60} src={checker} alt="skeleton" />
                            </div>
                            <div className="grid-box">
                                <Image width={65} height={60} src={checker} alt="skeleton" />
                            </div>
                            <div className="grid-box">
                                <Image width={65} height={60} src={checker} alt="skeleton" />
                            </div>
                            <div className="grid-box">
                                <Image width={65} height={60} src={checker} alt="skeleton" />
                            </div>
                            <div className="grid-box">
                                <Image width={65} height={60} src={checker} alt="skeleton" />
                            </div>
                        </div>

                    </div>
                </div>
            )
        }
        else if (types === "shapes") {
            return (
                <div className="sliders">
                    <div className="slider-container">
                        {/* Headline */}
                        <div className="headline">
                            <h4>
                                <b>Shapes</b>
                            </h4>
                            <div className="close" onClick={() => setOpen(false)}>
                                <Image width={20} height={20} src={close} alt="close" />
                            </div>
                        </div>
                        {/* image-grid */}
                        {/* image-grid */}
                        <div className="image-grid">
                            <div className="grid-box" onClick={() => setAddRect(true)}>
                                <Image width={65} height={60} src={checker} alt="skeleton" />
                            </div>
                            <div className="grid-box">
                                <Image width={65} height={60} src={checker} alt="skeleton" />
                            </div>
                            <div className="grid-box">
                                <Image width={65} height={60} src={checker} alt="skeleton" />
                            </div>

                            <div className="grid-box">
                                <Image width={65} height={60} src={checker} alt="skeleton" />
                            </div>
                            <div className="grid-box">
                                <Image width={65} height={60} src={checker} alt="skeleton" />
                            </div>
                            <div className="grid-box">
                                <Image width={65} height={60} src={checker} alt="skeleton" />
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
        else if (types === "background") {
            return (
                <div className="sliders">
                    <div className="slider-container">
                        {/* Headline */}
                        <div className="headline">
                            <h4>
                                <b>Backgrounds</b>
                            </h4>
                            <div className="close" onClick={() => setOpen(false)}>
                                <Image width={20} height={20} src={close} alt="close" />
                            </div>
                        </div>
                        {/* tabs */}
                        <div className="multi-tab">
                            <div>
                                <h5>
                                    <b>Images</b>
                                </h5>
                            </div>
                            <div>
                                <h5>
                                    <b>Your Upload</b>
                                </h5>
                            </div>
                        </div>
                        {/* search box */}
                        <div className="search-box">
                            <div className="search-icon">
                                <Image width={15} height={15} src={search_icon} alt="search" />
                            </div>
                            <input
                                type="text"
                                name="search"
                                id="search"
                                placeholder="Search..."
                            />
                        </div>
                        {/* image-grid */}
                        {/* image-grid */}
                        <div className="image-grid">
                            <div className="grid-box">
                                <Image width={65} height={60} src={checker} alt="skeleton" />
                            </div>
                            <div className="grid-box">
                                <Image width={65} height={60} src={checker} alt="skeleton" />
                            </div>
                            <div className="grid-box">
                                <Image width={65} height={60} src={checker} alt="skeleton" />
                            </div>

                            <div className="grid-box">
                                <Image width={65} height={60} src={checker} alt="skeleton" />
                            </div>
                            <div className="grid-box">
                                <Image width={65} height={60} src={checker} alt="skeleton" />
                            </div>
                            <div className="grid-box">
                                <Image width={65} height={60} src={checker} alt="skeleton" />
                            </div>
                            <div className="grid-box">
                                <Image width={65} height={60} src={checker} alt="skeleton" />
                            </div>
                            <div className="grid-box">
                                <Image width={65} height={60} src={checker} alt="skeleton" />
                            </div>
                            <div className="grid-box">
                                <Image width={65} height={60} src={checker} alt="skeleton" />
                            </div>
                            <div className="grid-box">
                                <Image width={65} height={60} src={checker} alt="skeleton" />
                            </div>
                            <div className="grid-box">
                                <Image width={65} height={60} src={checker} alt="skeleton" />
                            </div>
                        </div>
                    </div>
                </div>

            )
        }
    }

    // const [open, setOpen] = useState(false);
    return (
        <>
            {content()}
        </>
    )
}

export default TemplateSidebarSlider;
