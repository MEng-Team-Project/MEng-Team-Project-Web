// React
import React, { useCallback, useState, useEffect, useRef, useMemo } from 'react';

// Map Modules
import { Map, TileLayer, Marker, Popup, FeatureGroup } from 'react-leaflet';
//import { useMap, useMapEvent } from 'react-leaflet/hooks';
//import { useEventHandlers } from '@react-leaflet/core'
//import { Rectangle } from 'react-leaflet';

import 'leaflet-routing-machine';
import 'leaflet-canvas-markers';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import L, { routing } from 'leaflet';

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
    const mapWidth = expanded ? "100vh" : "50vh";
    const mapHeight = expanded ? "90vh" : "40vh";

    const center = [50.796586, -1.098758];

    const zoom = expanded ? 17 : 18

    const [routes, setRoutes] = useState([]);
    const [originalWaypoints, setOriginalWaypoints] = useState([]);

    const handleToggleExpand = () => {
        setExpanded(!expanded);
        mapRef.current.leafletElement.setView(center, zoom)
        setTimeout(function () {
            window.dispatchEvent(new Event("resize"));
         }, 200);
    }

    var arrowIcon = L.icon({
        iconUrl: '',
        iconSize: [30, 30],
        iconAnchor: [15, 15],
        popupAnchor: [0, -15],
        className: 'leaflet-canvas-icon',
        canvas: true,
        drawIcon: function(canvas, size, anchor) {
          var ctx = canvas.getContext('2d');
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(size.x, size.y/2);
          ctx.lineTo(0, size.y);
          ctx.fillStyle = 'red'; // or whatever color you want
          ctx.fill();
        }
      });

    useEffect(() => {
        if (mapRef.current && positions.filter(p => p).length >= 2) { // Filter out null elements
            const map = mapRef.current.leafletElement;

            const newRoutes = [];
            const newOriginalWaypoints = {}

            const routingControls = [];
            
        //routingControl was being created for every combination of i and j, Meaning n*(n-1)/2 lines drawn between all possible pairs of points.
            for (let i = 0; i < positions.length; i++) {
                for (let j = i + 1; j < positions.length; j++) {
                    if (positions[i] && positions[j]) { // Check if both positions are non-null
                    const route = L.Routing.control({
                        waypoints: [
                            L.latLng(positions[i]),
                            L.latLng(positions[j])
                        ],
                        distanceTemplate: "",
                        timeTemplate: "",
                        //TODO: add route analytics below
                        summaryTemplate: `<h2>{name}</h2> Analytics info will be displayed here eg HGVs = 60 ...`,
                        fitSelectedRoutes: true,
                        draggableWaypoints: false,
                        routeWhileDragging: false,
                        createMarker: function (i, waypoint, n) {
                            if (i === 0) return null;
                            const prevLatLng = positions[i - 1];
                            return L.canvasMarker(positions[i], {
                              img: {
                                url: "mapArrow.png", 
                                size: [40, 40],
                                rotate: 10,
                              },
                              prevLatlng: prevLatLng,
                            }); },
                        show: false,
                        lineOptions : { 
                        addWaypoints: false,
                        styles: [{
                            color: congestionColor,
                            opacity: 1,
                            weight: 5,
                        }]
                        },
                    }).addTo(map);
            
                    newRoutes.push(route);
                    console.log("Route drawn between positions[" + i + " ] and positions [ " + j + " ]");
                    newOriginalWaypoints[newRoutes.length - 1] = route.getWaypoints();
                    }
                }
            }
            setRoutes(newRoutes);
            setOriginalWaypoints(newOriginalWaypoints);
            return () => {
                    // Clean up by removing all routing controls
                    newRoutes.forEach(route => map.removeControl(route));
            }
          
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
                    <input type="checkbox" onClick={() => hideRoute(i)} defaultChecked />
                    Route {i + 1}
                </label>
                <ul className="map-controls__checkbox-sublist">
                    <li>
                    <label className="map-controls__checkbox-label_sub">
                        <input type="checkbox" onClick={() => hideRoute(i)} />
                        Incoming
                    </label>
                    </li>
                    <li>
                    <label className="map-controls__checkbox-label_sub">
                        <input type="checkbox" onClick={() => hideRoute(i)} />
                        Outgoing
                    </label>
                    </li>
                </ul>
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
                center={center}
                zoom={zoom}
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