/*
Custom <TimeRangeSelector /> component which supports selecting a time range
*/

import { useState } from 'react';

import './TimeRangeSelector.css';

const TimeRangeSelector = (props) => {
    const { title, minStartTime, maxEndTime, onValueChange, ...rest } = props;
    const [startTime, setStartTime] = useState(minStartTime ?? "2020-01-01T00:00")
    const [endTime, setEndTime] = useState(maxEndTime ?? "2020-01-01T00:00")

    return (
        <div
            className="time-range-selector-outer"
        >
            <div className="time-range-selector__title">
                {title}
            </div>
            <div className="time-range-selector__time-outer">
                <span className="time-range-selector__time-text">Start Time:</span>
                <input className="time-range-selector__time-input"
                        type="datetime-local"
                        id="start-time"
                        name="start-time"
                        minvalue={minStartTime ?? "2020-01-01T00:00"}
                        defaultValue={startTime}
                        onChange={(e) => {
                            setStartTime(e.target.value);
                            if (onValueChange) {
                                onValueChange(e.target.value, endTime);
                            }
                        }}>
                </input>
            </div>
            <div className="time-range-selector__time-outer">
                <span className="time-range-selector__time-text">End Time:</span>
                <input className="time-range-selector__time-input"
                    type="datetime-local"
                    id="end-time"
                    name="end-time"
                    maxvalue={maxEndTime ?? "2024-01-01T00:00"}
                    defaultValue={endTime}
                    onChange={(e) => {
                        setEndTime(e.target.value);
                        if (onValueChange) {
                            onValueChange(startTime, e.target.value);
                        }
                    }}>
                </input>
            </div>
        </div>
    )
};

export default TimeRangeSelector;