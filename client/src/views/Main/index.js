// React
import React from 'react';

// CSS
import "./Main.css";

const testUrl = "/streams/00001.06585.mp4";

const Main = props => {
    return (
        <div className="feed-outer">
            <video
            className="feed"
            src={testUrl}
            autoPlay
            muted
            onContextMenu={e => e.preventDefault()}>
                Error retrieving video stream data.
            </video>
        </div>
    );
};

export default Main;