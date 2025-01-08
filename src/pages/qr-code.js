import dynamic from "next/dynamic";
import QRCodeStylingComponent from "./customized-qr";

// const QRCodeStylingComponent = dynamic(() => import("./QRCodeStylingComponent"), {
//   ssr: false,
// });

const QRCodePage = () => {
  return (
    <div>
      <QRCodeStylingComponent />
    </div>
  );
};

export default QRCodePage;
