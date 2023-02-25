import React, { useState } from 'react';
import './Toggle.css'

const Toggle = (isToggled, onToggle) => {
    return (<lable className="switch">
        <input type="checkbox" checked={isToggled} onChange={onToggle}/>
        <span className="slider"/>
    </lable>);
};

export default Toggle;
 