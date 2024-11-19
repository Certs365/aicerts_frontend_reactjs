import { fabric } from "fabric";
function generateLightColorRgb() {
  const red = Math.floor(((1 + Math.random()) * 256) / 2);
  const green = Math.floor(((1 + Math.random()) * 256) / 2);
  const blue = Math.floor(((1 + Math.random()) * 256) / 2);
  return "rgb(" + red + ", " + green + ", " + blue + ")";
}
export const setup = (
  {
    normalBoxCount,
    rotateBoxCount
  }: {
    normalBoxCount: number;
    rotateBoxCount: number;
  } = {
    normalBoxCount: 5,
    rotateBoxCount: 1
  }
): fabric.Canvas => {
  const fabricCanvas = new fabric.Canvas("myCanvas", {
    width: 950,
    height: 600,
    backgroundColor: "white"
  });

  function setupObjects() {
    const outer = new fabric.Rect({
      width: fabricCanvas.getWidth(),
      height: fabricCanvas.getHeight(),
      top: 20,
      left: 20,
      stroke: "#ffffff",
      evented: false,
      fill: "#ececec",
      selectable: false
    });

    // fabricCanvas.add(outer);
    // outer.center();

    const genRect = (
      {
        angle
      }: {
        angle?: number;
      } = { angle: 0 }
    ) => {
      return new fabric.Rect({
        width: Math.floor(Math.random() * 300),
        height: Math.floor(Math.random() * 300),
        top: Math.floor(Math.random() * fabricCanvas.getHeight()),
        left: Math.floor(Math.random() * fabricCanvas.getWidth()),
        fill: generateLightColorRgb(),
        angle: angle,
        myType: "box"
      });
    };

    for (let i = 0; i < normalBoxCount + rotateBoxCount; i++) {
      if (i < rotateBoxCount) {
        fabricCanvas.add(genRect({ angle: Math.floor(Math.random() * 360) }));
      } else {
        fabricCanvas.add(genRect());
      }
    }
    let allBoxes = new fabric.ActiveSelection(
      fabricCanvas.getObjects().filter((obj) => obj.myType == "box"),
      { canvas: fabricCanvas }
    );
    allBoxes.center();
    allBoxes.destroy();
  }

  fabricCanvas.on("mouse:wheel", (opt: any) => {
    let delta = 0;

    let wheelDelta = opt.e.wheelDelta;
    let deltaY = opt.e.deltaY;

    if (wheelDelta) {
      delta = -wheelDelta / 120;
    }
    if (deltaY) {
      deltaY > 0 ? (delta = 1) : (delta = -1);
    }

    let zoom = fabricCanvas.getZoom();
    zoom = zoom - delta / 10;

    if (zoom > 4) zoom = 4;

    if (zoom < 0.2) {
      zoom = 0.2;
    }

    fabricCanvas.zoomToPoint(
      new fabric.Point(fabricCanvas.width / 2, fabricCanvas.height / 2),
      zoom
    );

    opt.e.preventDefault();
    opt.e.stopPropagation();

    fabricCanvas.renderAll();
    fabricCanvas.calcOffset();
  });

//   setupObjects();

  return fabricCanvas;
};
