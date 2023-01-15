import React, { useState } from "react";

function RestrictedNumericInput(props) {
    const [value, setValue] = useState("");
    const regex = /^\d*$/;
  
    const handleChange = (event) => {
      const input = event.target.value;
      if (input.match(regex) && input.length <= 5) {
        setValue(input);
      } else {
        setValue(value.slice(0, 5));
      }
      props.onValueChange(value);
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


