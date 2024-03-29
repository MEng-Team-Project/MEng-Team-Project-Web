/*
Generic <Tooltip /> component which you can wrap around any other element.
Nice looking Tooltip which notifies the user what an action does, especially useful
for icon based buttons which don't have labels telling the user what they do.
*/

// Source
// https://codesandbox.io/s/how-to-make-an-extremely-reusable-tooltip-component-with-react-and-nothing-else-7opo3?from-embed=&file=/src/App.js

import React, { useState } from 'react';

import './Tooltip.css';

const Tooltip = props => {
    let timeout;
    const [active, setActive] = useState(false);

    const showTip = () => {
        timeout = setTimeout(() => {
            setActive(true);
        }, props.delay || 400);
    };
    
    const hideTip = () => {
        clearInterval(timeout);
        setActive(false);
    };

    return (
        <div
            className="Tooltip-Wrapper"
            // When to show the tooltip
            onMouseEnter={showTip}
            onMouseLeave={hideTip}
        >
            {/* Wrapping */}
            {props.children}
            {active && (
                <div className={`Tooltip-Tip ${props.direction || "top"}`}>
                {/* Content */}
                {props.content}
                </div>
            )}
        </div>
    );
};

export default Tooltip;