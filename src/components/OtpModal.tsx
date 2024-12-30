import { ChangeEvent, useRef, KeyboardEvent, ClipboardEvent } from "react";
import { Modal, Button } from "react-bootstrap";
import { useTheme } from '../context/ThemeContext';

interface OtpModalProps {
  modalOtp: boolean;
  setModalOtp: (value: boolean) => void;
  setEmailOtp: (value: string[]) => void;
  handleLoginOtp: () => void;
  emailOtp: string[];
  handleChangeOtp: (e: ChangeEvent<HTMLInputElement>, index: number,
    inputRefs: React.MutableRefObject<(HTMLInputElement | null)[]>
  ) => void;
}

const OtpModal: React.FC<OtpModalProps> = ({
  modalOtp,
  setModalOtp,
  setEmailOtp,
  handleLoginOtp,
  emailOtp = ["", "", "", "", "", ""],
  handleChangeOtp,
}) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { isDarkMode } = useTheme();

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    const pasteData = e.clipboardData.getData("text");
    if (/^\d{6}$/.test(pasteData)) {
      const newOtp = pasteData.split("");
      setEmailOtp(newOtp); // Ensure we pass an array here
      inputRefs.current[5]?.focus(); // Focus on the last input
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && emailOtp[index] === "" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <Modal
      className="loader-modal otp-modal"
      show={modalOtp}
      centered
      onHide={() => {
        setModalOtp(false);
        setEmailOtp(["", "", "", "", "", ""]); // Reset OTP on modal close
      }}
    >
      <Modal.Header closeButton={false} className="d-flex justify-content-between align-items-center">
        OTP
        <div onClick={() => setModalOtp(false)} style={{ cursor: 'pointer' }}>
          {isDarkMode ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="31" viewBox="0 0 30 31" fill="none">
              <g clipPath="url(#clip0_6829_40281)">
                <path d="M15 0.75C6.72867 0.75 0 7.36652 0 15.5C0 23.6335 6.72867 30.25 15 30.25C23.2713 30.25 30 23.6335 30 15.5C30 7.36652 23.2713 0.75 15 0.75ZM20.5238 19.1936C21.0125 19.6743 21.0125 20.451 20.5238 20.9318C20.2801 21.1715 19.9601 21.2919 19.6399 21.2919C19.3199 21.2919 18.9999 21.1715 18.7562 20.9318L15 17.238L11.2438 20.9318C11.0001 21.1715 10.6801 21.2919 10.3601 21.2919C10.0399 21.2919 9.71992 21.1715 9.47617 20.9318C8.9875 20.451 8.9875 19.6743 9.47617 19.1936L13.2326 15.5L9.47617 11.8064C8.9875 11.3257 8.9875 10.549 9.47617 10.0682C9.96506 9.58771 10.7549 9.58771 11.2438 10.0682L15 13.762L18.7562 10.0682C19.2451 9.58771 20.0349 9.58771 20.5238 10.0682C21.0125 10.549 21.0125 11.3257 20.5238 11.8064L16.7674 15.5L20.5238 19.1936Z" fill="#A9A7B0" />
              </g>
              <defs>
                <clipPath id="clip0_6829_40281">
                  <rect width="30" height="29.5" fill="white" transform="translate(0 0.75)" />
                </clipPath>
              </defs>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
              <path d="M15 0C6.72867 0 0 6.72867 0 15C0 23.2713 6.72867 30 15 30C23.2713 30 30 23.2713 30 15C30 6.72867 23.2713 0 15 0ZM20.5238 18.7562C21.0125 19.2451 21.0125 20.0349 20.5238 20.5238C20.2801 20.7676 19.9601 20.89 19.6399 20.89C19.3199 20.89 18.9999 20.7676 18.7562 20.5238L15 16.7674L11.2438 20.5238C11.0001 20.7676 10.6801 20.89 10.3601 20.89C10.0399 20.89 9.71992 20.7676 9.47617 20.5238C8.9875 20.0349 8.9875 19.2451 9.47617 18.7562L13.2326 15L9.47617 11.2438C8.9875 10.7549 8.9875 9.96506 9.47617 9.47617C9.96506 8.9875 10.7549 8.9875 11.2438 9.47617L15 13.2326L18.7562 9.47617C19.2451 8.9875 20.0349 8.9875 20.5238 9.47617C21.0125 9.96506 21.0125 10.7549 20.5238 11.2438L16.7674 15L20.5238 18.7562Z" fill="#A2A2A2" />
            </svg>
          )}
        </div>
      </Modal.Header>
      <Modal.Body style={{ padding: "30px 20px" }}>
        <p
          style={{ fontFamily: "Manrope, sans-serif", fontWeight: 500 }}
        >
          Please Enter OTP Sent to Your Registered Email.
        </p>
        <div
          className="otp-inputs"
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          {emailOtp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              className="form-control"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChangeOtp(e, index, inputRefs)} // Pass inputRefs here
              onPaste={handlePaste}
              onKeyDown={(e) => handleKeyDown(e, index)}
              style={{
                width: "40px",
                height: "40px",
                textAlign: "center",
                fontSize: "20px",
                marginRight: index < 5 ? "8px" : "0",
              }}
            />
          ))}

        </div>
        <Button onClick={handleLoginOtp} className="golden global-button mt-3">
          Submit OTP
        </Button>
      </Modal.Body>
    </Modal>
  );
};

export default OtpModal;
