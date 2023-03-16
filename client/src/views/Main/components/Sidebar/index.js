/*
Advanced <Sidebar /> component which provides most of the functions which interact
with out backend for the end user. Assumed to contain the following along the top:
- View the general user guide and fine tuning instructions
- Video analytics listing and dispatching
- Export video in JSON format
- Import video in MP4 format

As for the tabs, these are assumed to contain:
1) Stream list, switching and colour coding
2) Composible filter page which allows the user to create complex data filters in
   a simple way by relying on the custom dropdown component to search for their
   desired streams / analytical data targets (e.g. time, object type - person/vehicle,
   object sub-type - HGV, car, bike, bus, etc.)
3) (Optional) Live video attribute togging. Allows the user to disable any default
   live stream overlay (i.e. object label, object instance segment or bounding box,
   route tracking, view the route which the system is using)
*/

// React
import React, { useState } from 'react';

// Redux
import { connect } from "react-redux";

// Redux Actions
import {
    setStream
} from "../../../../actions/streamActions";
//from '../../actions/streamActions';

// Icons
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import KeyboardArrowLeftOutlinedIcon from '@mui/icons-material/KeyboardArrowLeftOutlined';
import KeyboardArrowRightOutlinedIcon from '@mui/icons-material/KeyboardArrowRightOutlined';
import VideoLibraryOutlinedIcon from '@mui/icons-material/VideoLibraryOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import NearMeOutlinedIcon from '@mui/icons-material/NearMeOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import StorageOutlinedIcon from '@mui/icons-material/StorageOutlined';
import ModeEditIcon from '@mui/icons-material/ModeEdit';

// Global Components
import {
    Tooltip,
    Button,
    Dropdown
} from '../../../../components';
import axios from "axios";
// CSS
import "./Sidebar.css"
import { display } from '@mui/system';

// Filter Options for Dropdown
import filterOptions from './filterOptions.json';

import TimeRangeSelector from '../../../../components/TimeRangeSelector';
import DataSourceFilter from './Filters/DataSourceFilter';
import ObjectFilter from './Filters/ObjectFilter';
import StartRegionFilter from './Filters/StartRegionFilter';
import EndRegionFilter from './Filters/EndRegionFilter';
import DateTimeRangeFilter from './Filters/DateTimeRangeFilter';

const SidebarLiveVideoLayer = props => {
    const { title, selected } = props;
    const labelClass = (selected)
                     ? "live-video__layer-label live-video__layer-label-selected"
                     : "live-video__layer-label";
    const iconColor = (selected)
                    ? "rgb(193, 200, 209)"
                    : "rgb(121, 129, 141)"
    return (
        <div className="live-video__layer">
            <div className="live-video__layer-icon">
                {(selected) ? (
                    <VisibilityOutlinedIcon
                        style={{
                            color: iconColor,
                            width: "15px",
                            height: "15px"
                        }}
                    />
                ) : (
                    <VisibilityOffOutlinedIcon
                        style={{
                            color: iconColor,
                            width: "15px",
                            height: "15px"
                        }}
                    />
                )}
            </div>
            <div className={labelClass}>
                {title}
            </div>
        </div>
    )
};

const SidebarLiveVideo = props => {
    return (
        <div className="sidebar-tab">
            <div className="sidebar-tab__top">
                <div className="sidebar-tab__header">
                    Live Video
                </div>
            </div>
            <div className="sidebar-tab__text">
                Video Annotations
            </div>
            <div className="sidebar-tab__map-layers">
                <SidebarLiveVideoLayer
                    title="Object Labels"
                    selected={true}
                />
                <SidebarLiveVideoLayer
                    title="Object Segmentation"
                    selected={true}
                />
                <SidebarLiveVideoLayer
                    title="Vector Tracking"
                    selected={true}
                />
                <SidebarLiveVideoLayer
                    title="View Routes"
                    selected={false}
                />
            </div>
        </div>
    );
}

const SidebarFilter = props => {
    const { values, updateFilter } = props;
    

    return (
        <>




            <div className="sidebar-filter">
                <div className="sidebar-filter__field">
                    Time
                </div>
                <div className="sidebar-filter__data-source">
                    <div className="sidebar-filter-text">
                        Select your time range here:
                    </div>
                    <TimeRangeSelector></TimeRangeSelector>
                </div>
            </div>

            <div className="sidebar-filter">
                <div className="sidebar-filter__field">
                    Start Region
                </div>
                <div className="sidebar-filter__data-source">
                    <div className="sidebar-filter-text">
                        Select your start region(s) here:
                    </div>
                </div>
            </div>

            <div className="sidebar-filter">
                <div className="sidebar-filter__field">
                    End Region
                </div>
                <div className="sidebar-filter__data-source">
                    <div className="sidebar-filter-text">
                        Select your end region(s) here:
                    </div>
                </div>

            </div>
        </>
    )
};

