import TimeRangeSelector from '../../../../../../components/TimeRangeSelector';

const DateTimeRangeFilter = (props) => {

    const { selectedDateTimeRange, updateDateTimeRangeFilter } = props;

    let initialStartTime;
    let initialEndTime;
    let initialInterval;
    let initialRecordingStartTime;

    if (Object.keys(selectedDateTimeRange).length !== 0) {
        initialRecordingStartTime = selectedDateTimeRange.data.recordingStartTime;
        initialStartTime = selectedDateTimeRange.data.startTime;
        initialEndTime = selectedDateTimeRange.data.endTime;
        initialInterval = selectedDateTimeRange.data.interval;
    }

    return (
        <div className="sidebar-filter">

            <div className="sidebar-filter__field">
                Time Range
            </div>

            <div className="sidebar-filter__data-source">

                <div className="sidebar-filter-text">
                    Select your time range here:
                </div>

                <TimeRangeSelector
                    initialRecordingStartTime={initialRecordingStartTime}
                    initialStartTime={initialStartTime}
                    initialEndTime={initialEndTime}
                    initialInterval={initialInterval}
                    onValueChange={(recordingStartTime, startTime, endTime, interval) => { updateDateTimeRangeFilter(recordingStartTime, startTime, endTime, interval) }}
                ></TimeRangeSelector>

            </div>

        </div>
    )
}

export default DateTimeRangeFilter;