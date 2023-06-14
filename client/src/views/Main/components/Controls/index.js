/*
This is the top-right widget on the <MainView /> which controls the state
of the route editing tool. Currently relies on Deck.GL in a very scuffed way.
Deck.GL's GeoJSON editing tool provides lat, lng co-ordinates based on the drawn
line / polygon. My idea here was to translate this into the relative screen
co-ordinates and get the route polygon co-ordinates like this, however it will
probably be better to use Gary's idea of figuring out where people actually go
most of the time based on the predicted routes from the ML model. We'll see.
*/

// React
import React, { useState, useEffect } from 'react';

// Icons
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import HighlightAltOutlinedIcon from '@mui/icons-material/HighlightAltOutlined';
import PolylineOutlinedIcon from '@mui/icons-material/PolylineOutlined';
import ShapeLineOutlinedIcon from '@mui/icons-material/ShapeLineOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import AnalyticsOutlinedIcon from '@mui/icons-material/AnalyticsOutlined';
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';

// Global Components
import {
    Tooltip
} from '../../../../components';

// Editor Modes
import {
    DrawLineStringMode,
    DrawPolygonMode,
    MeasureAngleMode,
    MeasureAreaMode,
    ViewMode,
    ModifyMode,
    TranslateMode,
    TransformMode
} from "nebula.gl";

// CSS
import "./Controls.css"

const EditorControl = props => {
    const { title, children, onClick, selected } = props;
    const className = (!selected)
                    ? "controls-editor__option"
                    : "controls-editor__option controls-editor__option-selected";
    return (
        <div onClick={onClick} className={className}>
            <div className="controls-editor__option-icon">
                {children}
            </div>
            <div className="controls-editor__option-label">
                {title}
            </div>
        </div>
    )
}

const CHECK_MODE = (mode) => {
    switch (mode.toString()) {
        case (ModifyMode).toString():
            return "SELECT";
        case (DrawLineStringMode).toString():
            return "LINE";
        case (DrawPolygonMode).toString():
            return "POLYGON"
        default:
            return ""
    }
};

const EditorControls = props => {
    const { setMode, mode, showEditor, setShowEditor } = props;
    const CUR_MODE = CHECK_MODE(mode);

    return (
        <div className="controls-editor">
            <EditorControl
                title="Select"
                selected={CUR_MODE == "SELECT"}
                onClick={() => setMode(() => ModifyMode)}
            >
                <HighlightAltOutlinedIcon/>
            </EditorControl>
            <EditorControl
                title="Polygon"
                selected={CUR_MODE == "POLYGON"}
                onClick={() => setMode(() => DrawPolygonMode)}
            >
                <PolylineOutlinedIcon />
            </EditorControl>
            <EditorControl
                title="Line"
                selected={CUR_MODE == "LINE"}
                onClick={() => setMode(() => DrawLineStringMode)}
            >
                <ShapeLineOutlinedIcon />
            </EditorControl>
            <EditorControl
                onClick={() => setShowEditor(!showEditor)}
                title={(showEditor) ? "Hide" : "Show"}
            >
                {(showEditor) ? (
                    <VisibilityOutlinedIcon />
                ) : (
                    <VisibilityOffOutlinedIcon/>
                )}
            </EditorControl>
        </div>
    );
};

const Analytics = props => {
    const [metadata, setMetadata] = useState({});
    const [data, setData] = useState([]);
    const [lastTime, setLastTime] = useState(0.0);
    const { stream, currentTime } = props;

    // NOTE: We need to reset time tracking variables if looped recorded video being played
    if (lastTime > currentTime)
        setLastTime(0);

    // Get metadata for current stream
    useEffect(() => {
        const streamSource = stream.source;
        console.log("streamSource:", streamSource);
        fetch(`/api/analysis`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                "stream": streamSource,
                "start": 1,
                "end": 10000 // NOTE: Just set this as high as possible
            })
        })
            .then(res => res.json())
            .then(data => setMetadata(data["metadata"]))
            .catch(err => {setMetadata({}) ; console.log(err)})
    }, [stream]);

    const getData = async () => {
        if (Object.keys(metadata).length > 0) {
            const start = parseInt(currentTime * metadata["fps"]);
            const end   = parseInt(
                (currentTime * metadata["fps"]) + (metadata["fps"]));
            console.log(stream, start, end);
            const streamSource = stream.source;
            const response = await fetch(`/api/analysis`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    "stream":  streamSource,
                    "trk_fmt": "first_last",
                    "start":   start,
                    "end":     end
                })
            });
            if (response.ok) {
                console.log("COUNTS UPDATED")
                const json_data = await response.json();
                setData(json_data["counts"]);
            } else {
                console.log("COUNTS NOT UPDATED")
                setData([]);
            }
            setLastTime(currentTime);
        }
    };

    // NOTE: Need to throttle analytics or it can be over 30Hz depending on the browser
    if ((currentTime - lastTime) >= 1) {
        getData();
    }

    return (
        <div className="controls-analytics">
            <div className="controls-analytics__title">
                Analytics
            </div>
            <div className="controls-analytics__section">
                <div className="controls-analytics__section-title">
                    Counts
                </div>
                {data.map((data, i) => (
                    <div key={i} className="controls-analytics__data-row">
                        <div className="controls-analytics__data-cell-flex">{data["label"]}</div>
                        <div className="controls-analytics__data-cell-fixed">{data["count"]}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}

const Controls = props => {
    const { stream, currentTime, setMode, mode, showEditor, setShowEditor, showMap, setShowMap } = props;
    const [showEditorControls, setShowEditorControls] = useState(false);
    const [showAnalytics, setShowAnalytics] = useState(false);

    const toggleEdit = () => {
        setShowEditorControls(!showEditorControls);
    }

    const toggleAnalytics = () => {
        setShowAnalytics(!showAnalytics);
    }

    const toggleMap = () => {
        setShowMap(!showMap);
    }

    return (
        <div className="controls-outermost">
            <div className="controls-outer">
                {(showEditorControls) && (
                    <EditorControls
                        setMode={setMode}
                        mode={mode}
                        showEditor={showEditor}
                        setShowEditor={setShowEditor}
                        />
                )}
                <div className="controls">
                    <Tooltip content="Draw Routes" direction="left">
                        <ModeEditOutlineOutlinedIcon
                            onClick={toggleEdit}
                            className="icon controls-icon"
                            sx={{
                                color: (showEditor) ? "white" : "rgb(106, 116, 133)"
                            }}/>
                    </Tooltip>
                    <Tooltip content="Toggle Map" direction="left">
                        <MapOutlinedIcon
                            onClick={toggleMap}
                            className="icon controls-icon"
                            sx={{
                                color: (showMap) ? "white" : "rgb(106, 116, 133)"
                            }}/>
                    </Tooltip>
                    <Tooltip content="Analytics" direction="left">
                        <AnalyticsOutlinedIcon
                            onClick={toggleAnalytics}
                            className="icon controls-icon"
                            sx={{
                                color: (showAnalytics) ? "white" : "rgb(106, 116, 133)"
                            }}/>
                    </Tooltip>
                </div>
                {(showAnalytics) && (
                    <Analytics
                        stream={stream}
                        currentTime={currentTime}/>
                )}
            </div>
        </div>
    )
}

export default Controls;