const SidebarFilters = props => {
    const { streams } = props;

    const [dataSourceFilter, setDataSourceFilter] = useState({});

    const [objectFilter, setObjectFilter] = useState([]);

    const [dateTimeRangeFilter, setDateTimeRangeFilter] = useState({});

    const [startRegionFilter, setStartRegionFilter] = useState([]);

    const [endRegionFilter, setEndRegionFilter] = useState([]);

    const dropdownDataSources = streams.map(stream => ({
        "meta": "rgb(60, 97, 174)",
        "data": stream
    }));


    const dropdownObjects = filterOptions.objects;

    const updateDataSourceFilter = (filter) => {
        setDataSourceFilter(filter);
    }

    const updateObjectFilter = (filter) => {
        setObjectFilter(filter);
    }
    
    const addToObjectFilter = (filter) => {
        if (filter) {
            setObjectFilter([...objectFilter, filter]);
        }
    }

    const removeFromObjectFilter = (filter) => {
        setObjectFilter(objectFilter.filter((object) => {return (object !== filter) ? true : false}));
    }

    const updateDateTimeRangeFilter = (startTime, endTime) => {
        setDateTimeRangeFilter({
            meta: "dateTime",
            data: {
                name: "dateTime",
                startTime: startTime,
                endTime: endTime
            }
        });
    }

    const dropdownRegions = filterOptions.regions;

    const updateStartRegionFilter = (filter) => {
        setStartRegionFilter(filter);
    }
    
    const addToStartRegionFilter = (filter) => {
        if (filter) {
            setStartRegionFilter([...startRegionFilter, filter]);
        }
    }

    const removeFromStartRegionFilter = (filter) => {
        setStartRegionFilter(startRegionFilter.filter((startRegion) => {return (startRegion !== filter) ? true : false}))
    }

    const updateEndRegionFilter = (filter) => {
        setEndRegionFilter(filter);
    }
    
    const addToEndRegionFilter = (filter) => {
        if (filter) {
            setEndRegionFilter([...endRegionFilter, filter]);
        }
    }

    const removeFromEndRegionFilter = (filter) => {
        setEndRegionFilter(endRegionFilter.filter((endRegion) => {return (endRegion !== filter) ? true : false}))
    }

    return (
        <div className="sidebar-tab">
            <div className="sidebar-tab__top">
                <div className="sidebar-tab__header">
                    Filters
                </div>
            </div>
            <div className="sidebar-spacing" />
            <DataSourceFilter
                dataSources={dropdownDataSources}
                updateDataSourceFilter={(filter) => {updateDataSourceFilter(filter)}}
            />
            <ObjectFilter
                objects={dropdownObjects}
                selectedObjects={objectFilter}
                addToObjectFilter={(filter) => {addToObjectFilter(filter)}}
                updateObjectFilter={(filter) => {updateObjectFilter(filter)}}
                removeFromObjectFilter={(filter) => {removeFromObjectFilter(filter)}}
            />

            <DateTimeRangeFilter
                updateDateTimeRangeFilter={(startTime, endTime) => {updateDateTimeRangeFilter(startTime, endTime)}}
            />

            <StartRegionFilter
                regions={dropdownRegions}
                selectedRegions={startRegionFilter}
                addToStartRegionFilter={(filter) => { addToStartRegionFilter(filter) }}
                updateStartRegionFilter={(filter) => { updateStartRegionFilter(filter) }}
                removeFromStartRegionFilter={(filter) => { removeFromStartRegionFilter(filter) }}
            />

            <EndRegionFilter
                regions={dropdownRegions}
                selectedRegions={endRegionFilter}
                addToEndRegionFilter={(filter) => { addToEndRegionFilter(filter) }}
                updateEndRegionFilter={(filter) => { updateEndRegionFilter(filter) }}
                removeFromEndRegionFilter={(filter) => { removeFromEndRegionFilter(filter) }}
            />
        </div>
    );
};

