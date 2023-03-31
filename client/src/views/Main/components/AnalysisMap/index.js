// React
import React, { useCallback, useState, useEffect, useRef, useMemo } from 'react';

// Map Modules
import { Map, TileLayer, Marker, Popup, FeatureGroup } from 'react-leaflet';
//import { useMap, useMapEvent } from 'react-leaflet/hooks';
//import { useEventHandlers } from '@react-leaflet/core'
//import { Rectangle } from 'react-leaflet';

import 'leaflet-routing-machine'
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css'
import L, { routing } from 'leaflet'

// Icons
import RoomIcon from '@mui/icons-material/Room';
import IconButton from '@mui/material/IconButton';
import AspectRatioIcon from '@mui/icons-material/AspectRatio';


// Global Components
import {
    Tooltip
} from '../../../../components';

// CSS
import "./AnalysisMap.css";

const AnalysisMap = props => {
    const {roads} = props;
    const [selected, setSelected] = useState("");
    const [plotting, setPlotting] = useState(false);
    const [positions, setPositions] = useState([]);
    
    const [expanded, setExpanded] = useState(false);
    const mapRef = useRef(null); // create a map reference using useRef hook

    const mapClass = expanded ? "map-expanded" : "map";

    const mapWidth = expanded ? "100vh" : 300;
    const mapHeight = expanded ? "90vh" : 300;

    const [routes, setRoutes] = useState([]);
    const [originalWaypoints, setOriginalWaypoints] = useState([]);

    const handleToggleExpand = () => {
        setExpanded(!expanded);
    }

    useEffect(() => {
        if (mapRef.current && positions.filter(p => p).length >= 2) { // Filter out null elements
            const map = mapRef.current.leafletElement;

            const newRoutes = [];
            const newOriginalWaypoints = {}
        
            for (let i = 0; i < positions.length; i++) {
                for (let j = i + 1; j < positions.length; j++) {
                    if (positions[i] && positions[j]) { // Check if both positions are non-null
                        const route = L.Routing.control({
                            waypoints: [
                            L.latLng(positions[i]),
                            L.latLng(positions[j])
                            ],
                            fitSelectedRoutes: true,
                            draggableWaypoints: false,
                            routeWhileDragging: false,
                            createMarker: function() { return null; },
                            show: false,
                            lineOptions : {
                                addWaypoints: false,
                                styles: [{
                                    color: congestionColor,
                                    opacity: 1,
                                    weight: 5
                                }]
                            }
                        }).addTo(map);
                    console.log("Route drawn between positions[" + i + " ] and positions [ " + j + " ]")

                    newRoutes.push(route)
                    newOriginalWaypoints[newRoutes.length - 1] = route.getWaypoints();
                    }
                }   
            }
        setRoutes(newRoutes);
        setOriginalWaypoints(newOriginalWaypoints);
        }
    }, [mapRef, positions]);   

    function hideRoute(index) {
        const route = routes[index];
        const originalWaypoint = originalWaypoints[index];
        if (route) {
            const map = mapRef.current.leafletElement;
            if (JSON.stringify(route.getWaypoints()) === JSON.stringify(originalWaypoint)) {
            // Waypoints are the same as original, so hide the route by setting waypoints to empty array
            route.setWaypoints([]);
            } else {
            // Waypoints have been changed, so restore the original waypoints
            route.setWaypoints(originalWaypoint);
            }
        }
    }

    const congestion = 15;
    const congestionColor = congestion >= 50 ? 'red' : congestion >= 20 ? 'orange' : 'green';

    function showCongestion(index, congestion) {
    const route = routes[index];
    if (route) {
        const map = mapRef.current.leafletElement;
        const originalWaypoints = route.getWaypoints();
    
        const newRoute = L.Routing.control({
        waypoints: originalWaypoints,
        fitSelectedRoutes: true,
        draggableWaypoints: false,
        routeWhileDragging: false,
        createMarker: function() { return null; },
        show: false,
        lineOptions : {
            addWaypoints: false,
            styles: [{
            color: congestion >= 50 ? 'red' : congestion >= 20 ? 'orange' : 'green',
            opacity: 1,
            weight: 5
            }]
        }
        }).addTo(map);
    
        route.remove();
        setRoutes([...routes.slice(0, index), newRoute, ...routes.slice(index + 1)]);
    
        setOriginalWaypoints({
        ...originalWaypoints,
        [index]: originalWaypoints
        });
    }
    }

    const handleTogglePlotting = (road) => {
        if (road == selected) {
            setPlotting(false);
            setSelected("");
            console.log("SELECTED: ''")
        } else if (road != selected) {
            setPlotting(true);
            setSelected(road);
            console.log(`SELECTED: '${road}'`)
        }
    }

    return (
        <div className={mapClass}>
            <div className="map-controls">
                <div className="map-controls__checkboxes">
                    {routes.map((route, i) => (
                        <div key={i}>
                            <label className="map-controls__checkbox-label">
                                <input type="checkbox" onClick={() => showCongestion(i, 60)} defaultChecked/>
                                Route {i + 1}
                            </label>
                            <br />
                        </div>
                    ))}
                </div>
                {roads.map((road, i) => (
                    <Tooltip content="Mark Region" direction="top" >
                        <div className="map-marker">
                            <RoomIcon
                                onClick={() => handleTogglePlotting(road)}
                                className="icon map-controls-icon"
                                sx={{
                                    color: (plotting && selected == road)
                                           ? "white"
                                           : "rgb(165, 168, 165)",
                                    backgroundColor: "rgb(106, 116, 133)"
                                }}
                            />
                            <span className="map-marker__text">
                                {road}
                            </span>
                        </div>
                    </Tooltip>
                ))}
            </div>
            <Map
                 ref={mapRef}
                center={[
                    50.796586,
                    -1.098758
                ]}
                zoom={18}
                scrollWheelZoom={true}
                style={{
                    width: mapWidth,
                    height: mapHeight,
                }}
                onClick={e => {
                    console.log("MAP CLICKED", e, plotting)
                    if (plotting) {
                        let newPositions = [...positions];
                        let selectedIdx  = roads.indexOf(selected);
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
                            label={roads[i]}
                        >
                            <Popup>
                                <div>{roads[i]}</div>
                            </Popup>
                        </Marker>
                    ))}
                </FeatureGroup>
            </Map>
            <Tooltip title="Expand Map" arrow>
                <IconButton
                    className="map-expand"
                    onClick={() => 
                        handleToggleExpand()
                    }
                >
                    <AspectRatioIcon />
                </IconButton>
            </Tooltip>
        </div>
    );
};

export default AnalysisMap;