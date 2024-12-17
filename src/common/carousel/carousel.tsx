import Image from "next/image";
import React from "react";
import Slider from "react-slick";

interface ImageSliderProps {
    images: string[];
    height?: number | string;
    width?: number | string;
    wrapperClassName?: string; // Optional className for the slider wrapper
    sliderSettings?: object; // Optional additional settings for the slider
}

const ImageSlider: React.FC<ImageSliderProps> = ({
    images,
    height = 550,
    width = 550,
    wrapperClassName,
    sliderSettings,
}) => {
    const defaultSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        height: height
    };

    return (
        <div
            className={wrapperClassName}
            style={{ width: "100%", height }}
        >
            <Slider {...defaultSettings}>
                {images.map((image, index) => (
                    <div key={index} style={{ position: "relative", height }}>
                        <Image
                            src={"https://img.freepik.com/premium-photo/best-thousand-vintage-carousel-night-royalty-picture-ai-generated-art_853163-10493.jpg"}
                            alt={`Slide ${index + 1}`}
                            height={550}
                            width={550}
                            objectFit="cover" // Ensure the image fills the container
                            priority
                        />
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default ImageSlider;