const SidebarStreamList = props => {
    const { streams, setStream, editStreamOpen, setEditMode, edit} = props;

    const deleteStream = values => {
        const response = confirm(`Are you sure you want to delete ${values.name} ?`);
        const name = values.name;
        if (response) {
            const streamDetails = {"source": values.source};
            axios
            .post("/api/streams/delete", streamDetails)
            .then(res => {
                alert(`${name} has been deleted`);
            })
            .catch(err => {
                alert(`Failed to delete ${name}`);
            })
        } else {
            alert("Delete cancelled");
        }
    }

    const deleteVideo = values => {
        const response = confirm(`Are you sure you want to delete ${values.name} ?`);
        const name = values.name;
        if (response) {
            const streamDetails = {"source": values.source};
            axios
            .post("/api/streams/deleteVideo", streamDetails)
            .then(res => {
                alert(`${name} has been deleted`);
            })
            .catch(err => {
                alert(`Failed to delete ${name}`);
            })
        } else {
            alert("Delete cancelled");
        }
    }

    console.log("streams: ", streams)
    return (
        <div className="sidebar-tab__streams">
            {streams.map((stream, i) => ( 
                <div key={i} className="sidebar-tab__streams-stream_outer">
                    <div classname ="sidebar-tab__streams-stream_inner"> 
                        <div className="sidebar-tab__streams-stream_left">
                            <div className="change_color_div">
                                <Tooltip content="Change Colour" direction="right">
                                    <div className="sidebar-tab__streams-stream_square" />
                                </Tooltip>
                            </div>
                        </div>
                        <div className="sidebar-tab__streams-stream_left"> 
                            <Tooltip content="Delete" direction="right">
                            <DeleteOutlineOutlinedIcon
                                                onClick={() => {
                                                    (stream.is_livestream)?(deleteStream(stream)):(deleteVideo(stream))
                                                }}
                                                style={{
                                                    width: 15,
                                                    height: 15
                                                }}
                                                className="icon sidebar-top__icon"
                                            />
                            </Tooltip>
                            
                        </div>
                        <div className="sidebar-tab__streams-stream_left"> 
                        <div style={{ pointerEvents: stream.is_livestream ? "auto" : "none" }}>
                            <Tooltip content="Edit" direction="right">
                                <ModeEditIcon
                                onClick={() => {
                                    const streamDetails = getStreamDetails(stream.source);
                                    console.log(stream.source)

                                    if (streamDetails) {
                                        editStreamOpen({
                                            directoryValue: streamDetails.dirs,
                                            streamName: stream.name,
                                            ipValue: streamDetails.hostname,
                                            numericValue: streamDetails.port,
                                            protocolValue: streamDetails.protocol
                                        }, setEditMode(true));
                                    }
                                }}
                                style={{
                                    width: 15,
                                    height: 15
                                }}
                                className="icon sidebar-top__icon"
                                />
                            </Tooltip>
                            </div>
                        </div>
                    </div>
              
                    <div className="sidebar-tab__streams-stream_right">
                        <div
                            className="sidebar-tab__streams-stream_title"
                            onClick={() => setStream(stream)}>
                            {truncate(stream.source, 30)}
                        </div>
                        {(stream.is_livestream == 1) ? (
                             <div className="sidebar-tab__streams-stream_info">
                                Live
                         </div>) : (
                             <div className="sidebar-tab__streams-stream_info">
                                Recorded
                         </div>
                            )}
                    </div>
                  
                    <div class="line"></div>
                </div>
                
            ))}
        </div>
    )
};

const getStreamDetails = stream => {
  stream = stream.trim();
  if (!stream.includes("://"))
    return false;
  const parts = stream.split("://");
  const protocol = parts[0];
  const rest = parts[1].split("/");
  if (rest.length == 0) {
    return false;
  } else if (rest.length == 1 && rest[0].length == 0) {
    return false;
  }
  const host = rest[0];
  const hostname = host.split(":")[0];
  const port = (host.split(":")[1])
             ? Number(host.split(":")[1])
             : null;
  const dirs = (rest.slice(1))
             ? "/" + rest.slice(1).join("/")
             : null;
  return {
    protocol, hostname, port, dirs
  };
}

function truncate(str, maxlength) {
    return (str.length > maxlength) ?
      str.slice(0, maxlength - 1) + '…' : str;
}

