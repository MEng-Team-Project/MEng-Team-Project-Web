/*
Custom MultiSelect Component that allows a list of options to be provided, and filtered by the user
*/

import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { Dropdown } from '../../../../../../components';

const MultiSelect = (props) => {

  const { title, itemName, items, selectedItems, addToItemFilter, removeFromItemFilter, updateItemFilter } = props;
  
  const itemElements = selectedItems.map((selectedItem) => {
      return (
          <div className="sidebar-filter__item-box"
              key={selectedItem.data.name}
              onClick={() => {removeFromItemFilter(selectedItem)}}>
              {selectedItem.data.name}
              <div className="sidebar-filter__item-box-remove-icon-container">
                  <RemoveCircleOutlineIcon className="sidebar-filter__item-box-remove-icon" />
              </div>
          </div>
      )
  });

  // Get all items in filterOptions json and
  // don't show in dropdown if it is already in the itemFilter
  const dropdownItemValues = items.filter((item) => !selectedItems.includes(item));

  return (
    <div className="sidebar-filter">
    <div className="sidebar-filter__field">
        { title ?? "Items" }
    </div>
    <div className="sidebar-filter__data-source">
        <div className="sidebar-filter__multi-selection-box">
            <div className="sidebar-filter__select-all-none-container">
                <button className="sidebar-filter__select-all-none-option sidebar-filter__select-all" onClick={() => { updateItemFilter(items) }}>
                    Select All
                </button>
                <button className="sidebar-filter__select-all-none-option sidebar-filter__select-none" onClick={() => { updateItemFilter([]) }}>
                    Select None
                </button>
            </div>
            {itemElements}
        </div>
        <div className="sidebar-filter-text">
            Select your {itemName ?? "item"}(s) here:
        </div>
        
        <Dropdown
            values={dropdownItemValues}
            placeholder={`Select ${itemName ?? "item"}(s)`}
            init={0}
            type={"dot"}
            onValueChange={(filterItem) => { addToItemFilter(filterItem) }}
            releaseValueAfterSelected={true}
        />
    </div>
</div>
  )
}

export default MultiSelect