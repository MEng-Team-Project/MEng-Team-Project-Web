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
import DeckGL from "deck.gl";
import {
  SelectionLayer,
  EditableGeoJsonLayer,
  DrawLineStringMode,
  DrawPolygonMode,
  MeasureAngleMode,
  MeasureAreaMode,
  ViewMode,
  ModifyMode,
  TransformMode
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
    const [polygon, setPolygon] = useState(null);
    const [scale, setScale] = useState(null);

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
    const [features, setFeatures] = useState({
        type: "FeatureCollection",
        features: []
    });
    const [mode, setMode] = useState(() => ViewMode);
    const [selectedFeatureIndexes, setSelectedFeatureIndexes] = useState([]);

    const initialViewState = {
        longitude: -122.43,
        latitude: 37.775,
        zoom: 12
    };

    // Deck.GL editor layer
    const layer = new EditableGeoJsonLayer({
        // id: "geojson-layer",
        // selectionType: "rectangle",
        data: features,
        pickable: true,
        mode,
        onClick: (info, event) => {
            const coordCount = Array.from(info.object.geometry.coordinates)[0].length;
            console.log(coordCount);
            if (coordCount > 2) {
                console.log('Clicked:', info, event, info.object.geometry.coordinates); // , vidCoords);
                const regionIdx = info.index;
                const existingLabel = routes[regionIdx];
                const label = prompt("Set route region label", existingLabel);
                let newRoutes = [...routes];
                if (label) {
                    newRoutes[regionIdx] = label;
                } else {
                    newRoutes[regionIdx] = existingLabel;
                }
                setRoutes(newRoutes);
            }
        },
        onSelect: ({ pickingInfos }) => {
            console.log("SELECT:", pickingInfos)
            // use pickingInfos to set the SelectedFeatureIndexes
            setSelectedFeatureIndexes(pickingInfos.map((pi) => pi.index));
        
            // any other functionality for selecting, like adding id's to state
        },
        selectedFeatureIndexes,
        onEdit: ({ updatedData }) => {
            setFeatures(updatedData);
            const features    = updatedData.features;
            console.log("updatedData:", updatedData)
        },
        getLineColor: (feature) => [255, 0, 0]
    });

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

    const handleSetPolygon = polygon => {
        console.log("MAIN->handleSetPolygon:", polygon);
        setPolygon(polygon);
    };

    const handleSetScale = scale => {
        console.log("MAIN->handleSetScale:", scale);
        setScale(scale);
    };

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
                            controls
                            onContextMenu={e => e.preventDefault()}
                            onTimeUpdate={handleTimeUpdate}
                        >
                            Error retrieving video stream data.
                        </video>
                    )
                }
                 {(showEditor) && (
                    <div></div>
                )}
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
                setPolygon={handleSetPolygon}
                setScale={handleSetScale}
                polygon={polygon}
                scale={scale}
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