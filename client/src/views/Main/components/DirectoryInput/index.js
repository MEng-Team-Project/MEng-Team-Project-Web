import React, { useState } from "react";

function DirectoryInput() {
    const [value, setValue] = useState("");

    const handleChange = (event) => {
      setValue(event.target.value.replace(/\s/g, ''))
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