import { Dropdown } from '../../../../../../components';

const DataSourceFilter = (props) => {

    const { dataSources, updateDataSourceFilter } = props;

    return (
        <div className="sidebar-filter">

            <div className="sidebar-filter__field">
                Data Source
            </div>

            <div className="sidebar-filter__data-source">

                <div className="sidebar-filter-text">
                    Select your data source here:
                </div>

                <Dropdown
                    values={dataSources}
                    placeholder={"Select a data source"}
                    init={0}
                    type={"dot"}
                    onValueChange={(filterDataSource) => { updateDataSourceFilter(filterDataSource) }}
                />

            </div>

        </div>
    )
}

export default DataSourceFilter;