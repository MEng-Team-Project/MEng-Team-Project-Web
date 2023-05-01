/*
Main frontend page the end user will interact with our client with.
Provides the main maintenance screen to view any stream (live or recorded),
live analytical information, top-down map view, etc.

Also provides the user with ways to interact with our backend through modals
(i.e. pop-up windows) such as uploaded test recorded video, choosing which
livestreams to process for analysis, etc.
*/

// React
import React, { useState, useEffect, useRef } from 'react';

// Redux
import { connect } from "react-redux";

// Redux Actions
import {
    getStreams
} from '../../actions/streamActions';

// CSS
import "./Main.css";

// Components
import {
    Sidebar,
    ExportModal,
    ImportModal,
    AnalysisModal,
    EditStreamModal,
    Controls,
    AnalysisMap,
    SegmentModal
} from "./components";

// HLS Player
import ReactHlsPlayer from 'react-hls-player';

// Polygon Modules
import {
  ViewMode
} from "nebula.gl";
import {WebMercatorViewport} from '@deck.gl/core';

const Main = props => {
    // Modal toggles
    const [openExport,      setOpenExport]     = useState(false);
    const [openImport,      setOpenImport]     = useState(false);
    const [openAnalysis,    setOpenAnalysis]   = useState(false);
    const [openAddStreams,  setOpenAddStream]  = useState(false);
    const [openEditStreams, setOpenEditStream] = useState(false);
    const [streamDetails,   setStreamDetails]  = useState({
        directory: "",
        streamName: "",
        ipValue: "",
        port: "",
        protocol: ""
    });
    const [edit, setEdit] = useState(false);

    const { streams, stream, ...rest } = props;
    const videoRef = useRef(null);

    // Route editor toggle
    const [showEditor,   setShowEditor]   = useState(false);
    const [showMap,      setShowMap]      = useState(false);

    // Route mapping
    const [routes, setRoutes]             = useState([]);

    // Video player tracking
    const [currentTime,  setCurrentTime]  = useState(0);

    // Deck.GL parameters
    const [mode, setMode] = useState(() => ViewMode);

    const handleTimeUpdate = () => {
        setCurrentTime(videoRef.current.currentTime);
    };

    const analysisClose = () => {
        setOpenAnalysis(false);
    }

    const exportClose = () => {
        setOpenExport(false);
    };

    const importClose = () => {
        setOpenImport(false);
    };

    const addStreamClose = () => {
        setOpenAddStream(false);
    };

    const editStreamClose = () => {
        setOpenEditStream(false);
    };

    const editStreamOpen = (streamDetails, value) => {
        setStreamDetails(streamDetails);
        setOpenEditStream(true);
    };

    const setEditMode = (value) => {
        setEdit(value);
    };

    const editorClose = () => {
        setShowEditor(false);
    }

    useEffect(() => {
        const intervalId = setInterval(() => {
          props.getStreams();
        }, 3000);
      
        return () => clearInterval(intervalId);
    }, []);

    const isLivestream = (stream.is_livestream); //check /livestream or /stream

    // console.log("SegmentModal main check:", videoRef.current.width, videoRef.current.height);
   
    return (
        <div className="main-root">
            <div className="feed-outer">
                {
                    (isLivestream) ? ( 
                        <ReactHlsPlayer
                            ref={videoRef}
                            src="./livestream/tes/output.m3u8"
                            autoPlay={true}
                            controls={true}
                            onContextMenu={e => e.preventDefault()}
                            className="feed"
                        />
                    ) : (
                        <video
                            autoPlay
                            ref={videoRef}
                            className="feed"
                            src={`/streams/${stream.source}`}
                            muted
                            loop
                            onContextMenu={e => e.preventDefault()}
                            onTimeUpdate={handleTimeUpdate}
                        >
                            Error retrieving video stream data.
                        </video>
                    )
                }
            </div>
            <Sidebar
                streams={streams}
                setOpenExport={setOpenExport}
                setOpenImport={setOpenImport}
                setOpenAnalysis={setOpenAnalysis}
                setOpenAddStream={setOpenAddStream}
                editStreamOpen={editStreamOpen}
                setEditMode = {setEditMode}
                edit = {edit}
                />
            <ExportModal
                open={openExport}
                exportClose={exportClose}
                streams={streams} />
            <ImportModal
                open={openImport}
                importClose={importClose}
                streams={streams} />
            <AnalysisModal
                open={openAnalysis}
                analysisClose={analysisClose}
                streams={streams} />
            <EditStreamModal
                open={openEditStreams}
                editStreamOpen={editStreamOpen}
                editStreamClose={editStreamClose}
                streamDetails={streamDetails}
                streams={streams}
                setEditMode = {setEditMode}
                edit = {edit}
                />
            <SegmentModal
                videoRef={videoRef}
                open={showEditor}
                segmentClose={editorClose}
                />
            <Controls
                stream={stream}
                currentTime={currentTime}
                setMode={setMode}
                mode={mode}
                setShowEditor={setShowEditor}
                showEditor={showEditor}
                showMap={showMap}
                setShowMap={setShowMap} />
            {(showMap) && (
                <AnalysisMap
                    routes={routes}
                />
            )}
        </div>
    );
};

const mapStateToProps = state => {
    return {
       streams: state.streams.streams,
       stream: state.streams.stream
    };
}

export default connect(
    mapStateToProps,
    { getStreams }
)(Main);