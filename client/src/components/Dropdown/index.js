/*
Custom <Dropdown /> component which supports searching through items
and providing what the type of each item is.
*/

import React, { useState } from 'react'; 

import './Dropdown.css';

import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';

const Dropdown = props => {
    const { initialValue, values, placeholder, type, onValueChange, releaseValueAfterSelected, ...rest } = props;

    const initialSelectedValue = (!initialValue || Object.keys(initialValue).length === 0) ? null : initialValue;

    const [active, setActive] = useState(false);
    const [selectedValue, setSelectedValue] = useState(initialSelectedValue);
    const [query, setQuery] = useState("");

    console.log("selectedValue:", selectedValue);
    console.log("values:", values);

    const filterValues = (values, query) => {
        return values.filter(value => {
            return value.data.name.trim().toLowerCase().includes(query.toLowerCase());
        });
    };

    const init = (props.init) 
               ? props.init
               : -1;

    return (
        <div
            className="dropdown-outer"
        >
            <div
                className="dropdown"
                onClick={e => {
                    console.log("dropdown->onClick");
                    setQuery("");
                    setActive(!active)
                }}
                tabIndex={-1}
                onBlur={(e) => {
                    console.log("dropdown->onBlur", e.relatedTarget)
                    if (e.relatedTarget === null) {
                        setActive(false);
                    }
                }}
            >
                {(!selectedValue) ? (
                    <span className="dropdown-placeholder">
                        {placeholder}
                    </span>
                ) : (
                    <div className="dropdown-options__value">
                        {(type=="dot") && (
                            <div
                                className="dropdown-options__dot"
                                style={{backgroundColor: selectedValue.meta}} />
                        )}
                        {(type=="type") && (
                            <div className="dropdown-options__type">
                                {selectedValue.meta}
                            </div>
                        )}
                        {selectedValue.data.name}
                    </div>
                )}
            </div>
            {(active) && (
                <div
                    className="dropdown-options"
                    tabIndex={-1}
                    onBlur={(e) => {
                        console.log("dropdown-options->onBlur", e.relatedTarget)
                        if (e.relatedTarget === null) {
                            setActive(false);
                        }
                    }}
                >
                    <div className="dropdown-options__search-outer">
                        <div className="dropdown-options__search-inner">
                            <input
                                type="text"
                                className="dropdown-options__search"
                                placeholder="Search"
                                onChange={e => {
                                    setQuery(e.target.value);
                                }}
                            />
                            <SearchOutlinedIcon
                                className="dropdown-options__search-icon"
                                style={{
                                    width: 15,
                                    height: 15
                                }}
                            />
                        </div>
                    </div>
                    <div className="dropdown-separator" />
                    {filterValues(values, query).map((value, i) => (
                        <div
                            key={i}
                            className="dropdown-options__option"
                            onMouseDown = {e => {
                                console.log("dropdown-options__option")
                                setSelectedValue(value);
                                if (onValueChange) {
                                    onValueChange(value);
                                    if (releaseValueAfterSelected) {
                                        setSelectedValue(null);
                                    }
                                }
                                setActive(false);
                            }}>
                            {(type=="dot") && (
                                <div
                                    className="dropdown-options__dot"
                                    style={{backgroundColor: value.meta}} />
                            )}
                            {(type=="type") && (
                                <div className="dropdown-options__type">
                                    {value.meta}
                                </div>
                            )}
                            <div className="dropdown-options__option-label">
                                {String(value.data.name)}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
};

export default Dropdown;