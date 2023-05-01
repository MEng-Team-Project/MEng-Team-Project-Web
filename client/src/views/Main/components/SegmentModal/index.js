/*
<SegmentModal /> which uses Meta Segment-Anything model to allow the user
to easily get the mask (i.e. polygon) of a route region. Relies on the
public demo which was extracted to this url:
https://github.com/MiscellaneousStuff/meta-sam-demo
*/

// React
import React from 'react';

// Material UI
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

// Icons
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';

// CSS
import './SegmentModal.css';

// Components
import Stage from "./components/Stage";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 0,
    borderRadius: '5px'
};

const SegmentModal = props => {
    const { videoRef, open, segmentClose } = props;

    if (videoRef.current) {
        console.log("SegmentModal:", videoRef.current.videoWidth, videoRef.current.videoHeight);
    }

    return (
        <Modal
            open={open}
            onClose={segmentClose}
        >
            <Box sx={style}>
                <div className="modal-title">
                    <div className="modal-title__left">
                        Set the Region on the Video for the Current Route
                    </div>
                    <div className="modal-title__right">
                        <CloseOutlinedIcon
                            className="modal-icon"
                            onClick={() => segmentClose()}/>
                    </div>
                </div>
                <div className="modal-content">
                    <Stage videoRef={videoRef} />
                </div>
            </Box>
        </Modal>
    );
};

export default SegmentModal;