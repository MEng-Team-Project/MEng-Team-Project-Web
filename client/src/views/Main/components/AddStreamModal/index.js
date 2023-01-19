/*
<ImportModal /> which uses the <FileUpload /> component to upload .mp4
video recordings for testing.
*/

// React
import React, { useState } from "react";
import axios from "axios";

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
    const [streamName, setStreamName] = useState("");
    const [ipValue, setIpValue] = useState("");
    const [numericValue, setNumericValue] = useState("");
    const [protocolValue, setProtocolValue] = useState("");
    const protocolOptions = ["rtmp", "rstp"];
    
    const handleInputIPChange = (value) => {
        setIpValue(value);
    };
    
    const handleNumericChange = (value) => {
        setNumericValue(value);
    };
    
    const handleDirectoryChange = (value) => {
        setDirectoryValue(value);
    };

    const handleStreamNameChange = (value) => {
        setStreamName(value);
    };

    const handleProtocolChange = (e) => {
        setProtocolValue(e.target.value);
        console.log(e);
    };
    
    const handleSubmit = () => {
        console.log(directoryValue, ipValue, streamName);
        if (directoryValue && ipValue && streamName) {
            const liveStreamDetails = {"directory": directoryValue, "ip": ipValue, "port": numericValue, "streamName": streamName, "protocol": protocolValue};
            axios
            .post("/api/streams/add", liveStreamDetails)
            .then(res => {
                setIpValue("");
                setNumericValue("");
                setDirectoryValue("");
                setStreamName("");
                setProtocolValue("");
            })
            .catch(err => {
                console.log(err.response.data);
            })
            setTimeout(
                addStreamClose,
                500);
        } else {
            window.alert("One or more invalid fields");
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
                        <div><b>Stream Name:  </b> <DirectoryInput onValueChange={(value) => handleStreamNameChange(value)}/> </div>
                        <div><b>Protocol:  </b>
                        <select onChange= {handleProtocolChange}>
                            {protocolOptions.map((protocol, i) => (
                                 <option
                                 selected = {(i == 0) ? "selected": ""}
                                 key={i} value={protocol}>
                                    {protocol.toUpperCase()}
                                 </option>
                            ))}    
                        </select></div>
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