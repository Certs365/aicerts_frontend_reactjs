import React from "react";

interface SwitchProps {
    label: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Switch: React.FC<SwitchProps> = ({ label, onChange }) => {
    return (
        <div className="form-check form-switch d-flex align-items-center text-center mb-3">
            <input
                style={{ width: "3rem", borderRadius: "0.9rem" }}
                className="form-check-input me-3"
                type="checkbox"
                role="switch"
                id="flexSwitchCheckDefault"
                onChange={onChange}
            />
            <label className="form-check-label grey-light fs-16-14" htmlFor="flexSwitchCheckDefault">
                {label}
            </label>
        </div>

    );
};

export default Switch;
