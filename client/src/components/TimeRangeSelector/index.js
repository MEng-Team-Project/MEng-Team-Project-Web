/*
Custom <TimeRangeSelector /> component which supports selecting a time range
*/

import React, { useState } from 'react';

import './TimeRangeSelector.css';

const TimeRangeSelector = (props) => {
    const { title, ...rest } = props;

    return (
        <div
            className="time-range-selector-outer"
        >
            <div className="time-range-selector__title">
                {title}
            </div>
            <div className="time-range-selector__time-outer">
                <span className="time-range-selector__time-text">Start Time:</span>
                <input className="time-range-selector__time-input" type="datetime-local" id="start-time"
                    name="start-time" value="2018-06-12T19:30"
                    >
                    
                </input>
            </div>
            <div className="time-range-selector__time-outer">
                <span className="time-range-selector__time-text">End Time:</span>
                <input className="time-range-selector__time-input" type="datetime-local" id="end-time"
                    name="end-time" value="2018-06-12T19:30"
                    >
                </input>
            </div>
        </div>
    )
};

export default TimeRangeSelector;