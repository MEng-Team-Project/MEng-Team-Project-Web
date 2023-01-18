import React, { useState } from 'react';
import './Dropdown.css';

function Dropdown({options}) {
  const [showMenu, setShowMenu] = useState(false);
  const [selectedOption, setSelectedOption] = useState(options[0]);

  function handleClick() {
    setShowMenu(!showMenu);
  }

  function handleOptionClick(option) {
    setSelectedOption(option);
    setShowMenu(false);
  }

  return (
    <div className="dropdown">
      <div className="selected-option" onClick={handleClick}>
        {selectedOption}
        <i className="arrow down"></i>
      </div>
      {showMenu ? (
        <ul className="options">
          {options.map(option => (
            <li key={option} onClick={() => handleOptionClick(option)}>
              {option}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export default Dropdown;
