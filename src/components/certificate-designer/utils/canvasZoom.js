export const zoomCanvas = (zoomIn = true , canvas) => {
   
    if (!canvas) return;

    const newZoom = zoomIn ? zoomLevel + 0.1 : zoomLevel - 0.1;

    // Ensure zoom stays within limits
    if (newZoom > 3 || newZoom < 0.5) return;

    setZoomLevel(newZoom); // Update the zoom level state
    canvas.setZoom(newZoom);

    // Center the viewport after zoom
    canvas.viewportTransform[4] = 0; // Reset X translation
    canvas.viewportTransform[5] = 0; // Reset Y translation
    canvas.renderAll();
  };