import React from 'react';
import PropTypes from "prop-types";

const ReusableInput = ({ type, name, value, onChange, disabled }) => {
    return (
        <label className="block mb-2">{name}
	        {/**/}
            <input
                type={type}
                name={name}
                className="w-full px-3 py-2 border rounded mt-1"
                value={value}
                onChange={onChange}
                disabled={disabled}
            />
        </label>
    );
};

//props validation

ReusableInput.propTypes = {
    type: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    disabled: PropTypes.bool
};

export default ReusableInput;