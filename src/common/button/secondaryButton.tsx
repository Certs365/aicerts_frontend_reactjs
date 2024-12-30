import React from "react";

interface SecondaryButtonProps {
    label: string; // Text for the button
    type?: "button" | "submit" | "reset"; // HTML button types
    icon?: React.ReactNode; // Optional icon
    width?: string;
    classes?: string;
    onClick: () => void; // Click handler
}

const SecondaryButton: React.FC<SecondaryButtonProps> = ({
    label,
    type = "button", // Default type is 'button'
    icon,
    width = "auto",
    onClick,
    classes
}) => {
    return (
        <button
            className={`secondary-btn d-flex align-items-center text-center justify-content-center pointer ${classes}`}
            style={{ width }}
            onClick={onClick}
            type={type} // Dynamically set the button type
        >
            {icon && <span className="me-2">{icon}</span>}
            {label}
        </button>
    );
};

export default SecondaryButton;
