// React
import React, { useState } from 'react';

// CSS
import './FileUpload.css';

import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import axios from 'axios';

const FileIcon = () => {
    return (
        <div className="modal-file-icon" height="70px">
            <svg viewBox="0 0 64 64" width="70px" height="70px" className="data-ex-icons-file" fill="rgb(194, 189, 189)">
                <path d="M49.61,20.51,36.56,7.46a1.36,1.36,0,0,0-.32-.24,1.6,1.6,0,0,0-.39-.14,1.53,1.53,0,0,0-.26,0H15.38A1.39,1.39,0,0,0,14,8.45v47.1a1.39,1.39,0,0,0,1.39,1.39H48.63A1.39,1.39,0,0,0,50,55.55V21.48A1.4,1.4,0,0,0,49.61,20.51Zm-1,35H15.38V8.45h19.4V20.92a1.39,1.39,0,0,0,1.39,1.39H48.63Z"></path>
            </svg>
            <div fontSize="11px" className="file-upload__icon-text-outer">
                <div className="file-upload__icon-text">rofl</div>
            </div>
        </div>
    );
}

const UploadProgress = props => {
    const { filename, progress, status } = props;
    // done color := rgb(15, 150, 104)
    // progress color := rgb(20, 201, 138)
    return (
        <div className="upload-progress">
            <div className="upload-progress__info">
                <div>
                    {filename}
                </div>
                <div>
                    {`${progress}%`}
                </div>
            </div>
            <div className="upload-bar__background">
                <div
                    className="upload-bar__foreground"
                    style={{
                        width: `${progress}%`,
                        height: '100%'
                    }} />
            </div>
            <div className="upload-progress__message">
                {status}
            </div>
        </div>
    )
}

const FileUpload = props => {
    const { message, handleUploadSuccessful } = props;
    const [uploadMessage, setUploadMessage] = useState("");
    const [uploadProgress, setUploadProgress] = useState(null);
    const [uploadAttempted, setUploadAttempted] = useState(false);
    const [uploadFilename, setUploadFilename] = useState("file");

    const handleSubmission = () => {
        const config = {
            headers: {
                "Content-Type": "multipart/form-data"
            },
            onUploadProgress: (progressEvent) => {
                const percentCompleted = Math.round(
                    (progressEvent.loaded * 100) / progressEvent.total );
                setUploadProgress(percentCompleted);
            }
        };
        const formData = new FormData();
        const streamFile = document.querySelector("#file");
        formData.append("stream", streamFile.files[0]);
        setUploadFilename(streamFile.files[0].name)
        setUploadAttempted(true);
        axios
            .put("/api/streams/upload", formData, config)
            .then(res => {
                setUploadMessage(res.data);
                handleUploadSuccessful();
            })
            .catch(err => {
                setUploadMessage(err.response.data);
            })
    };

    return (
        <div className="file-upload">
            <FileIcon />
            {!(uploadAttempted) && (
                <div className="file-upload__pre-upload">
                    <FileUploadOutlinedIcon
                        style={{color: "rgb(194, 189, 189)"}}
                        className="file-upload__icon"
                        />
                    <div className="file-upload__message">
                        {message}
                    </div>
                    <div className="file-upload__sub_message">
                        <input
                            id="file"
                            type="file"
                            className="file"
                            accept=".mp4"
                            onChange={ (e) => {
                                handleSubmission()
                                console.log(e.target.files)
                            } }
                        />
                        or
                        <label htmlFor="file">
                            <span className="link-like">
                                browse your files
                            </span>
                        </label>
                    </div>
                </div>
            )}
            {(uploadAttempted) && 
                <UploadProgress
                    filename={uploadFilename}
                    progress={uploadProgress}
                    status={uploadMessage}
                    />
            }
        </div>
    );
};

export default FileUpload;