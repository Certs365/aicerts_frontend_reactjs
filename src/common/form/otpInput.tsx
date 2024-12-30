import Image from "next/image";
import React, { useState, useRef } from "react";

interface OTPInputProps {
    icon?: string;
    title: string;
    required?: boolean;
    numInputs: number;
    onChange: (otp: string) => void;
    inputType?: string;
    classes?: string;
}

const OTPInput: React.FC<OTPInputProps> = ({
    icon,
    title,
    numInputs,
    required,
    onChange,
    inputType = "text",
    classes = "",
}) => {
    const [otp, setOtp] = useState<string[]>(Array(numInputs).fill(""));
    const inputRefs = useRef<(HTMLInputElement | null)[]>(Array(numInputs).fill(null));

    // Update the OTP state and propagate changes
    const updateOtp = (index: number, char: string) => {
        const newOtp = [...otp];
        newOtp[index] = char;
        setOtp(newOtp);
        onChange(newOtp.join(""));
    };

    // Handle keydown for navigation
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        const { key } = e;

        if (key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        } else if (key === "ArrowLeft" && index > 0) {
            inputRefs.current[index - 1]?.focus();
        } else if (key === "ArrowRight" && index < numInputs - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    // Handle paste event
    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pasteData = e.clipboardData.getData("text").slice(0, numInputs);
        const newOtp = pasteData.split("").concat(Array(numInputs).fill(""));
        const slicedOtp = newOtp.slice(0, numInputs);
        setOtp(slicedOtp);
        onChange(slicedOtp.join(""));
    };

    // Handle input change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const char = e.target.value.slice(-1); // Get only the last character
        if (/\d/.test(char) || char === "") { // Allow only numbers (modify regex for alphanumeric)
            updateOtp(index, char);

            // Auto-focus next field
            if (char && index < numInputs - 1) {
                inputRefs.current[index + 1]?.focus();
            }
        }
    };

    return (
        <div className="otp-input-wrapper d-flex flex-column  mb-4 d-flex justify-content-between">
            <div className="d-flex flex-row text-center align-items-center mb-2">
                {icon && (
                    <span className="me-2">
                        <Image src={icon} alt="icon mr-2" width={16} height={16} />
                    </span>
                )}
                <label className="fs-16-14 grey-light">
                    {title} {required && <span style={{ color: "red" }}>*</span>}
                </label>
            </div>
            <div className="input-wrapper d-flex flex-row">
                {Array.from({ length: numInputs }, (_, index) => (
                    <input
                        key={index}
                        // @ts-ignore: Implicit any for children prop
                        ref={(el) => (inputRefs.current[index] = el)}
                        value={otp[index]}
                        type={inputType}
                        className={`otp-input ${classes}`}
                        onChange={(e) => handleChange(e, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        onPaste={handlePaste}
                        maxLength={1}
                    />
                ))}
            </div>
        </div>
    );
};

export default OTPInput;
