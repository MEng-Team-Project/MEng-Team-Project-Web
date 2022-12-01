// React
import React, { useState, useEffect } from 'react';

// Redux
import { connect } from "react-redux";

// Redux Actions
import {
    getStreams,
} from '../../../../actions/streamActions';

// Material UI
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

// Icons
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';

// Moment
import moment from 'moment';

// CSS
import './AnalysisModal.css';

// Global Components
import {
    Button,
    Tooltip
} from '../../../../components';
import axios from 'axios';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 800,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 0,
    borderRadius: '5px'
};

const ModalTable = props => {
    const { data } = props;
    console.log("ModalTable:", data);
    return (
        <div className="modal-table">
            <div className="modal-table__header">
                <div className="modal-table__header-cell modal-table__header-cell-gameid">
                    StreamID
                </div>
                <div className="modal-table__header-cell modal-table__header-cell-gameid">
                    Date
                </div>
                <div className="modal-table__header-cell modal-table__header-cell-flex">
                    Progress
                </div>
                <div className="modal-table__header-cell modal-table__header-cell-status">
                    Status
                </div>
            </div>
            {data.map((row, i) => (
                <div key={i} className="modal-table__rows">
                    <div className="modal-table__row">
                        <div className="modal-table__cell modal-table__cell-gameid">
                            {row.stream}
                        </div>
                        <div className="modal-table__cell modal-table__cell-gameid">
                            <Tooltip
                                direction="top"
                                content={moment(row.creation_date).format()}
                            >
                                {moment(row.creation_date).fromNow()}
                            </Tooltip>
                        </div>
                        <div className="modal-table__cell modal-table__cell-flex">
                            {(row.progress) && (
                                ((!isNaN(row.progress)) && (
                                    (Math.ceil(parseFloat(row.progress))
                                     / 60) * 100
                                     .toFixed(2) + "%"
                                ))
                            )}
                        </div>
                        <div className="modal-table__cell modal-table__cell-status">
                            {(!row.processing_status) ? (
                                <Button
                                    noAdd
                                    color="green"
                                    title="Process"
                                    onClick={() => {
                                        const gameId = row.game_id.split("-")

                                        // game_id
                                        const game_id = gameId[1];

                                        // region
                                        const region = 
                                        (gameId[0][gameId[0].length-1] == "1")
                                        ? gameId[0].substring(0, gameId[0].length-1)
                                        : gameId[0];

                                        axios.post(`/api/games/process?game_id=${game_id}&region=${region}`)
                                            .then(res => console.log(res.data))
                                    }}/>
                            ) : (
                                <div 
                                    style={{
                                    textAlign: "center"
                                    }}
                                >
                                    <Button
                                        noAdd
                                        color="grey"
                                        title="Done"
                                        style={{
                                            color: "white"  
                                        }}/>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

const AnalysisModal = props => {
    const { open, analysisClose, streams, ...rest  } = props;

    const data = streams.map((stream, i) => ({
        "stream": stream,
        "creation_date": moment().format(),
    }));

    useEffect(() => {
        props.getStreams();
    }, []);

    const closeHandler = () => {
        analysisClose();
    }

    return (
        <Modal
            open={open}
            onClose={closeHandler}
        >
            <Box sx={style}>
                <div className="modal-title">
                    <div className="modal-title__left">
                        Video Analytics
                    </div>
                    <div className="modal-title__right">
                        <CloseOutlinedIcon
                            className="modal-icon"
                            onClick={closeHandler}/>
                    </div>
                </div>
                <div className="modal-content">
                    <ModalTable
                        data={data}
                    />
                </div>
            </Box>
        </Modal>
    )
};

const mapStateToProps = state => {
    return {
       streams: state.streams.streams
    };
}

export default connect(
    mapStateToProps,
    { getStreams }
)(AnalysisModal);