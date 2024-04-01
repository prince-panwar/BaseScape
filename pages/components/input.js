import React from 'react';
import PropTypes from 'prop-types';

const CustomInput = ({ value, onChange, placeholder, className }) => {
  return (
    <input
      type="text"
      className={`custom-input ${className}`}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
  );
};

CustomInput.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  className: PropTypes.string,
};

export default CustomInput;
