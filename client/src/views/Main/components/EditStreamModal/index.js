// React
import React, { useState, useEffect } from "react";
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
import './EditStreamModal.css';

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

const EditStreamModal = props => {
    const { open, editStreamOpen, editStreamClose, streamDetails} = props;
    console.log(">>>>>deets:", streamDetails);
    const protocolOptions = ["rtmp", "rstp"];

    const [directoryValue, setDirectoryValue] = useState(streamDetails ? streamDetails.directoryValue : "");
    const [streamName, setStreamName] = useState(streamDetails ? streamDetails.streamName : "");
    const [ipValue, setIpValue] = useState(streamDetails ? streamDetails.ipValue : "");
    const [numericValue, setNumericValue] = useState(streamDetails ? streamDetails.numericValue : "");
    const [protocolValue, setProtocolValue] = useState(streamDetails ? streamDetails.protocolValue : "");

    useEffect(() => {
        if (streamDetails) {
            setDirectoryValue(streamDetails.directoryValue);
            setStreamName(streamDetails.streamName);
            setIpValue(streamDetails.ipValue);
            setNumericValue(streamDetails.numericValue);
            setProtocolValue(streamDetails.protocolValue);
        }
    }, [streamDetails]);
    
    const ogSource =  `${protocolValue}://${ipValue}${numericValue}/${directoryValue}`;
            console.log(">>>source ",ogSource);
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
        console.log("handleProtocolChange:", e.target.value);
    };
    
    const handleSubmit = () => {
        console.log("edit stream info:", directoryValue, ipValue, streamName);
        if (directoryValue && ipValue && streamName) {
            const liveStreamDetails = {"directory": directoryValue, "ip": ipValue, "port": numericValue, "streamName": streamName, "protocol": protocolValue, "ogSource": ogSource};
            axios
            .post("/api/streams/edit", liveStreamDetails)
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
                editStreamClose,
                500);
        } else {
            window.alert("One or more invalid fields");
        }
    };

    return (
        <Modal
            open={open}
            onClose={editStreamClose}
        >
            <Box sx={style}>
                <div className="modal-title">
                    <div className="modal-title__left">
                        Edit Live Stream
                    </div>
                    <div className="modal-title__right">
                        <CloseOutlinedIcon
                            className="modal-icon"
                            onClick={() => editStreamClose()}/>
                    </div>
                </div>
                <div className="modal-content">
                    <div className="modal-content__upload-msg">
                        <div><b>Stream Name:  </b> <DirectoryInput onValueChange={(value) => {handleStreamNameChange(value); console.log("DirectoryInput-val:", value)}}/> </div>
                        <div><b>Protocol:  </b>
                        <select
                            value={protocolValue}
                            onChange={handleProtocolChange}
                        >
                            {protocolOptions.map((protocol, i) => (
                                <option
                                    key={i}
                                    value={protocol}
                                >
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

export default EditStreamModal;