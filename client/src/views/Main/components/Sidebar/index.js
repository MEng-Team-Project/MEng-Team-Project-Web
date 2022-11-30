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

// Global Components
import {
    Tooltip,
    Button,
    Dropdown
} from '../../../../components';

// CSS
import "./Sidebar.css"

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
            </div>
        </div>
    );
}
const SidebarFilter = props => {
    const { values, datasources, deleteFilter } = props;
    const dropdownDatasources = 
        datasources.map(datasource => ({
            "meta": "rgb(60, 97, 174)",
            "data": datasource
        }));
    
    return (
        <div className="sidebar-filter">
            <div className="sidebar-filter__field">
                <Dropdown
                    values={[
                        {
                            meta: "float",
                            data: "time"
                        },
                    ]}
                    placeholder={"Select a filter"}
                    type={"type"} />
                <DeleteOutlineOutlinedIcon
                    className="delete-icon"
                    onClick={() => {
                        deleteFilter(values)
                    }}
                    style={{
                        width: 15,
                        height: 15
                    }}
                />
            </div>
            <div className="sidebar-filter__data-source">
                <div className="sidebar-filter-text">
                    Data Source
                </div>
                <Dropdown
                    values={dropdownDatasources}
                    placeholder={"Select a data source"}
                    init={0}
                    type={"dot"} />
            </div>
        </div>
    )
};

const SidebarFilters = props => {
    const { streams } = props;
    const [filters, setFilters] = useState([
        0
    ]);
    
    const deleteFilter = values => {
        setFilters(filters.filter(val => val != values))
    };

    return (
        <div className="sidebar-tab">
            <div className="sidebar-tab__top">
                <div className="sidebar-tab__header">
                    Filters
                </div>
                <Button title="Add Filter" color="green" />
            </div>
            <div className="sidebar-spacing" />
            {filters.map((values, i) =>
                <SidebarFilter
                    key={i}
                    values={values}
                    datasources={streams}
                    deleteFilter={deleteFilter} /> )}
        </div>
    );
};

const SidebarStreamList = props => {
    const { streams, setStream } = props;
    return (
        <div className="sidebar-tab__streams">
            {streams.map((stream, i) => (
                <div key={i} className="sidebar-tab__streams-stream_outer">
                    <div className="sidebar-tab__streams-stream_left">
                        <Tooltip content="Change Colour" direction="right">
                            <div className="sidebar-tab__streams-stream_square" />
                        </Tooltip>
                    </div>
                    <div className="sidebar-tab__streams-stream_right">
                        <div
                            className="sidebar-tab__streams-stream_title"
                            onClick={() => setStream(stream)}>
                            {stream}
                        </div>
                        <div className="sidebar-tab__streams-stream_info">
                            Recorded
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
};

const SidebarStreams = props => {
    const { streams, setStream } = props;
    return (
        <div className="sidebar-tab">
            <div className="sidebar-tab__top">
                <div className="sidebar-tab__header">
                    Streams
                </div>
                <Button title="Add Stream" color="grey" />
            </div>
            <SidebarStreamList
                streams={streams}
                setStream={setStream} />
        </div>
    )
};

const Sidebar = props => {
    const { streams, setStream, setOpenExport } = props;

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
                                    <Tooltip content="Export" direction="bottom">
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
                                setStream={setStream} />
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