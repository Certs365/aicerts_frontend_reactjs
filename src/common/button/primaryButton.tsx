import React from "react";

interface PrimaryButtonProps {
    label: string; // Text for the button
    type?: "button" | "submit" | "reset"; // HTML button types
    icon?: React.ReactNode; // Optional icon
    iconPosition?: "front" | "back"; // Position of the icon relative to the text
    width?: string;
    disabled?: boolean;
    classes?: string;
    onClick: () => void; // Click handler
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
    label,
    type = "button", // Default type is 'button'
    icon,
    iconPosition = "front", // Default icon position is 'front'
    width = "auto",
    onClick,
    classes,
    disabled
}) => {
    return (
        <button
            className={`primary-btn d-flex align-items-center justify-content-center ${classes}`}
            style={{ width }}
            onClick={onClick}
            disabled={disabled}
            type={type} // Dynamically set the button type
        >
            {icon && iconPosition === "front" && <span className="me-2">{icon}</span>}
            {label}
            {icon && iconPosition === "back" && <span className="ms-2">{icon}</span>}
        </button>
    );
};

export default PrimaryButton;
