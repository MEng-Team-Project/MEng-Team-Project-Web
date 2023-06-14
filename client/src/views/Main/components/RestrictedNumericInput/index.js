import React, { useState } from "react";

function RestrictedNumericInput(props) {
  const {value}= props;
  const regex = /^\d*$/;

  const handleChange = (event) => {
    const input = event.target.value.trim();
    if (input.match(regex) && input.length <= 5 || input.length == 0) {
      props.onValueChange(input);
    } else {
      props.onValueChange(input.slice(0, 5));
    }
  };

  return (
    <input
      type="text"
      value={value}
      onChange={handleChange}
    />
  );
}

export default RestrictedNumericInput;