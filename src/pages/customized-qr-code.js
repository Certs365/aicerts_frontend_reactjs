import { useState, useRef, useEffect } from "react";
import { Form } from "react-bootstrap";
import { QRCode } from "react-qrcode-logo";
import html2canvas from "html2canvas";
// import QRCode from "react-qr-code";

const CustomizedQrCode = () => {
  const [data, setData] = useState("https://qr-code-styling.com");
  const [width, setWidth] = useState(200);
  const [logo, setLogo] = useState(null);
  const [dotStyle, setDotStyle] = useState("squares");
  const [dotColor, setDotColor] = useState("#000000");
  const [outerCornerStyle, setOuterCornerStyle] = useState("square");
  const [innerCornerStyle, setInnerCornerStyle] = useState("square");
  const [cornerColor, setCornerColor] = useState("#000000");
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
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

  const getEyeRadius = () => {
    const getRadius = (style) => {
      switch (style) {
        case "dots":
          return [100, 100, 100, 100];
        case "extra-rounded":
          return [10, 10, 10, 10];
        default:
          return [0, 0, 0, 0];
      }
    };

    return [
      {
        outer: getRadius(outerCornerStyle),
        inner: getRadius(innerCornerStyle),
      },
      {
        outer: getRadius(outerCornerStyle),
        inner: getRadius(innerCornerStyle),
      },
      {
        outer: getRadius(outerCornerStyle),
        inner: getRadius(innerCornerStyle),
      },
    ];
  };
  const qrRef = useRef();

  const downloadQRCode = () => {
    html2canvas(qrRef.current).then((canvas) => {
      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = "qr-code.png";
      link.click();
    });
  };

  return (
    <div className="d-flex gap-10 m-4">
      <div className="flex-grow-1 m-4">
        <h3 style={{backgroundColor:"#ddd",padding:"5px"}}>Main Options</h3>
        <Form>
        <Form.Group className="m-4">
          <Form.Label className=" fs-4">
            Data:
          </Form.Label>
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
        <Form.Label className=" fs-4">Size:</Form.Label>
          <Form.Control
           className="p-3 fs-5"
            type="number"
            placeholder="Enter width"
            value={width}
            onChange={(e) => setWidth(e.target.value)}
          />
        </Form.Group>
        <h3  style={{backgroundColor:"#ddd",padding:"5px"}}>Dots options</h3>
        <Form.Group className="m-4">
          <Form.Label className=" fs-4"> Style</Form.Label>
          <Form.Select
            value={dotStyle}
             className="p-3 fs-5"
            onChange={(e) => setDotStyle(e.target.value)}
          >
            <option value="squares">Squares</option>
            <option value="dots">Dots</option>
          </Form.Select>
        </Form.Group>
        <Form.Group className="m-4">
        <Form.Label className=" fs-4">Dot Color</Form.Label>
          <Form.Control
            type="color"
             className="p-3 fs-5"
             style={{ width: '80px', height: '40px' }}
            value={dotColor}
            onChange={(e) => setDotColor(e.target.value)}
          />
        </Form.Group>
        <h3  style={{backgroundColor:"#ddd",padding:"5px"}}>Corners options</h3>
        <Form.Group className="m-4">
        <Form.Label className=" fs-4">Outer Corner Style</Form.Label>
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
        <Form.Group className="m-4">
        <Form.Label className=" fs-4">Inner Corner Style</Form.Label>
          <Form.Select
           className="p-3 fs-5"
            value={innerCornerStyle}
            onChange={(e) => setInnerCornerStyle(e.target.value)}
          >
            <option value="square">Square</option>
            <option value="dots">Dots</option>
            <option value="extra-rounded">Extra Rounded</option>
          </Form.Select>
        </Form.Group>
        <Form.Group className="m-4">
          <Form.Label className=" fs-4">Corner Color</Form.Label>
          <Form.Control
            type="color"
             className="p-3 fs-5"
             style={{ width: '80px', height: '40px' }}
            value={cornerColor}
            onChange={(e) => setCornerColor(e.target.value)}
          />
        </Form.Group>
        <h3 style={{backgroundColor:"#ddd",padding:"5px"}}>Background Options</h3>
        <Form.Group className="m-4">
          <Form.Label className=" fs-4">Background Color</Form.Label>
          <Form.Control
            type="color"
             className="p-3 fs-5"
            value={backgroundColor}
            style={{ width: '80px', height: '40px' }}
            onChange={(e) => setBackgroundColor(e.target.value)}
          />
        </Form.Group>
        <h3 style={{backgroundColor:"#ddd",padding:"5px"}}>QR options</h3>
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
      <div className="flex-grow-1"  style={{ position: 'sticky', top: '20px', height: '100vh' }}>
        <div ref={qrRef} className="m-4">
          <QRCode
            value={data}
            size={width}
            logoImage={logo}
            logoWidth={100}
            logoHeight={100}
            qrStyle={dotStyle}
            bgColor={backgroundColor}
            ecLevel={errorCorrectionLevel}
            level="H"
            includeMargin={true}
            quietZone={10}
            maskPattern={maskPattern}
            fgColor={dotColor}
            eyeRadius={getEyeRadius()}
            eyeColor={cornerColor}
            renderAs="svg"
          />
        </div>
        <button
          style={{
            margin: "30px",
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            fontSize:"14px",
            borderRadius: "4px",
            cursor: "pointer",
          }}
          onClick={downloadQRCode}
        >
          Download QR Code
        </button>
      </div>
    </div>
  );
};

export default CustomizedQrCode;
