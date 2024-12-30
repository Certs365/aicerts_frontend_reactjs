import React from 'react';
import PropTypes from 'prop-types';

const Button = ({ label = '', onClick = () => {}, className = '', disabled = false }) => {

    return (
        <button className={`global-button ${className}`} onClick={onClick} disabled={disabled}>
            {label}
        </button>
    );
}

Button.propTypes = {
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func,
    className: PropTypes.string,
    disabled: PropTypes.bool,
};

export default Button;
