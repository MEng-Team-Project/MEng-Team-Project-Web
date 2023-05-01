/*
<Stage /> component from `meta-sam-demo` which allows a user to interactively
get a segmentation mask of an image. Relies on Meta endpoint for the Image
Embedding, but decoding of the Image Embedding into the mask is done using
local quantized models which are executed on the users browser using
WASM and with SIMD acceleration on the clients CPU.
*/

import React, {
    Profiler,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";

import './Stage.css';

const baseHeight = 400;

const Stage = props => {
    const { videoRef } = props;
    const canvasRef = useRef(null);
    const [width, setWidth] = useState(400);
    
    useEffect(() => {
        if (videoRef.current) {
            const video  = videoRef.current;
            const canvas = canvasRef.current;

            const videoHeight = videoRef.current.videoHeight;
            const videoWidth  = videoRef.current.videoWidth;

            const ratio = videoWidth / videoHeight;
            const newWidth = parseInt(baseHeight * ratio);
            canvasRef.current.width = newWidth;

            // console.log("newWidth, baseHeight:", newWidth, baseHeight);

            const ctx = canvas.getContext('2d', { preserveDrawingBuffer: true });
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        }
    }, []);

    return (
        <div class="segment-modal-stage">
            <canvas
                className="segment-modal-stage__canvas"
                ref={canvasRef}
                height={baseHeight} />
        </div>
    )
};

export default Stage;