const SidebarStreams = props => {
    const { streams, setStream, editStreamOpen, setEditMode, edit} = props;
    return (
        <div className="sidebar-tab">
            <div className="sidebar-tab__top">
                <div className="sidebar-tab__header">
                    Feeds
                </div>
                <Button title="Add Stream" color="grey"  onClick={() => editStreamOpen(true, setEditMode(false))} />
            </div>
            <SidebarStreamList
                streams={streams}
                setStream={setStream} 
                editStreamOpen = {editStreamOpen}
                setEditMode= {setEditMode}/>
        </div>
    )
};

const Sidebar = props => {
    const { streams, setStream, setOpenExport, setOpenImport, setOpenAnalysis, editStreamOpen, setEditMode, edit} = props;

    const [tab, setTab] = useState("STREAMS");
    const [visible, setVisible] = useState(true);

    return (
        <div className="sidebar-outermost">
            {(visible) && (<div className="sidebar-outer">
                <div className="sidebar">
                    <div className="sidebar-top_outer">
                        <div className="sidebar-top_inner">
                            <div className="sidebar-top">
                                <div className="sidebar-top__title">
                                    Traffic Analysis
                                </div>
                                <div className="sidebar-top__options">
                                    <Tooltip content="User Guide" direction="bottom">
                                        <InfoOutlinedIcon
                                            onClick={() => {
                                                window.open("/guide");
                                            }}
                                            className="icon sidebar-top__icon"
                                        />
                                    </Tooltip>
                                    <Tooltip content="Stream Analysis" direction="bottom">
                                        <StorageOutlinedIcon
                                            onClick={() => setOpenAnalysis(true)}
                                            className="icon sidebar-top__icon" />
                                    </Tooltip>
                                    <Tooltip content="Import Video" direction="bottom">
                                        <FileUploadOutlinedIcon
                                            onClick={() => setOpenImport(true)}
                                            className="icon sidebar-top__icon"
                                        />
                                    </Tooltip>
                                    <Tooltip content="Export Analytics" direction="bottom">
                                        <FileDownloadOutlinedIcon
                                            onClick={() => setOpenExport(true)}
                                            className="icon sidebar-top__icon"
                                        />
                                    </Tooltip>
                                </div>
                            </div>
                            <div className="sidebar-top__subtitle">
                                University of Portsmouth
                            </div>
                        </div>
                        <div className="sidebar-top__tabs">
                            <Tooltip content="Streams" direction="bottom">
                                <VideoLibraryOutlinedIcon
                                    className={tab == "STREAMS" ? "icon-selected tab" : "icon tab"}
                                    onClick={() => setTab("STREAMS")}
                                />
                            </Tooltip>
                            <Tooltip content="Filters" direction="bottom">
                                <FilterAltOutlinedIcon
                                    className={tab == "FILTERS" ? "icon-selected tab" : "icon tab"}
                                    onClick={() => setTab("FILTERS")}
                                />
                            </Tooltip>
                            <Tooltip content="Live Video" direction="bottom">
                                <NearMeOutlinedIcon
                                    className={tab == "LIVE VIDEO" ? "icon-selected tab" : "icon tab"}
                                    onClick={() => setTab("LIVE VIDEO")}
                                />
                            </Tooltip>
                        </div>
                    </div>
                    <div className="sidebar-tabs">
                        {(tab == "STREAMS") && (
                            <SidebarStreams
                                streams={streams}
                                setStream={setStream}
                                editStreamOpen = {editStreamOpen}
                                setEditMode = {setEditMode}/>    
                        )}
                        {(tab == "FILTERS") && (
                            <SidebarFilters streams={streams} />
                        )}
                        {(tab == "LIVE VIDEO") && (
                            <SidebarLiveVideo />
                        )}
                    </div>
                </div>
            </div>)}
            <div
                className="sidebar-outer-toggle"
                onClick={() => {setVisible(!visible)}}>
                {
                    (visible) ? (
                        <KeyboardArrowLeftOutlinedIcon
                            className="sidebar-outer-toggle__icon"
                            style={{
                                color: "black",
                                width: "20",
                                height: "20"
                            }} />
                    ) : (
                        <KeyboardArrowRightOutlinedIcon
                            className="sidebar-outer-toggle__icon"
                            style={{
                                color: "black",
                                width: "20",
                                height: "20"
                            }} />
                    )
                }
            </div>
        </div>
    )
};

const mapStateToProps = state => {
    return {
       stream: state.streams.stream
    };
}

export default connect(
    mapStateToProps,
    { setStream }
)(Sidebar);