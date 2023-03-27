// React
import React, { useCallback, useState, useEffect, useRef, useMemo } from 'react';

// Map Modules
import { Map, TileLayer, Marker, Popup, FeatureGroup } from 'react-leaflet';
//import { useMap, useMapEvent } from 'react-leaflet/hooks';
//import { useEventHandlers } from '@react-leaflet/core'
//import { Rectangle } from 'react-leaflet';

import 'leaflet-routing-machine'
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css'
import L from 'leaflet'

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
    const {routes} = props;
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

    const handleToggleExpand = () => {
        setExpanded(!expanded);
        mapRef.current.leafletElement.setView(center, zoom)
        setTimeout(function () {
            window.dispatchEvent(new Event("resize"));
         }, 200);
    }

    useEffect(() => {
        if (mapRef.current && positions.filter(p => p).length >= 2) { // Filter out null elements
          const map = mapRef.current.leafletElement;
          const routingControls = [];
        //routingControl was being created for every combination of i and j, Meaning n*(n-1)/2 routingControls
          for (let i = 0; i < positions.length; i++) {
            for (let j = i + 1; j < positions.length; j++) {
              if (positions[i] && positions[j]) { // Check if both positions are non-null
                const routingControl = L.Routing.control({
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
                    addWaypoints: false
                  }
                }).addTo(map);
      
                routingControls.push(routingControl);
                console.log("Route drawn between positions[" + i + " ] and positions [ " + j + " ]");
              }
            }
          }
      
          return () => {
            // Clean up by removing all routing controls
            routingControls.forEach(routingControl => map.removeControl(routingControl));
          }
        }
      }, [mapRef, positions]);
      

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
        <div className={mapClass}>
            <div className="map-controls">
                {routes.map((route, i) => (
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