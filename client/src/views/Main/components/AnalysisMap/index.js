// React
import React, { useCallback, useState, useEffect, useRef, useMemo } from 'react';

// Map Modules
import { Map, TileLayer, Marker, Popup, FeatureGroup } from 'react-leaflet';
//import { useMap, useMapEvent } from 'react-leaflet/hooks';
//import { useEventHandlers } from '@react-leaflet/core'
//import { Rectangle } from 'react-leaflet';

// Icons
import RoomIcon from '@mui/icons-material/Room';

// Global Components
import {
    Tooltip
} from '../../../../components';

// CSS
import "./AnalysisMap.css";

const AnalysisMap = props => {
    const {routes} = props;
    const [selected, setSelected] = useState("");
    const [plotting, setPlotting] = useState(false);
    const [positions, setPositions] = useState([]);

    // console.log("routes, selectedRoute:", routes, selectedRoute);

    const handleTogglePlotting = (route) => {
        if (route == selected) {
            setPlotting(false);
            setSelected("");
            console.log("SELECTED: ''")
        } else if (route != selected) {
            setPlotting(true);
            setSelected(route);
            console.log(`SELECTED: '${route}'`)
        }
    };

    return (
        <div className="map">
            <div className="map-controls">
                {(routes) && (routes.map((route, i) => (
                    <Tooltip content="Mark Region" direction="top" >
                        <div className="map-marker">
                            <RoomIcon
                                onClick={() => handleTogglePlotting(route)}
                                className="icon map-controls-icon"
                                sx={{
                                    color: (plotting && selected == route)
                                           ? "white"
                                           : "rgb(165, 168, 165)",
                                    backgroundColor: "rgb(106, 116, 133)"
                                }}
                            />
                            <span className="map-marker__text">
                                {route}
                            </span>
                        </div>
                    </Tooltip>
                )))}
            </div>
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
                onClick={e => {
                    console.log("MAP CLICKED", e, plotting)
                    if (plotting) {
                        let newPositions = [...positions];
                        let selectedIdx  = routes.indexOf(selected);
                        newPositions[selectedIdx] = e.latlng;
                        setPositions(newPositions);
                        setPlotting(false);
                    }
                }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <FeatureGroup>
                    {positions.map((position, i) => (
                        <Marker
                            key={i}
                            position={position}
                            label={routes[i]}
                        >
                            <Popup>
                                <div>{routes[i]}</div>
                            </Popup>
                        </Marker>
                    ))}
                </FeatureGroup>
            </Map>
        </div>
    );
};

export default AnalysisMap;