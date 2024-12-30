import dynamic from "next/dynamic";

const QRCodeStylingComponent = dynamic(() => import("./QRCodeStylingComponent"), {
  ssr: false,
});

const QRCodePage = () => {
  return (
    <div>
      <h1>QR Code Styling in Next.js</h1>
      <QRCodeStylingComponent />
    </div>
  );
};

export default QRCodePage;
