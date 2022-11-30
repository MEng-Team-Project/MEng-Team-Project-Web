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
    ExportModal
} from "./components";

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

/*
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
*/

const Main = props => {
    const [openExport, setOpenExport] = useState(false);
    const { streams, stream, ...rest } = props;
    const videoRef = useRef(null);

    const exportClose = () => {
        setOpenExport(false);
    };

    useEffect(() => {
        props.getStreams();
    }, []);

    /*
    style={{
        width: 352,
        height: 288
    }}
    const width  = 352;
    const height = 288;
    */

    useEffect(() => {
        console.log(videoRef.current.offsetWidth, videoRef.current.offsetHeight);
    });

    console.log("videoRef:", videoRef, videoRef==true)
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
            </div>
            <Sidebar
                streams={streams}
                setOpenExport={setOpenExport}
                />
            <ExportModal
                open={openExport}
                exportClose={exportClose}
                streams={streams} />
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