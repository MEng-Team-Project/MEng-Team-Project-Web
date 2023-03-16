import { Dropdown } from '../../../../../../components';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

const ObjectFilter = (props) => {

    const { objects, selectedObjects, addToObjectFilter, removeFromObjectFilter, updateObjectFilter } = props;

    const objectElements = selectedObjects.map((selectedObject) => {
        return (
            <div className="sidebar-filter__item-box"
                key={selectedObject.data.name}
                onClick={() => {removeFromObjectFilter(selectedObject)}}>
                {selectedObject.data.name}
                <div className="sidebar-filter__item-box-remove-icon-container">
                    <RemoveCircleOutlineIcon className="sidebar-filter__item-box-remove-icon" />
                </div>
            </div>
        )
    });

    // Get all objects in filterOptions json and
    // don't show in dropdown if it is already in the objectFilter
    const dropdownObjectValues = objects.filter((object) => !selectedObjects.includes(object));

    return (
        <div className="sidebar-filter">
            <div className="sidebar-filter__field">
                Objects to Track
            </div>
            <div className="sidebar-filter__data-source">
                <div className="sidebar-filter__multi-selection-box">
                    <div className="sidebar-filter__select-all-none-container">
                        <button className="sidebar-filter__select-all-none-option sidebar-filter__select-all" onClick={() => { updateObjectFilter(objects) }}>
                            Select All
                        </button>
                        <button className="sidebar-filter__select-all-none-option sidebar-filter__select-none" onClick={() => { updateObjectFilter([]) }}>
                            Select None
                        </button>
                    </div>
                    {objectElements}
                </div>
                <div className="sidebar-filter-text">
                    Select your object(s) here:
                </div>
                
                <Dropdown
                    values={dropdownObjectValues}
                    placeholder={"Select object(s)"}
                    init={0}
                    type={"dot"}
                    onValueChange={(filterObject) => { addToObjectFilter(filterObject) }}
                    releaseValueAfterSelected={true}
                />
            </div>
        </div>
    );
}

export default ObjectFilter