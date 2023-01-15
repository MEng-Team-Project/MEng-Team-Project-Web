import React, { useState } from "react";

function DirectoryInput(props) {
    const [value, setValue] = useState("");

    const handleChange = (event) => {
      setValue(event.target.value.replace(/\s/g, ''))
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
  
export default DirectoryInput;