import React from 'react';

interface RadioButtonProps {
    state: boolean; // The state of the radio button (checked or unchecked)
    label?: string; // Label for the radio button
    isBordered?: boolean; // Whether the radio button has a border
    disabled?: boolean; // Whether the radio button is disabled
    onChange: (value: boolean) => void; // Callback function to handle change event
    classes?: string; // Additional custom classes
    selectedColor?: string; // Additional custom classes
    inputClasses?: string; // Additional custom classes
}

const RadioButton: React.FC<RadioButtonProps> = ({
    state,
    label,
    isBordered = false,
    disabled = false,
    onChange,
    classes = '',
    inputClasses
}) => {
    const handleClick = () => {
        if (!disabled) {
            onChange(!state);
        }
    };
    return (
        <div
            onClick={handleClick}
            className={`radio-wrapper m-2 d-flex flex-row text-center align-items-center ${isBordered ? 'radio-bordered' : ''} ${classes}`}>
            <input
                type="radio"
                checked={state}
                disabled={disabled}
                className={`me-2 ${inputClasses}`}
            />
            <label className="radio-text fs-16-14 grey-light">
                {label}
            </label>
        </div>
    );
};

export default RadioButton;
