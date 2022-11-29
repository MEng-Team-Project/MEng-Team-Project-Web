// React
import React, { useEffect } from 'react';

// Redux
import { connect } from "react-redux";

// Redux Actions
import {
    getStreams
} from '../../actions/gameActions';

// CSS
import "./Main.css";

const Main = props => {
    useEffect(() => {
        props.getStreams();
    }, []);

    return (
        <div className="feed-outer">
            <video
            className="feed"
            src={(props.streams.length > 0) ? props.streams[0] : ""}
            autoPlay
            muted
            onContextMenu={e => e.preventDefault()}>
                Error retrieving video stream data.
            </video>
        </div>
    );
};

const mapStateToProps = state => {
    return {
       streams: state.streams.streams
    };
}

export default connect(
    mapStateToProps,
    { getStreams }
)(Main);