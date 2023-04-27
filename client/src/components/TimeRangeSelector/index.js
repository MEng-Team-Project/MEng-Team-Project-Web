/*
Custom <TimeRangeSelector /> component which supports selecting a time range
*/

import { useEffect, useState } from 'react';

import './TimeRangeSelector.css';

const TimeRangeSelector = (props) => {
    const { title, initialRecordingStartTime, initialStartTime, initialEndTime, onValueChange} = props;
    const [recordingStartTime, setRecordingStartTime] = useState(initialRecordingStartTime ?? "2020-01-01T00:00");
    const [startTime, setStartTime] = useState(initialStartTime ?? "2020-01-01T00:00");
    const [endTime, setEndTime] = useState(initialEndTime ?? "2020-01-01T00:30");
    const [interval, setInterval] = useState(1800);

    useEffect(() => {
        const startTimeInMs = new Date(startTime).getTime();
        const newEndTime = new Date(startTimeInMs + (interval * 1000)).toISOString().slice(0, -8);
        setEndTime(newEndTime);
    }, [startTime, interval]);

    useEffect(() => {
        if (onValueChange) {
            onValueChange(recordingStartTime, startTime, endTime, interval);
        }
    }, [recordingStartTime, startTime, endTime, interval, onValueChange]);

    const ensureStartTimeAfterRecordingStartTime = (recording, start, input) => {
        if (recording > start) {
            setRecordingStartTime(recording);
            setStartTime(recording);
        } else {
            if (input === "recordingStartTime") {
                setRecordingStartTime(recording);
            } else if (input === "startTime") {
                setStartTime(start);
            }
        }
    }

    return (
        <div className="time-range-selector-outer">
            <div className="time-range-selector__title">
                {title}
            </div>
            <div className="time-range-selector__time-outer">
                <span className="time-range-selector__time-text">Time of Recording Start:</span>
                <input className="time-range-selector__time-input"
                        type="datetime-local"
                        id="recordingStartTime"
                        name="recording-start-time"
                        defaultValue={recordingStartTime}
                        onChange={(e) => {ensureStartTimeAfterRecordingStartTime(e.target.value, startTime, "recordingStartTime")}}>
                </input>
            </div>
            <div className="time-range-selector__title">
                Select the time interval here:
            </div>
            <div className="time-range-selector__interval-selector">
                <input type="radio"
                    id="intervalOption1800"
                    name="time-range-selector__interval_input"
                    value="1800"
                    onChange={(e) => {
                        setInterval(parseInt(e.target.value));
                    }}
                    defaultChecked
                    required
                />
                <label htmlFor="intervalOption1800">30m</label>
                <input type="radio" id="intervalOption3600" name="time-range-selector__interval_input" value="3600" onChange={(e) => {setInterval(parseInt(e.target.value));}}/>
                <label htmlFor="intervalOption3600">1h</label>
                <input type="radio" id="intervalOption21600" name="time-range-selector__interval_input" value="21600" onChange={(e) => {setInterval(parseInt(e.target.value));}}/>
                <label htmlFor="intervalOption21600">6h</label>
                <input type="radio" id="intervalOption86400" name="time-range-selector__interval_input" value="86400" onChange={(e) => {setInterval(parseInt(e.target.value));}}/>
                <label htmlFor="intervalOption86400">24h</label>
            </div>
            <div className="time-range-selector__time-outer">
                <span className="time-range-selector__time-text">Start Time:</span>
                <input className="time-range-selector__time-input"
                        type="datetime-local"
                        id="startTime"
                        name="start-time"
                        step="1800"
                        value={startTime}
                        onChange={(e) => {
                            ensureStartTimeAfterRecordingStartTime(recordingStartTime, e.target.value, "startTime");
                        }}>
                </input>
            </div>
            <div className="time-range-selector__time-outer">
                <span className="time-range-selector__time-text">End Time:</span>
                <input className="time-range-selector__time-input"
                    type="datetime-local"
                    id="endTime"
                    name="end-time"
                    value={endTime}
                    onChange={(e) => {
                        setEndTime(e.target.value);
                    }}
                    disabled>
                </input>
            </div>
        </div>
    )
};

export default TimeRangeSelector;