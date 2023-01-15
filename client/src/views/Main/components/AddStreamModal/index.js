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
import InputIPAddress from '../InputIPAddress';
import RestrictedNumericInput from '../RestrictedNumericInput';
import DirectoryInput from '../DirectoryInput';

// File Upload Component
import {
    FileUpload
} from '../../../../components';

// CSS
import './AddStreamModal.css';

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

const AddStreamModal = props => {
    const { open, addStreamClose } = props;
    
    const handleUploadSuccessful = () => {
        setTimeout(
            addStreamClose,
            2000);
    };

    return (
        <Modal
            open={open}
            onClose={addStreamClose}
        >
            <Box sx={style}>
                <div className="modal-title">
                    <div className="modal-title__left">
                        Add Live Stream
                    </div>
                    <div className="modal-title__right">
                        <CloseOutlinedIcon
                            className="modal-icon"
                            onClick={() => addStreamClose()}/>
                    </div>
                </div>
                <div className="modal-content">
                    <div className="modal-content__upload-msg">
                        <div><b>Port:  </b> <RestrictedNumericInput/> </div>
                        <div><b>Stream IP Address:  </b> <InputIPAddress/> </div>
                        <div><b>Directory:  </b> <DirectoryInput/> </div>
                    </div>
                </div>
            </Box>
        </Modal>
    );
}

export default AddStreamModal;