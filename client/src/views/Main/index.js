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
    Controls
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

/*
// x1, y1, x2, y2
const boundingBoxes = [
    [266.0, 74.0, 275.0, 99.0],
    [257.0, 42.0, 264.0, 62.0],
    [292.0, 225.0, 302.0, 260.0],
    [222.0, 8.0, 242.0, 37.0],
    [251.0, 104.0, 263.0, 141.0],
    [157.0, 73.0, 169.0, 104.0],
    [290.0, 150.0, 309.0, 193.0],
];
<video src={stream + "#t=0.04"} />
style={{
    top:    videoRef.current.offsetLeft + (bbox[1] * videoRef.current.clientHeight / height),
    left:   videoRef.current.offsetLeft + (bbox[0] * videoRef.current.clientWidth / width),
    width:  (bbox[2] - bbox[0]) * videoRef.current.clientWidth / width,
    height: (bbox[3] - bbox[1]) * videoRef.current.clientHeight / height
}}

{(videoRef.current) && (boundingBoxes.map((bbox, i) => (
    <BoundingBox
        key={i}
        x1={videoRef.current.offsetLeft + bbox[0]}
        y1={videoRef.current.offsetTop  + bbox[1]}
        x2={bbox[2]}
        y2={bbox[3]}
    />
)))}

const BoundingBox = props => {
    const {x1, y1, x2, y2} = props;
    return (
        <div
            className="bounding-box"
            style={{
                top: y1,
                left: x1,
                width: x2 - x1,
                height: y2 - y1
            }}
        />
    )
};

/*
style={{
    width: 352,
    height: 288
}}
const width  = 352;
const height = 288;
*/

const initialViewState = {
    longitude: -122.43,
    latitude: 37.775,
    zoom: 12
};
 
const Main = props => {
    // Modal toggles
    const [openExport,   setOpenExport]   = useState(false);
    const [openImport,   setOpenImport]   = useState(false);
    const [openAnalysis, setOpenAnalysis] = useState(false);

    // Route editor toggle
    const [showEditor,   setShowEditor]   = useState(false);

    // Deck.GL parameters
    const [features, setFeatures] = useState({
        type: "FeatureCollection",
        features: []
    });
    // const [mode, setMode] = useState(() => DrawLineStringMode);
    // const [mode, setMode] = useState(() => ViewMode);
    const [mode, setMode] = useState(() => ViewMode);
    const [selectedFeatureIndexes, setSelectedFeatureIndexes] = useState([]);

    /*
    const selectLayer = new SelectionLayer({
        id: 'selection',
        selectionType: 'rectangle',
        mode: ViewMode,
        pickable: true,
        onSelect: ({ pickingInfos }) => {
            console.log("SELECT:", pickingInfos)
            // use pickingInfos to set the SelectedFeatureIndexes
            setSelectedFeatureIndexes(pickingInfos.map((pi) => pi.index));
        
            // any other functionality for selecting, like adding id's to state
        },
        layerIds: ['geojson'],
    });
    */

    // Deck.GL editor layer
    const layer = new EditableGeoJsonLayer({
        // id: "geojson-layer",
        // selectionType: "rectangle",
        data: features,
        pickable: true,
        mode,
        onClick: (info, event) => console.log('Clicked:', info, event),
        onSelect: ({ pickingInfos }) => {
            console.log("SELECT:", pickingInfos)
            // use pickingInfos to set the SelectedFeatureIndexes
            setSelectedFeatureIndexes(pickingInfos.map((pi) => pi.index));
        
            // any other functionality for selecting, like adding id's to state
        },
        selectedFeatureIndexes,

        onEdit: ({ updatedData }) => {
            setFeatures(updatedData);
        },
        //getFillColor: (feature) => [255, 0, 0],
        getLineColor: (feature) => [255, 0, 0]
         
    });

    const { streams, stream, ...rest } = props;
    const videoRef = useRef(null);

    const analysisClose = () => {
        setOpenAnalysis(false);
    }

    const exportClose = () => {
        setOpenExport(false);
    };

    const importClose = () => {
        setOpenImport(false);
    };

    useEffect(() => {
        props.getStreams();
    }, []);

    return (
        <div className="main-root">
            <div className="feed-outer">
                <video
                    autoPlay
                    ref={videoRef}
                    className="feed"
                    src={stream}
                    muted
                    loop
                    onContextMenu={e => e.preventDefault()}
                >
                    Error retrieving video stream data.
                </video>
                {(showEditor) && (
                    <DeckGL
                        initialViewState={initialViewState}
                        controller={{
                            doubleClickZoom: false,
                            scrollZoom: false,
                            dragPan: false
                        }}
                        layers={[layer]}
                        getCursor={layer.getCursor.bind(layer)}
                    />
                )}
            </div>
            <Sidebar
                streams={streams}
                setOpenExport={setOpenExport}
                setOpenImport={setOpenImport}
                setOpenAnalysis={setOpenAnalysis}
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
            <Controls
                setMode={setMode}
                mode={mode}
                setShowEditor={setShowEditor}
                showEditor={showEditor} />
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