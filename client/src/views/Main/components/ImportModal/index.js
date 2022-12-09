/*
<ImportModal /> which uses the <FileUpload /> component to upload .mp4
video recordings for testing.
*/

// React
import React from 'react';

// Material UI
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

// Icons
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';

// File Upload Component
import {
    FileUpload
} from '../../../../components';

// CSS
import './ImportModal.css';

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

const ImportModal = props => {
    const { open, importClose } = props;
    
    const handleUploadSuccessful = () => {
        setTimeout(
            importClose,
            2000);
    };

    return (
        <Modal
            open={open}
            onClose={importClose}
        >
            <Box sx={style}>
                <div className="modal-title">
                    <div className="modal-title__left">
                        Import a Video Recording
                    </div>
                    <div className="modal-title__right">
                        <CloseOutlinedIcon
                            className="modal-icon"
                            onClick={() => importClose()}/>
                    </div>
                </div>
                <div className="modal-content">
                    <div className="modal-content__upload-msg">
                        Upload an <b>MP4</b> stream recording.
                    </div>
                    <FileUpload
                        handleUploadSuccessful={handleUploadSuccessful}
                        message="Drag & Drop Your Video(s) Here" />
                </div>
            </Box>
        </Modal>
    );
}

export default ImportModal;