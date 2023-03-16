import { Dropdown } from '../../../../../../components';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

const StartRegionFilter = (props) => {

    const { regions, selectedRegions, addToStartRegionFilter, removeFromStartRegionFilter, updateStartRegionFilter } = props;

    const regionElements = selectedRegions.map((selectedRegion) => {
        return (
            <div className="sidebar-filter__item-box"
                key={selectedRegion.data.name}
                onClick={() => {removeFromStartRegionFilter(selectedRegion)}}>
                {selectedRegion.data.name}
                <div className="sidebar-filter__item-box-remove-icon-container">
                    <RemoveCircleOutlineIcon className="sidebar-filter__item-box-remove-icon" />
                </div>
            </div>
        )
    });

    // Get all regions in filterOptions json and
    // don't show in dropdown if it is already in the StartRegionFilter
    const dropdownRegionValues = regions.filter((region) => !selectedRegions.includes(region));

    return (
        <div className="sidebar-filter">
            <div className="sidebar-filter__field">
                Start Regions
            </div>
            <div className="sidebar-filter__data-source">
                <div className="sidebar-filter__multi-selection-box">
                    <div className="sidebar-filter__select-all-none-container">
                        <button className="sidebar-filter__select-all-none-option sidebar-filter__select-all" onClick={() => { updateStartRegionFilter(regions) }}>
                            Select All
                        </button>
                        <button className="sidebar-filter__select-all-none-option sidebar-filter__select-none" onClick={() => { updateStartRegionFilter([]) }}>
                            Select None
                        </button>
                    </div>
                    {regionElements}
                </div>
                <div className="sidebar-filter-text">
                    Select your region(s) here:
                </div>
                
                <Dropdown
                    values={dropdownRegionValues}
                    placeholder={"Select region(s)"}
                    init={0}
                    type={"dot"}
                    onValueChange={(filterRegion) => { addToStartRegionFilter(filterRegion) }}
                    releaseValueAfterSelected={true}
                />
            </div>
        </div>
    );
}

export default StartRegionFilter