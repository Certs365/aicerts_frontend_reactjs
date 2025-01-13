import { fabric } from "fabric";

// Function to set background image on canvas
export const setBackgroundImage = (imageUrl, canvas) => {
  if (!canvas) return;
  try {
    console.log("calling");
    localStorage.setItem("backgroundImageUrl", imageUrl)
    fabric.Image.fromURL(
      imageUrl,
      (img) => {
        // const scaleX = canvas.width / img.width;
        // const scaleY = canvas.height / img.height;
        // const scale = Math.max(scaleX, scaleY);
        // img.scale(scale);
        // img.set({
        //   left: (canvas.width - img.width * scale) / 2, // Center horizontally
        //   top: (canvas.height - img.height * scale) / 2, // Center vertically
        // });

        canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
          scaleX: canvas.width / img.width,
          scaleY: canvas.height / img.height,
        });
      },
      {
        crossOrigin: "anonymous",
      }
    );

    // Calculate scale factors for width and height

    canvas.renderAll();
  } catch (error) {
    console.log(error);
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
