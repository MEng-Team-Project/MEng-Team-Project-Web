import TimeRangeSelector from '../../../../../../components/TimeRangeSelector';

const DateTimeRangeFilter = (props) => {

    const { selectedDateTimeRange, updateDateTimeRangeFilter } = props;

    console.log("Selected date time range", selectedDateTimeRange);

    let initialStartTime;
    let initialEndTime;

    if (Object.keys(selectedDateTimeRange).length !== 0) {
        initialStartTime = selectedDateTimeRange.data.startTime;
        initialEndTime = selectedDateTimeRange.data.endTime;
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
                    initialStartTime={initialStartTime}
                    initialEndTime={initialEndTime}
                    onValueChange={(recordingStartTime, startTime, endTime, interval) => { updateDateTimeRangeFilter(recordingStartTime, startTime, endTime, interval) }}
                ></TimeRangeSelector>

            </div>

        </div>
    )
}

export default DateTimeRangeFilter;