/*
<Stage /> component from `meta-sam-demo` which allows a user to interactively
get a segmentation mask of an image. Relies on Meta endpoint for the Image
Embedding, but decoding of the Image Embedding into the mask is done using
local quantized models which are executed on the users browser using
WASM and with SIMD acceleration on the clients CPU.

All of this is done via an iFrame which relies an a locally hosted version
of fork of the `meta-sam-demo` site. Still captures are then passed to the
site, the user then extracts the relevant mask, and then the mask is
returned and this forms the polygon region.
*/

import React, {
    useEffect,
    useRef,
    useState,
} from "react";

import './Stage.css';

const baseHeight = 700;

const Stage = props => {
    const [frameURL, setFrameURL] = useState("");

    const { videoRef } = props;
    const canvasRef = useRef(null);
    const iframeRef = useRef(null);
    const [polygon, setPolygon] = useState(null);
    const [scale, setScale] = useState(null);

    const sendMessageToIframe = (type, message) => {
        if (type == "SEND") {
            const iframeWindow = iframeRef.current.contentWindow;
            const msg = {
                type: type,
                data: message
            }
            iframeWindow.postMessage(msg, '*');
        } else if (type == "RECEIVE") {
            const iframeWindow = iframeRef.current.contentWindow;
            const msg = {
                type: type,
                data: null
            }
            iframeWindow.postMessage(msg, '*');
        }
    };

    useEffect(() => {
        if (videoRef.current) {
            const video  = videoRef.current;
            const canvas = canvasRef.current;

            const videoHeight = videoRef.current.videoHeight;
            const videoWidth  = videoRef.current.videoWidth;
            canvasRef.current.height = videoHeight;
            canvasRef.current.width  = videoWidth;
            

            const ratio = videoWidth / videoHeight;
            const newWidth = parseInt(baseHeight * ratio);
            // canvasRef.current.width = newWidth;
            iframeRef.current.width = "100%";

            // console.log("newWidth, baseHeight:", newWidth, baseHeight);

            const ctx = canvas.getContext('2d', { preserveDrawingBuffer: true });
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const dataURL = canvas.toDataURL('image/png');

            setFrameURL(dataURL);
            // console.log("dataURL:", dataURL);

            // sendMessageToIframe(dataURL);
        }

        const handleChildMessage = (event) => {
            if (event.data.type == "RECEIVE") {
              console.log("handleChildMessage:", event);
              const polygon = event.data.data.svg;
              const scale   = event.data.data.scale;
              setPolygon(polygon);
              setScale(scale);
              console.log("SETTING POLYGON:", polygon);
              console.log("SETTING SCALE:", scale);
            }
          };
      
          window.addEventListener('message', handleChildMessage);
          return () => {
            window.removeEventListener('message', handleChildMessage);
          };
    }, []);

    useEffect(() => {
        console.log("frameURL Effect")
        if (frameURL) {
            setTimeout(() => {
                console.log("frameURL Effect, frameURL exists")
                console.log("Save Route Region")
                sendMessageToIframe("SEND", frameURL);
            }, 2000);
        }
    }, [frameURL]);

    return (
        <div class="stage-container">
            <div class="stage">
                <canvas
                    ref={canvasRef}
                    height={baseHeight}
                    class="stage__hidden-canvas" />
                <iframe
                    class="stage__sam-container"
                    ref={iframeRef}
                    src="http://localhost:3001/demo"
                    height={baseHeight}
                    />
            </div>
        </div>
    )
};

export default Stage;