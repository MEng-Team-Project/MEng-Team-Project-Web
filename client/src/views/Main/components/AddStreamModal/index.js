/*
<ImportModal /> which uses the <FileUpload /> component to upload .mp4
video recordings for testing.
*/

// React
import React, { useState } from "react";

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
    FileUpload,
    Button
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
    const [directoryValue, setDirectoryValue] = useState("");
    const [ipValue, setIpValue] = useState("");
    const [numericValue, setNumericValue] = useState("");
    
    const handleInputIPChange = (value) => {
        setIpValue(value);
    };
    
    const handleNumericChange = (value) => {
        setNumericValue(value);
    };
    
    const handleDirectoryChange = (value) => {
        setDirectoryValue(value);
    }
    
    const handleSubmit = () => {
        if (directoryValue && ipValue && numericValue ) {
            console.log("Directory value:", directoryValue);
            console.log("IP value:", ipValue);
            console.log("Numeric value:", numericValue);
            setTimeout(
                addStreamClose,
                1000);
        } else {
            console.log("one or more invalid fields");
        }
        
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
                        <div><b>Port:  </b> <RestrictedNumericInput onValueChange={(value) => handleNumericChange(value)}/> </div>
                        <div><b>Stream IP Address:  </b> <InputIPAddress onValueChange={(value) => handleInputIPChange(value)}/> </div>
                        <div><b>Directory:  </b> <DirectoryInput onValueChange={(value) => handleDirectoryChange(value)}/> </div>
                    </div>
                    <div>
                    <Button title="Add" color="grey"  onClick={() => handleSubmit()} />
                    </div>
                </div>
            </Box>
        </Modal>
    );
}

export default AddStreamModal;