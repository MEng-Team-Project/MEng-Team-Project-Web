import React, { useState } from "react";

function DirectoryInput(props) {
    const {value}= props;
    const handleChange = (event) => {
      props.onValueChange(event.target.value);
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