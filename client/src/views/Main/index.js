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
import axios from "axios";

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
    const [polygonLabel, setPolygonLabel] = useState(null);

    const { streams, stream, ...rest } = props;
    const videoRef = useRef(null);
    const [visible, setVisible] = useState(true);

    // Roads
    const [roads,        setRoads]        = useState([]);

    // Route editor toggle
    const [showEditor,   setShowEditor]   = useState(false);
    const [showControls, setShowControls] = useState(false);
    const [showMap,      setShowMap]      = useState(false);
    const [showPolygons, setShowPolygons] = useState(true);
    const [deleteMode,   setDeleteMode]   = useState(false);

    // Route mapping (route region labels)
    const [routes, setRoutes]             = useState({});

    // Video player tracking
    const [currentTime,  setCurrentTime]  = useState(0);

    // SVG sizes
    const [svgWidth,     setSvgWidth]     = useState(0);
    const [svgHeight,    setSvgHeight]    = useState(0);

    // Deck.GL parameters
    // const [features, setFeatures] = useState({
    //     type: "FeatureCollection",
    //     features: []
    // });
    const [mode, setMode] = useState(() => ViewMode);
    // const [selectedFeatureIndexes, setSelectedFeatureIndexes] = useState([]);

    // const initialViewState = {
    //     longitude: -122.43,
    //     latitude: 37.775,
    //     zoom: 12
    // };

    // Deck.GL editor layer
    // const layer = new EditableGeoJsonLayer({
    //     // id: "geojson-layer",
    //     // selectionType: "rectangle",
    //     data: features,
    //     pickable: true,
    //     mode,
    //     onClick: (info, event) => {
    //         const coordCount = Array.from(info.object.geometry.coordinates)[0].length;
    //         console.log(coordCount);
    //         if (coordCount > 2) {
    //             console.log('Clicked:', info, event, info.object.geometry.coordinates); // , vidCoords);
    //             const regionIdx = info.index;
    //             const existingLabel = routes[regionIdx];
    //             const label = prompt("Set route region label", existingLabel);
    //             let newRoutes = [...routes];
    //             if (label) {
    //                 newRoutes[regionIdx] = label;
    //             } else {
    //                 newRoutes[regionIdx] = existingLabel;
    //             }
    //             setRoutes(newRoutes);
    //         }
    //     },
    //     onSelect: ({ pickingInfos }) => {
    //         console.log("SELECT:", pickingInfos)
    //         // use pickingInfos to set the SelectedFeatureIndexes
    //         setSelectedFeatureIndexes(pickingInfos.map((pi) => pi.index));
        
    //         // any other functionality for selecting, like adding id's to state
    //     },
    //     selectedFeatureIndexes,
    //     onEdit: ({ updatedData }) => {
    //         setFeatures(updatedData);
    //         const features    = updatedData.features;
    //         console.log("updatedData:", updatedData)
    //     },
    //     getLineColor: (feature) => [255, 0, 0]
    // });

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

    // Sidebar stream periodic refreshing (every 3 seconds)
    useEffect(() => {
        const intervalId = setInterval(() => {
          props.getStreams();
        }, 3000);
      
        return () => clearInterval(intervalId);
    }, []);

    // Adjust SVG polygon display on init and whenever page size changes
    useEffect(() => {
        const adjustSize = () => {
            let width = 0, height = 0;
            if (videoRef.current) {
                width = videoRef.current.videoWidth * (videoRef.current.offsetHeight / videoRef.current.videoHeight);
                height = videoRef.current.videoHeight * (videoRef.current.offsetWidth / videoRef.current.videoWidth);
            }
            setSvgWidth(width);
            setSvgHeight(height);
        }
        window.addEventListener('resize', adjustSize);
        setTimeout(() => adjustSize(), 1000);
        return () => {
            window.removeEventListener('resize', adjustSize);
        };
    }, []);

    // Load polygons on init
    useEffect(() => {
        console.log("Stream:", stream.name);
        if (stream) {
            axios
                .get(`/api/routes?stream_name=${stream.name}`)
                .then(res => {
                        try {
                            const data = res.data[0].polygon_json;
                            console.log("GET /api/routes/ response:", data, typeof(data));
                            setRoutes(JSON.parse(data));
                        } catch {
                            console.log("GET /api/routes/ response: err")
                        }
                })
                .catch(err => console.error(`Error loading existing polygons for stream: ${stream.name}`, err))
        }
    }, [stream]);

    //check /livestream or /stream
    const isLivestream = (stream.is_livestream);
    
    // Wrapper function around set routes, this will also update it in the backend simultaneously
    const handleSetRoutes = data => {
        // Send new route data to backend
        const payload = {
            "stream_name": stream.name,
            "polygon_json": routes
        }

        // Make a POST request using Axios
        axios.post('/api/routes/set', payload)
            .then(response => {
                console.log('Response:', response.data);
            })
            .catch(error => {
                console.error('Error:', error);
            });

        // Set routes
        setRoutes(data);
    };

    // Either allow renaming of an existing polygon or handle deleting of it
    const handleSAMPolygonClick = (e, oldLabel, polygonData) => {
        if (!deleteMode) {
            const label = prompt(`Set new route region label. The current label is "${oldLabel}".`, oldLabel);
            const newLabel = (label) ? label : oldLabel;
            let newRoutes = routes;
            delete newRoutes[oldLabel];
            newRoutes[newLabel] = polygonData;
            handleSetRoutes(newRoutes);
        } else {
            const result = window.confirm(`Do you want to delete the ${oldLabel} route region?`);
            if (result) {
                let newRoutes = routes;
                delete newRoutes[oldLabel];
                handleSetRoutes(newRoutes);
            }
        }
    };

    // Handle changing of showEditor, as displaying the SAM model implicitly means creating a new polygon
    // As we're storing the polygons in a dictionary, it's more convenient to force the user to label the
    // route region before we store it
    const handleSetShowEditor = (val) => {
        // Set value regardless
        setShowEditor(val);

        // If true, then we're creating a new value and we'll store that in a temp variable
        const label = prompt("Set route region label", "");
        setPolygonLabel(label);
    };

    // When the SAM modal is closed, we need to handle properly adding the new route region polygon data to the `routes`
    const handleSAMClose = val => {
        // Close the SAM modal
        editorClose(val);

        // Add route region to `routes`. Do this after 1 second to be safe, this is a scuffed solution but should be fine.
        setTimeout(() => {
            let newRoutes = routes;
            routes[polygonLabel] = {
                "data": polygon,
                "scale": scale
            };
            handleSetRoutes(newRoutes);
        }, 1000);
    }

    return (
        <div className="main-root">
            <div className="feed-outer">
                {
                    (isLivestream) ? ( 
                        <ReactHlsPlayer
                            ref={videoRef}
                            src="./livestream/tes/output.m3u8"
                            autoPlay={true}
                            controls={showControls}
                            onContextMenu={e => e.preventDefault()}
                            className="feed"
                        />
                    ) : (
                        <video
                            autoPlay
                            ref={videoRef}
                            className="feed"
                            controls={true}
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
                {(showPolygons) && (
                    <svg
                        className="svg-overlay"
                        width={parseInt(svgWidth)}
                        height={parseInt(svgHeight)}
                        viewBox="0 0 1024 576"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        {/* polygon data and scale needs to be extracted from each dict entry (polygon && scale && svgWidth && svgHeight) && ( */}
                        {(routes && svgWidth && svgHeight) && Object.entries(routes).map((polygon, i) => (
                            <path
                                key={i}
                                onClick={(e) => handleSAMPolygonClick(e, polygon[0], polygon[1])}
                                className="svg-outline svg-filled"
                                d={polygon[1].data}
                            />
                        ))}
                    </svg>
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
                showMap={showMap}
                setShowMap={setShowMap}
                edit = {edit}
                setVisible = {setVisible}
                visible = {visible}
                routes = {routes}
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
                segmentClose={handleSAMClose}
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
                setShowEditor={handleSetShowEditor}
                showEditor={showEditor}
                showMap={showMap}
                setShowMap={setShowMap}
                showControls={showControls}
                setShowControls={setShowControls}
                deleteMode={deleteMode}
                setDeleteMode={setDeleteMode}
                showPolygons={showPolygons}
                setShowPolygons={setShowPolygons}/>
            {(showMap) && (
                <AnalysisMap
                    roads={(routes) ? Object.keys(routes) : []}
                    setVisible = {setVisible}
                    visible = {visible}
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