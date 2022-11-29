// React
import React, { useEffect } from 'react';

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
    Sidebar
} from "./components";

const Main = props => {
    const { streams, stream, ...rest } = props;
    useEffect(() => {
        props.getStreams();
    }, []);

    return (
        <div className="main-root">
            <div className="feed-outer">
                <video
                className="feed"
                src={stream}
                autoPlay
                muted
                loop
                onContextMenu={e => e.preventDefault()}>
                    Error retrieving video stream data.
                </video>
            </div>
            <Sidebar streams={streams} />
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