/*
Custom <TimeRangeSelector /> component which supports selecting a time range
*/

import { useState } from 'react';

import './TimeRangeSelector.css';

const TimeRangeSelector = (props) => {
    const { title, initialRecordingStartTime, initialStartTime, initialEndTime, initialInterval, onValueChange} = props;
    const [recordingStartTime, setRecordingStartTime] = useState(initialRecordingStartTime ?? "2020-01-01T00:00");
    const [startTime, setStartTime] = useState(initialStartTime ?? "2020-01-01T00:00");
    const [endTime, setEndTime] = useState(initialEndTime ?? "2020-01-01T00:30");
    const [interval, setInterval] = useState(initialInterval ?? 1800);

    const updateEndTimeAndRespond = (recordingStartTimestamp, startTimestamp, intervalSeconds) => {
        const startTimeInMs = new Date(startTimestamp).getTime();
        const newEndTime = new Date(startTimeInMs + (intervalSeconds * 1000)).toISOString().slice(0, -8);
        setEndTime(newEndTime);

        if (onValueChange) {
            onValueChange(recordingStartTimestamp, startTimestamp, newEndTime, intervalSeconds);
        }
    }

    const updateInterval = (intervalSeconds) => {
        setInterval(intervalSeconds);
        updateEndTimeAndRespond(recordingStartTime, startTime, intervalSeconds);
    }

    const ensureStartTimeAfterRecordingStartTime = (recordingStartTimestamp, startTimestamp, input) => {
        if (recordingStartTimestamp > startTimestamp) {
            setRecordingStartTime(recordingStartTimestamp);
            setStartTime(recordingStartTimestamp);
            updateEndTimeAndRespond(recordingStartTimestamp, recordingStartTimestamp, interval);
        } else {
            if (input === "recordingStartTime") {
                setRecordingStartTime(recordingStartTimestamp);  
            } else if (input === "startTime") {
                setStartTime(startTimestamp);
            }
            updateEndTimeAndRespond(recordingStartTimestamp, startTimestamp, interval);
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
                        updateInterval(parseInt(e.target.value));
                    }}
                    checked={interval === 1800}
                />
                <label htmlFor="intervalOption1800">30m</label>
                <input type="radio" id="intervalOption3600" name="time-range-selector__interval_input" value="3600" checked={interval === 3600} onChange={(e) => {updateInterval(parseInt(e.target.value));}}/>
                <label htmlFor="intervalOption3600">1h</label>
                <input type="radio" id="intervalOption21600" name="time-range-selector__interval_input" value="21600" checked={interval === 21600} onChange={(e) => {updateInterval(parseInt(e.target.value));}}/>
                <label htmlFor="intervalOption21600">6h</label>
                <input type="radio" id="intervalOption86400" name="time-range-selector__interval_input" value="86400" checked={interval === 86400} onChange={(e) => {updateInterval(parseInt(e.target.value));}}/>
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