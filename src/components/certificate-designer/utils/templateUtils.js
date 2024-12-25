import { fabric } from "fabric";

// Function to set background image on canvas
export const setBackgroundImage = (imageUrl, canvas) => {
  if (!canvas) return;

  try {
    fabric.Image.fromURL(
      imageUrl,
      (img) => {
        // Original image dimensions
        let imgWidth = img.width;
        let imgHeight = img.height;

        // Max canvas dimensions
        const maxCanvasWidth = 900;
        const maxCanvasHeight = 480;

        // Calculate scaling factors
        const widthScale = maxCanvasWidth / imgWidth;
        const heightScale = maxCanvasHeight / imgHeight;

        // Determine the scale factor to fit the image inside the canvas
        const scaleFactor = Math.min(widthScale, heightScale, 1);

        // Apply scaling to image dimensions
        const scaledImgWidth = imgWidth * scaleFactor;
        const scaledImgHeight = imgHeight * scaleFactor;

        // Set canvas dimensions to match the scaled image dimensions
        canvas.setWidth(scaledImgWidth);
        canvas.setHeight(scaledImgHeight);

        // Calculate exact scaling to perfectly match the canvas
        const scaleX = scaledImgWidth / img.width;
        const scaleY = scaledImgHeight / img.height;

        // Center alignment: Use origin "center" and adjust positions
        canvas.setBackgroundImage(
          img,
          canvas.renderAll.bind(canvas),
          {
            scaleX: scaleX,
            scaleY: scaleY,
            originX: "center", // Align from center horizontally
            originY: "center", // Align from center vertically
            left: canvas.getWidth() / 2, // Center horizontally
            top: canvas.getHeight() / 2, // Center vertically
          }
        );

        // Render the canvas to apply changes
        canvas.renderAll();
      },
      {
        crossOrigin: "anonymous", // Ensure cross-origin compatibility
      }
    );
  } catch (error) {
    console.error("Error setting background image:", error);
  }
};






export const setImage = (imageUrl, canvas) => {
  if (!canvas) return;

  try {
    console.log("Adding image to canvas");

    // Load the image as a Fabric image object
    fabric.Image.fromURL(
      imageUrl,
      function (img) {
        img.set({
          left: canvas.width / 2 - 50,
          top: canvas.height / 2 - 30,
          angle: 0,
          // padding: 10,
          cornersize: 10,
          hasRotatingPoint: false,
        });
        img.scaleToWidth(100);
        img.scaleToHeight(100);
        canvas.add(img);
      },

      {
        crossOrigin: "anonymous",
      }
    );

    canvas.renderAll(); // Re-render the canvas to update
  } catch (error) {
    console.log("Error adding image to canvas:", error);
  }
};
