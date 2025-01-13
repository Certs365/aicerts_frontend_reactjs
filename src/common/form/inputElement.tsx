import React from "react";
import Image from "next/image";

interface FormElementProps {
    icon?: string; // Icon can now be passed as an image path
    title: string; // Label for the input
    placeholder: string; // Placeholder text for the input
    type?: string; // Input type (e.g., text, email, password)
    required?: boolean; // Whether the input is required
    message?: string; // Message below the input (e.g., error or helper text)
    classes?: string; // Message below the input (e.g., error or helper text)
    value?: any; // Message below the input (e.g., error or helper text)
    onChange: (value: string) => void; // Callback function to handle input changes

}

const FormElement: React.FC<FormElementProps> = ({
    icon,
    title,
    placeholder,
    type,
    required = false,
    message,
    onChange,
    value,
    classes
}) => {
    return (
        <div className="formelement-wrapper">
            {/* Icon and Title */}
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

            {/* Input */}
            <input
                value={value}
                type={type}
                placeholder={placeholder}
                required={required}
                className={`formelement-input fs-16-14 ${classes}`}
                onChange={(e) => onChange(e.target.value)} // Directly invoke the onChange prop
            />

            {/* Message */}
            {message && (
                <div style={{ marginTop: "0.5rem", fontSize: "0.875rem", color: "red" }}>
                    {message}
                </div>
            )}
        </div>
    );
};

export default FormElement;
