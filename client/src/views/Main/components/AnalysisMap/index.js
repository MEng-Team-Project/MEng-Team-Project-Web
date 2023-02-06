// React
import React, { useCallback, useState, useEffect, useRef, useMemo } from 'react';

// Map Modules
import { Map, TileLayer } from 'react-leaflet';
//import { useMap, useMapEvent } from 'react-leaflet/hooks';
//import { useEventHandlers } from '@react-leaflet/core'
//import { Rectangle } from 'react-leaflet';

// CSS
import "./AnalysisMap.css";

const AnalysisMap = props => {
    return (
        <div className="map">
            <Map
                center={[
                    50.796586,
                    -1.098758
                ]}
                zoom={18}
                scrollWheelZoom={true}
                style={{
                    width: "300px",
                    height: "300px",
                }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
            </Map>
        </div>
    );
};

export default AnalysisMap;