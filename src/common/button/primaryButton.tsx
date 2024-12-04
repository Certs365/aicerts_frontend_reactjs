import React from "react";

interface PrimaryButtonProps {
    label: string; // Text for the button
    type?: "button" | "submit" | "reset"; // HTML button types
    icon?: React.ReactNode; // Optional icon
    width?: string;
    classes?: string;
    onClick: () => void; // Click handler
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
    label,
    type = "button", // Default type is 'button'
    icon,
    width = "auto",
    onClick,
    classes
}) => {
    return (
        <button
            className={`primary-btn d-flex align-items-center justify-content-center ${classes}`}
            style={{ width }}
            onClick={onClick}
            type={type} // Dynamically set the button type
        >
            {icon && <span className="me-2">{icon}</span>}
            {label}
        </button>
    );
};

export default PrimaryButton;
