// React
import React, { useEffect, useState } from 'react';

// Material UI
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

// Icons
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';

// Resources
import './ExportModal.css';
// import {ReactComponent as JSONIcon} from './json_icon.svg';

// Global Components
import {
    Button
} from '../../../../components';
import axios from 'axios';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 700,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 0,
    borderRadius: '5px'
};

const FileIcon = () => {
    return (
        <div className="modal-file-icon" height="80px">
            <svg viewBox="0 0 64 64" width="80px" height="80px" className="data-ex-icons-file" fill="rgb(15, 150, 104)">
                <path d="M49.61,20.51,36.56,7.46a1.36,1.36,0,0,0-.32-.24,1.6,1.6,0,0,0-.39-.14,1.53,1.53,0,0,0-.26,0H15.38A1.39,1.39,0,0,0,14,8.45v47.1a1.39,1.39,0,0,0,1.39,1.39H48.63A1.39,1.39,0,0,0,50,55.55V21.48A1.4,1.4,0,0,0,49.61,20.51Zm-1,35H15.38V8.45h19.4V20.92a1.39,1.39,0,0,0,1.39,1.39H48.63Z"></path>
            </svg>
            <div fontSize="11px" className="text-outer">
                <div className="text">JSON</div>
            </div>
        </div>
    );
}

const ExportModal = props => {
    const { open, exportClose, streams } = props;
    const [selectedStream, setSelectedStream ] = useState("");

    /*
    useEffect(() => {
        props.getGames();
    }, [open]);
    */
    
    useEffect(() => {
        if (streams.length > 0) {
            setSelectedStream(streams[0]);
        }
    }, [streams]);

    const downloadStream = (id) => {
        if (id) {
            const fnameToId = s => {
                s = s.split("/")
                s = s[s.length - 1]
                s = s.split(".")
                s = s.slice(0, s.length - 1)
                s = s.join(".");
                return s;
            }
            const downloadId = fnameToId(id);
            window.open(`http://147.189.199.122:5000/api/analysis/download?stream=${downloadId}`);
        }
    };

    return (
        <Modal
            open={open}
            onClose={exportClose}
        >
            <Box sx={style}>
                <div className="modal-title">
                    <div className="modal-title__left">
                        Export Analytics
                    </div>
                    <div className="modal-title__right">
                        <CloseOutlinedIcon
                            className="modal-icon"
                            onClick={() => exportClose()}/>
                    </div>
                </div>
                <div className="modal-content">
                    <div className="modal-export_option">
                        <div className="modal-export_option_info">
                            <div className="modal-export_option_info__title">
                                Dataset
                            </div>
                            <div className="modal-export_option_info__desc">
                                Choose the video analysis dataset you want to export
                            </div>
                        </div>
                        <div className="modal-export-option__fields">
                            <select
                                onChange={e => setSelectedStream(e.target.value)}
                            >
                                {/*
                                <option key={0} value="all">
                                    All
                                </option>
                                */}
                                {streams.map((stream, i) => (
                                    <option key={i+1} value={stream}>
                                        {stream}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="modal-export_option">
                        <div className="modal-export_option__info">
                            <div className="modal-export_option_info__title">
                                Data Type
                            </div>
                            <div className="modal-export_option_info__desc">
                                Choose the data export format
                            </div>
                        </div>
                        <div className="modal-export-option__fields">
                            <select>
                                <option value="json">
                                    JSON
                                </option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className="modal-options">
                    <Button
                        noAdd
                        color="transparent"
                        title="Cancel"
                        onClick={exportClose}/>
                    <Button
                        noAdd
                        color="green"
                        title="Export"
                        onClick={() => downloadStream(selectedStream) } />
                </div>
            </Box>
        </Modal>
    )
};

export default ExportModal;