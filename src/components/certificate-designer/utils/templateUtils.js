import * as fabric from "fabric"
// Function to set background image on canvas
 export const setBackgroundImage = async (imageUrl, canvas) => {
    if (!canvas) return;
    try {
      console.log("calling");
      const img = await fabric.FabricImage.fromURL(imageUrl,{
        crossOrigin: "anonymous",
      });
      // Calculate scale factors for width and height
      const scaleX = canvas.width / img.width;
      const scaleY = canvas.height / img.height;
      const scale = Math.max(scaleX, scaleY);
      img.scale(scale);
      img.set({
        left: (canvas.width - img.width * scale) / 2, // Center horizontally
        top: (canvas.height - img.height * scale) / 2, // Center vertically
      });

      canvas.backgroundImage = img;
      canvas.renderAll();
    } catch (error) {
      console.log(error);
    }
  };

  export  const setImage = async (imageUrl, canvas) => {
    if (!canvas) return;

    try {
      console.log("Adding image to canvas");

      // Load the image as a Fabric image object
      const img = await fabric.FabricImage.fromURL(imageUrl,{
        crossOrigin: "anonymous",
      });
      canvas.add(img);
      canvas.renderAll(); // Re-render the canvas to update
    } catch (error) {
      console.log("Error adding image to canvas:", error);
    }
  };