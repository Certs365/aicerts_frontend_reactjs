import React, { useEffect, useState } from 'react';

const CanvasSetting = ({ canvas, onScaleCanvas }) => {
    const [canvasHeight, setCanvasHeight] = useState(500);
    const [canvasWidth, setCanvasWidth] = useState(900);
    const maxCanvasWidth = 900;
    const maxCanvasHeight = 500;
    const scaleStep = 0.1;

    useEffect(() => {
        if (canvas) {
            canvas.setWidth(canvasWidth);
            canvas.setHeight(canvasHeight);
            canvas.renderAll();
            // Call the scaling function from Designer to resize objects proportionally
            onScaleCanvas(canvasWidth / maxCanvasWidth, canvasHeight / maxCanvasHeight);
        }
    }, [canvasWidth, canvasHeight, canvas]);

    const handleIncreaseSize = () => {
        setCanvasWidth((prevWidth) => Math.min(prevWidth * (1 + scaleStep), maxCanvasWidth));
        setCanvasHeight((prevHeight) => Math.min(prevHeight * (1 + scaleStep), maxCanvasHeight));
    };

    const handleDecreaseSize = () => {
        setCanvasWidth((prevWidth) => Math.max(prevWidth * (1 - scaleStep), maxCanvasWidth * 0.1));
        setCanvasHeight((prevHeight) => Math.max(prevHeight * (1 - scaleStep), maxCanvasHeight * 0.1));
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button onClick={handleDecreaseSize} disabled={canvasWidth <= maxCanvasWidth * 0.1}>
                -
            </button>
            <span>{Math.round((canvasWidth / maxCanvasWidth) * 100)}%</span>
            <button onClick={handleIncreaseSize} disabled={canvasWidth >= maxCanvasWidth}>
                +
            </button>
        </div>
    );
};

export default CanvasSetting;
