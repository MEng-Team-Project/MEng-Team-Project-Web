import TimeRangeSelector from '../../../../../../components/TimeRangeSelector';

const DateTimeRangeFilter = (props) => {

    const { minStartTime, maxEndTime, updateDateTimeRangeFilter } = props;

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
                    minStartTime={minStartTime}
                    maxEndTime={maxEndTime}
                    onValueChange={(startTime, endTime) => { updateDateTimeRangeFilter(startTime, endTime) }}
                ></TimeRangeSelector>

            </div>

        </div>
    )
}

export default DateTimeRangeFilter;