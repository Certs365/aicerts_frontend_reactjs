import { useEffect, useRef, useState } from "react";
import QRCodeStyling from "qr-code-styling";
import { Form } from "react-bootstrap";

const QRCodeStylingComponent = () => {
  const qrCodeRef = useRef(null);
  const qrCodeInstance = useRef(null); 
  const [data, setData] = useState("https://qr-code-styling.com");
  const [width, setWidth] = useState(300);
  const [height, setHeight] = useState(300);
  const [marginQr, setMargingQr] = useState(0);
  const [logo, setLogo] = useState(null);

  const [dotStyle, setDotStyle] = useState("rounded");
  const [dotColorType, setDotColorType] = useState("single");
  const [dotColor, setDotColor] = useState("#000000");
  const [dotGradientType, setDotGradientType] = useState("linear");
  const [dotGradientColor1, setDotGradientColor1] = useState("#000000");
  const [dotGradientColor2, setDotGradientColor2] = useState("#ffffff");

  const [outerCornerStyle, setOuterCornerStyle] = useState("square");
  const [cornerColorType, setCornerColorType] = useState("single");
  const [cornerColor, setCornerColor] = useState("#000000");
  const [cornerGradientType, setCornerGradientType] = useState("linear");
  const [cornerGradientColor1, setCornerGradientColor1] = useState("#000000");
  const [cornerGradientColor2, setCornerGradientColor2] = useState("#FFFFFF");

  const [cornerDotStyle, setCornerDotStyle] = useState("square");
  const [cornerDotColorType, setCornerDotColorType] = useState("single");
  const [cornerDotColor, setCornerDotColor] = useState("#000000");
  const [cornerDotGradientType, setCornerDotGradientType] = useState("linear");
  const [cornerDotGradientColor1, setCornerDotGradientColor1] =
    useState("#000000");
  const [cornerDotGradientColor2, setCornerDotGradientColor2] =
    useState("#FFFFFF");

  const [backgroundColorType, setBackgroundColorType] = useState("single"); // "single" or "gradient"
  const [backgroundColor, setBackgroundColor] = useState("#ffffff"); // For single color
  const [backgroundGradientType, setBackgroundGradientType] =
    useState("linear"); // "linear" or "radial"
  const [backgroundGradientColor1, setBackgroundGradientColor1] =
    useState("#000000"); // Gradient start color
  const [backgroundGradientColor2, setBackgroundGradientColor2] =
    useState("#FFFFFF"); // Gradient end color

  const [isBackgroundHidden, setIsBackgroundHidden] = useState(true);
  const [imageMargin, setImageMargin] = useState(5);
  const [imageSize, setImageSize] = useState(0.4);

  const [errorCorrectionLevel, setErrorCorrectionLevel] = useState("L");
  const [maskPattern, setMaskPattern] = useState(0);

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle dot gradient type change
  const handleDotGradientTypeChange = (type) => {
    setDotGradientType(type);
  };

  // Handle corner square gradient type change
  const handleCornerGradientTypeChange = (type) => {
    setCornerGradientType(type);
  };

  // Handle corner dot gradient type change
  const handleCornerDotGradientTypeChange = (type) => {
    setCornerDotGradientType(type);
  };

  // Handle background gradient type change
  const handleBackgroundGradientTypeChange = (type) => {
    setBackgroundGradientType(type);
  };

  // Handle dot color type change
  const handleDotColorTypeChange = (type) => {
    setDotColorType(type);
    if (type === "single") {
      setDotGradientColor1("#000000"); // Reset gradient colors if switching to single
      setDotGradientColor2("#FFFFFF");
    }
  };

  // Handle corner square color type change
  const handleCornerColorTypeChange = (type) => {
    setCornerColorType(type);
    if (type === "single") {
      setCornerGradientColor1("#000000"); // Reset gradient colors if switching to single
      setCornerGradientColor2("#FFFFFF");
    }
  };

  // Handle corner dot color type change
  const handleCornerDotColorTypeChange = (type) => {
    setCornerDotColorType(type);
    if (type === "single") {
      setCornerDotGradientColor1("#000000"); // Reset gradient colors if switching to single
      setCornerDotGradientColor2("#FFFFFF");
    }
  };

  // Handle background color type change
  const handleBackgroundColorTypeChange = (type) => {
    setBackgroundColorType(type);
    if (type === "single") {
      setBackgroundGradientColor1("#000000"); // Reset gradient colors if switching to single
      setBackgroundGradientColor2("#FFFFFF");
    }
  };

  useEffect(() => {
    qrCodeInstance.current = new QRCodeStyling({
      width: width,
      height: height,
      data: data,
      margin: marginQr,
      image: logo, // Add the logo here
      dotsOptions: {
        colorType: dotColorType,
        color: dotColorType === "single" ? dotColor : undefined,
        type: dotStyle,
        gradient:
          dotColorType === "gradient"
            ? {
                type: dotGradientType,
                colorStops: [
                  { offset: 0, color: dotGradientColor1 },
                  { offset: 1, color: dotGradientColor2 },
                ],
              }
            : null,
      },
      cornersSquareOptions: {
        colorType: cornerColorType,
        color: cornerColorType === "single" ? cornerColor : undefined,
        type: outerCornerStyle,
        gradient:
          cornerColorType === "gradient"
            ? {
                type: cornerGradientType,
                colorStops: [
                  { offset: 0, color: cornerGradientColor1 },
                  { offset: 1, color: cornerGradientColor2 },
                ],
              }
            : null,
      },
      cornersDotOptions: {
        colorType: cornerDotColorType,
        color: cornerDotColorType === "single" ? cornerDotColor : undefined,
        type: cornerDotStyle,
        gradient:
          cornerDotColorType === "gradient"
            ? {
                type: cornerDotGradientType,
                colorStops: [
                  { offset: 0, color: cornerDotGradientColor1 },
                  { offset: 1, color: cornerDotGradientColor2 },
                ],
              }
            : null,
      },
      backgroundOptions: {
        color: backgroundColorType === "single" ? backgroundColor : undefined,
        colorType: backgroundColorType,
        gradient:
          backgroundColorType === "gradient"
            ? {
                type: backgroundGradientType,
                colorStops: [
                  { offset: 0, color: backgroundGradientColor1 },
                  { offset: 1, color: backgroundGradientColor2 },
                ],
              }
            : null,
      },
      imageOptions: {
        saveAsBlob: true,
        hideBackgroundDots: isBackgroundHidden,
        imageSize: imageSize,
        margin: imageMargin,
      },
      qrOptions: {
        typeNumber: maskPattern,
        mode: "Byte",
        errorCorrectionLevel: errorCorrectionLevel,
      },
    });
  
    qrCodeInstance.current.append(qrCodeRef.current);
    
    // Update the QR code if any state changes (add dependencies as necessary)
    updateQRCode();
  
    // Return a cleanup function to remove the QR code instance on unmount
    return () => {
      // Clean up logic if necessary, no need for clear() method
      qrCodeInstance.current = null;
    };
  }, [
    width,
    height,
    data,
    marginQr,
    logo,
    dotColorType,
    dotColor,
    dotStyle,
    dotGradientType,
    dotGradientColor1,
    dotGradientColor2,
    cornerColorType,
    cornerColor,
    outerCornerStyle,
    cornerGradientType,
    cornerGradientColor1,
    cornerGradientColor2,
    cornerDotColorType,
    cornerDotColor,
    cornerDotStyle,
    cornerDotGradientType,
    cornerDotGradientColor1,
    cornerDotGradientColor2,
    backgroundColorType,
    backgroundColor,
    backgroundGradientType,
    backgroundGradientColor1,
    backgroundGradientColor2,
    isBackgroundHidden,
    imageSize,
    imageMargin,
    maskPattern,
    errorCorrectionLevel,
  ]);
  

//   useEffect(() => {
//     qrCodeInstance.current = new QRCodeStyling({
//       width: { width },
//       height: { height },
//       data: data,
//       margin: marginQr,
//       image: "",
//       dotsOptions: {
//         colorType: dotColorType,
//         color: dotColorType === "single" ? dotColor : undefined,
//         type: dotStyle,
//         gradient:
//           dotColorType === "gradient"
//             ? {
//                 type: dotGradientType,
//                 colorStops: [
//                   { offset: 0, color: dotGradientColor1 },
//                   { offset: 1, color: dotGradientColor2 },
//                 ],
//               }
//             : null,
//       },
//       cornersSquareOptions: {
//         colorType: cornerColorType,
//         color: cornerColorType === "single" ? cornerColor : undefined,
//         type: outerCornerStyle,
//         gradient:
//           cornerColorType === "gradient"
//             ? {
//                 type: cornerGradientType,
//                 colorStops: [
//                   { offset: 0, color: cornerGradientColor1 },
//                   { offset: 1, color: cornerGradientColor2 },
//                 ],
//               }
//             : null,
//       },
//       cornersDotOptions: {
//         colorType: cornerDotColorType,
//         color: cornerDotColorType === "single" ? cornerDotColor : undefined,
//         type: cornerDotStyle,
//         gradient:
//           cornerDotColorType === "gradient"
//             ? {
//                 type: cornerDotGradientType,
//                 colorStops: [
//                   { offset: 0, color: cornerDotGradientColor1 },
//                   { offset: 1, color: cornerDotGradientColor2 },
//                 ],
//               }
//             : null,
//       },
//       backgroundOptions: {
//         color: backgroundColorType === "single" ? backgroundColor : undefined,
//         colorType: backgroundColorType,
//         gradient:
//           backgroundColorType === "gradient"
//             ? {
//                 type: backgroundGradientType,
//                 colorStops: [
//                   { offset: 0, color: backgroundGradientColor1 },
//                   { offset: 1, color: backgroundGradientColor2 },
//                 ],
//               }
//             : null,
//       },
//       imageOptions: {
//         saveAsBlob: true,
//         hideBackgroundDots: isBackgroundHidden,
//         imageSize: imageSize,
//         margin: imageMargin,
//       },
//       qrOptions: {
//     typeNumber: maskPattern,
//     mode: "Byte",
//     errorCorrectionLevel: errorCorrectionLevel
//   },
//     });

//     qrCodeInstance.current.append(qrCodeRef.current);
//   }, []);

  const updateQRCode = () => {
    qrCodeInstance.current.update({
      width: width,
      height: height,
      margin: marginQr,
      image: logo,
      data: data,
      imageOptions: {
        saveAsBlob: true,
        hideBackgroundDots: isBackgroundHidden,
        imageSize: imageSize,
        margin: imageMargin,
      },
      dotsOptions: {
        colorType: dotColorType,
        color: dotColorType === "single" ? dotColor : undefined,
        type: dotStyle,
        gradient:
          dotColorType === "gradient"
            ? {
                type: dotGradientType,
                colorStops: [
                  { offset: 0, color: dotGradientColor1 },
                  { offset: 1, color: dotGradientColor2 },
                ],
              }
            : null,
      },
      cornersSquareOptions: {
        colorType: cornerColorType,
        color: cornerColorType === "single" ? cornerColor : undefined,
        type: outerCornerStyle,
        gradient:
          cornerColorType === "gradient"
            ? {
                type: cornerGradientType,
                colorStops: [
                  { offset: 0, color: cornerGradientColor1 },
                  { offset: 1, color: cornerGradientColor2 },
                ],
              }
            : null,
      },
      cornersDotOptions: {
        colorType: cornerDotColorType,
        color: cornerDotColorType === "single" ? cornerDotColor : undefined,
        type: cornerDotStyle,
        gradient:
          cornerDotColorType === "gradient"
            ? {
                type: cornerDotGradientType,
                colorStops: [
                  { offset: 0, color: cornerDotGradientColor1 },
                  { offset: 1, color: cornerDotGradientColor2 },
                ],
              }
            : null,
      },
      backgroundOptions: {
        color: backgroundColorType === "single" ? backgroundColor : undefined,
        colorType: backgroundColorType,
        gradient:
          backgroundColorType === "gradient"
            ? {
                type: backgroundGradientType,
                colorStops: [
                  { offset: 0, color: backgroundGradientColor1 },
                  { offset: 1, color: backgroundGradientColor2 },
                ],
              }
            : null,
      },
      qrOptions: {
        typeNumber: maskPattern,
        mode: "Byte",
        errorCorrectionLevel: errorCorrectionLevel
      },
    });
  };

  return (
    <div>
      <h1>Editable QR Code</h1>
      <div className="d-flex gap-10 m-4">
        <div className="flex-grow-1 m-4">
          <h3 style={{ backgroundColor: "#ddd", padding: "5px" }}>
            Main Options
          </h3>
          <Form>
            <Form.Group className="m-4">
              <Form.Label className=" fs-4">Data:</Form.Label>
              <Form.Control
                className="p-3 fs-5"
                type="text"
                placeholder="Enter data"
                value={data}
                onChange={(e) => setData(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="m-4">
              <Form.Label className=" fs-4">Logo:</Form.Label>
              <Form.Control
                className="p-3 fs-5"
                type="file"
                accept="image/*" // Allow only image files
                onChange={handleLogoUpload}
              />
            </Form.Group>
            <Form.Group className="m-4">
              <Form.Label className=" fs-4">Width:</Form.Label>
              <Form.Control
                className="p-3 fs-5"
                type="number"
                placeholder="Enter width"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="m-4">
              <Form.Label className=" fs-4">Height:</Form.Label>
              <Form.Control
                className="p-3 fs-5"
                type="number"
                placeholder="Enter width"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="m-4">
              <Form.Label className=" fs-4">Margin:</Form.Label>
              <Form.Control
                className="p-3 fs-5"
                type="number"
                placeholder="Enter width"
                value={marginQr}
                onChange={(e) => setMargingQr(e.target.value)}
              />
            </Form.Group>

            <h3 style={{ backgroundColor: "#ddd", padding: "5px" }}>
              Dots options
            </h3>
            <Form.Group className="m-4">
              <Form.Label className="fs-4">Dot Style</Form.Label>
              <Form.Select
                value={dotStyle}
                className="p-3 fs-5"
                onChange={(e) => setDotStyle(e.target.value)}
              >
                <option value="rounded">Rounded</option>
                <option value="dots">Dots</option>
                <option value="classy">Classy</option>
                <option value="classy-rounded">Classy Rounded</option>
                <option value="square">Square</option>
                <option value="extra-rounded">Extra Rounded</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="m-4 d-flex justify-between">
              <Form.Label className="fs-4">Color Type</Form.Label>
              <Form.Check
                type="checkbox"
                label="Single Color"
                id="single"
                checked={dotColorType === "single"}
                className="p-3 fs-5"
                onChange={() => handleDotColorTypeChange("single")}
              />
              <Form.Check
                type="checkbox"
                label="Gradient Color"
                id="gradient"
                checked={dotColorType === "gradient"}
                className="p-3 fs-5"
                onChange={() => handleDotColorTypeChange("gradient")}
              />
            </Form.Group>

            {dotColorType === "single" && (
              <Form.Group className="m-4">
                <Form.Label className="fs-4">Dot Color</Form.Label>
                <Form.Control
                  type="color"
                  className="p-3 fs-5"
                  style={{ width: "80px", height: "40px" }}
                  value={dotColor}
                  onChange={(e) => setDotColor(e.target.value)}
                />
              </Form.Group>
            )}

            {dotColorType === "gradient" && (
              <Form.Group className="m-4">
                <Form.Group className="m-4 d-flex justify-between">
                  <Form.Label className="fs-4">Gradient Type</Form.Label>
                  <Form.Check
                    type="checkbox"
                    label="Linear"
                    id="linear"
                    checked={dotGradientType === "linear"}
                    className="p-3 fs-5"
                    onChange={() => handleDotGradientTypeChange("linear")}
                  />
                  <Form.Check
                    type="checkbox"
                    label="Radial"
                    id="radial"
                    checked={dotGradientType === "radial"}
                    className="p-3 fs-5"
                    onChange={() => handleDotGradientTypeChange("radial")}
                  />
                </Form.Group>
                <Form.Group className="d-flex">
                  <Form.Label className="fs-4">Dot Gradient</Form.Label>
                  <Form.Control
                    type="color"
                    className="p-3 fs-5"
                    style={{ width: "80px", height: "40px" }}
                    value={dotGradientColor1}
                    onChange={(e) => setDotGradientColor1(e.target.value)}
                  />
                  <Form.Control
                    type="color"
                    className="p-3 fs-5"
                    style={{ width: "80px", height: "40px" }}
                    value={dotGradientColor2}
                    onChange={(e) => setDotGradientColor2(e.target.value)}
                  />
                </Form.Group>
              </Form.Group>
            )}

            <h3 style={{ backgroundColor: "#ddd", padding: "5px" }}>
              Corner Square options
            </h3>
            <Form.Group className="m-4">
              <Form.Label className="fs-4">Corner Square Style</Form.Label>
              <Form.Select
                value={outerCornerStyle}
                className="p-3 fs-5"
                onChange={(e) => setOuterCornerStyle(e.target.value)}
              >
                <option value="square">Square</option>
                <option value="dots">Dots</option>
                <option value="extra-rounded">Extra Rounded</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="m-4 d-flex justify-between">
              <Form.Label className="fs-4">Color Type</Form.Label>
              <Form.Check
                type="checkbox"
                label="Single Color"
                id="single"
                checked={cornerColorType === "single"}
                className="p-3 fs-5"
                onChange={() => handleCornerColorTypeChange("single")}
              />
              <Form.Check
                type="checkbox"
                label="Gradient Color"
                id="gradient"
                checked={cornerColorType === "gradient"}
                className="p-3 fs-5"
                onChange={() => handleCornerColorTypeChange("gradient")}
              />
            </Form.Group>

            {cornerColorType === "single" && (
              <Form.Group className="m-4">
                <Form.Label className="fs-4">Corner Square Color</Form.Label>
                <Form.Control
                  type="color"
                  className="p-3 fs-5"
                  style={{ width: "80px", height: "40px" }}
                  value={cornerColor}
                  onChange={(e) => setCornerColor(e.target.value)}
                />
              </Form.Group>
            )}

            {cornerColorType === "gradient" && (
              <Form.Group className="m-4">
                <Form.Group className="m-4 d-flex justify-between">
                  <Form.Label className="fs-4">Gradient Type</Form.Label>
                  <Form.Check
                    type="checkbox"
                    label="Linear"
                    id="linear"
                    checked={cornerGradientType === "linear"}
                    className="p-3 fs-5"
                    onChange={() => handleCornerGradientTypeChange("linear")}
                  />
                  <Form.Check
                    type="checkbox"
                    label="Radial"
                    id="radial"
                    checked={cornerGradientType === "radial"}
                    className="p-3 fs-5"
                    onChange={() => handleCornerGradientTypeChange("radial")}
                  />
                </Form.Group>
                <Form.Group className="d-flex">
                  <Form.Label className="fs-4">
                    Corner Square Gradient Start Color
                  </Form.Label>
                  <Form.Control
                    type="color"
                    className="p-3 fs-5"
                    style={{ width: "80px", height: "40px" }}
                    value={cornerGradientColor1}
                    onChange={(e) => setCornerGradientColor1(e.target.value)}
                  />
                  <Form.Label className="fs-4">
                    Corner Square Gradient End Color
                  </Form.Label>
                  <Form.Control
                    type="color"
                    className="p-3 fs-5"
                    style={{ width: "80px", height: "40px" }}
                    value={cornerGradientColor2}
                    onChange={(e) => setCornerGradientColor2(e.target.value)}
                  />
                </Form.Group>
              </Form.Group>
            )}

            <h3 style={{ backgroundColor: "#ddd", padding: "5px" }}>
              Corner Dot options
            </h3>
            <Form.Group className="m-4">
              <Form.Label className="fs-4">Corner Dot Style</Form.Label>
              <Form.Select
                value={cornerDotStyle}
                className="p-3 fs-5"
                onChange={(e) => setCornerDotStyle(e.target.value)}
              >
                <option value="square">Square</option>
                <option value="dots">Dots</option>
                <option value="extra-rounded">Extra Rounded</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="m-4 d-flex justify-between">
              <Form.Label className="fs-4">Color Type</Form.Label>
              <Form.Check
                type="checkbox"
                label="Single Color"
                id="single"
                checked={cornerDotColorType === "single"}
                className="p-3 fs-5"
                onChange={() => handleCornerDotColorTypeChange("single")}
              />
              <Form.Check
                type="checkbox"
                label="Gradient Color"
                id="gradient"
                checked={cornerDotColorType === "gradient"}
                className="p-3 fs-5"
                onChange={() => handleCornerDotColorTypeChange("gradient")}
              />
            </Form.Group>

            {cornerDotColorType === "single" && (
              <Form.Group className="m-4">
                <Form.Label className="fs-4">Corner Dot Color</Form.Label>
                <Form.Control
                  type="color"
                  className="p-3 fs-5"
                  style={{ width: "80px", height: "40px" }}
                  value={cornerDotColor}
                  onChange={(e) => setCornerDotColor(e.target.value)}
                />
              </Form.Group>
            )}

            {cornerDotColorType === "gradient" && (
              <Form.Group className="m-4">
                <Form.Group className="m-4 d-flex justify-between">
                  <Form.Label className="fs-4">Gradient Type</Form.Label>
                  <Form.Check
                    type="checkbox"
                    label="Linear"
                    id="linear"
                    checked={cornerDotGradientType === "linear"}
                    className="p-3 fs-5"
                    onChange={() => handleCornerDotGradientTypeChange("linear")}
                  />
                  <Form.Check
                    type="checkbox"
                    label="Radial"
                    id="radial"
                    checked={cornerDotGradientType === "radial"}
                    className="p-3 fs-5"
                    onChange={() => handleCornerDotGradientTypeChange("radial")}
                  />
                </Form.Group>
                <Form.Group className="d-flex">
                  <Form.Label className="fs-4">Corner Dot Gradient</Form.Label>
                  <Form.Control
                    type="color"
                    className="p-3 fs-5"
                    style={{ width: "80px", height: "40px" }}
                    value={cornerDotGradientColor1}
                    onChange={(e) => setCornerDotGradientColor1(e.target.value)}
                  />
                  <Form.Control
                    type="color"
                    className="p-3 fs-5"
                    style={{ width: "80px", height: "40px" }}
                    value={cornerDotGradientColor2}
                    onChange={(e) => setCornerDotGradientColor2(e.target.value)}
                  />
                </Form.Group>
              </Form.Group>
            )}
            <h3 style={{ backgroundColor: "#ddd", padding: "5px" }}>
              Background Options
            </h3>

            <Form.Group className="m-4 d-flex justify-between">
              <Form.Label className="fs-4">Color Type</Form.Label>
              <Form.Check
                type="checkbox"
                label="Single Color"
                id="single"
                checked={backgroundColorType === "single"}
                className="p-3 fs-5"
                onChange={() => handleBackgroundColorTypeChange("single")}
              />
              <Form.Check
                type="checkbox"
                label="Gradient Color"
                id="gradient"
                checked={backgroundColorType === "gradient"}
                className="p-3 fs-5"
                onChange={() => handleBackgroundColorTypeChange("gradient")}
              />
            </Form.Group>

            {backgroundColorType === "single" && (
              <Form.Group className="m-4">
                <Form.Label className="fs-4">Background Color</Form.Label>
                <Form.Control
                  type="color"
                  className="p-3 fs-5"
                  style={{ width: "80px", height: "40px" }}
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                />
              </Form.Group>
            )}

            {backgroundColorType === "gradient" && (
              <Form.Group className="m-4">
                <Form.Group className="m-4 d-flex justify-between">
                  <Form.Label className="fs-4">Gradient Type</Form.Label>
                  <Form.Check
                    type="checkbox"
                    label="Linear"
                    id="linear"
                    checked={backgroundGradientType === "linear"}
                    className="p-3 fs-5"
                    onChange={() =>
                      handleBackgroundGradientTypeChange("linear")
                    }
                  />
                  <Form.Check
                    type="checkbox"
                    label="Radial"
                    id="radial"
                    checked={backgroundGradientType === "radial"}
                    className="p-3 fs-5"
                    onChange={() =>
                      handleBackgroundGradientTypeChange("radial")
                    }
                  />
                </Form.Group>
                <Form.Group className="d-flex">
                  <Form.Label className="fs-4">Background Gradient</Form.Label>
                  <Form.Control
                    type="color"
                    className="p-3 fs-5"
                    style={{ width: "80px", height: "40px" }}
                    value={backgroundGradientColor1}
                    onChange={(e) =>
                      setBackgroundGradientColor1(e.target.value)
                    }
                  />
                  <Form.Control
                    type="color"
                    className="p-3 fs-5"
                    style={{ width: "80px", height: "40px" }}
                    value={backgroundGradientColor2}
                    onChange={(e) =>
                      setBackgroundGradientColor2(e.target.value)
                    }
                  />
                </Form.Group>
              </Form.Group>
            )}
            <h3 style={{ backgroundColor: "#ddd", padding: "5px" }}>
              Image options
            </h3>
            <Form.Group className="m-4 d-flex justify-between">
              <Form.Label className="fs-4">Hide Background</Form.Label>
              <Form.Check
                type="checkbox"
                label="Hide Background"
                id="hide-background"
                checked={isBackgroundHidden}
                className="p-3 fs-5"
                onChange={() => setIsBackgroundHidden(!isBackgroundHidden)}
              />
            </Form.Group>

            <Form.Group className="m-4">
              <Form.Label className="fs-4">Image Margin</Form.Label>
              <Form.Control
                type="number"
                className="p-3 fs-5"
                placeholder="Enter margin"
                value={imageMargin}
                onChange={(e) => setImageMargin(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="m-4">
              <Form.Label className="fs-4">Image Size</Form.Label>
              <Form.Control
                type="number"
                className="p-3 fs-5"
                placeholder="Enter margin"
                value={imageSize}
                onChange={(e) => setImageSize(e.target.value)}
              />
            </Form.Group>

            <h3 style={{ backgroundColor: "#ddd", padding: "5px" }}>
              QR options
            </h3>
            <Form.Group className="m-4">
              <Form.Label className=" fs-4">Error Correction Level</Form.Label>
              <Form.Select
                value={errorCorrectionLevel}
                className="p-3 fs-5"
                onChange={(e) => setErrorCorrectionLevel(e.target.value)}
              >
                <option value="L">L (Low)</option>
                <option value="M">M (Medium)</option>
                <option value="Q">Q (Quartile)</option>
                <option value="H">H (High)</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="m-4">
              <Form.Label className=" fs-4">Mask Pattern</Form.Label>
              <Form.Control
                className="p-3 fs-5"
                as="input"
                type="number"
                min="0"
                max="7"
                value={maskPattern}
                onChange={(e) => setMaskPattern(parseInt(e.target.value))}
                // placeholder="Enter a number between 0 and 7"
              />
            </Form.Group>
          </Form>
        </div>
        <div style={{ position: 'sticky', top: '20px', height: '100vh' }}>
          {" "}
          <div ref={qrCodeRef} style={{ marginTop: "20px" }} />
          {/* <button onClick={updateQRCode}>Update QR Code</button> */}
        </div>
      </div>
    </div>
  );
};

export default QRCodeStylingComponent;
