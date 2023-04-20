// React
import React, {
  useCallback,
  useState,
  useEffect,
  useRef,
  useMemo,
} from "react";

// Map Modules
import { Map, TileLayer, Marker, Popup, FeatureGroup } from "react-leaflet";
//import { useMap, useMapEvent } from 'react-leaflet/hooks';
//import { useEventHandlers } from '@react-leaflet/core'
//import { Rectangle } from 'react-leaflet';

import "leaflet-routing-machine";
import "leaflet-canvas-markers";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import L, { routing } from "leaflet";

// Icons
import RoomIcon from "@mui/icons-material/Room";
import IconButton from "@mui/material/IconButton";
import AspectRatioIcon from "@mui/icons-material/AspectRatio";
import CloseIcon from '@mui/icons-material/Close';

// Global Components
import { Tooltip } from "../../../../components";

// CSS
import "./AnalysisMap.css";

const AnalysisMap = (props) => {
  const [positions, setPositions] = useState({});  
  const {roads = Object.keys(positions), visible, setVisible } = props;
  const [selected, setSelected] = useState("");
  const [plotting, setPlotting] = useState(false);
 // const [positions, setPositions] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const mapRef = useRef(null); // create a map reference using useRef hook

  const [mapCheckboxes, setMapCheckboxes] = useState([]);

  const mapClass = expanded ? "map-expanded" : "map";
  const mapWidth = expanded ? "100vh" : "50vh";
  const mapHeight = expanded ? "87vh" : "40vh";

  const center = [50.796586, -1.098758];

  const zoom = expanded ? 17 : 18;

  const [routes, setRoutes] = useState([]);
  const [originalWaypoints, setOriginalWaypoints] = useState([]);
  const [routeNames, setRouteNames] = useState([])

  const handleToggleExpand = () => {
    switch (expanded){
        case true:
            setVisible(true);
            break;
        case false:
            setVisible(false);
            break;
    }
    setExpanded(!expanded);
    mapRef.current.leafletElement.setView(center, zoom);
    setTimeout(function () {
      window.dispatchEvent(new Event("resize"));
    }, 200);
  };

  const incomingCount = 5;
  const outgoingCount = 49;

  useEffect(() => {
    const positionsArray = Object.values(positions);

    if (mapRef.current && positionsArray.filter((p) => p).length >= 2) {
      // Filter out null elements
      const map = mapRef.current.leafletElement;

      const newRoutes = [];
      const newOriginalWaypoints = {};
      const routingControls = [];
      const newRouteNames = []

      let congestion = incomingCount + outgoingCount;
  
      //routingControl was being created for every combination of i and j, Meaning n*(n-1)/2 lines drawn between all possible pairs of points.
      for (let i = 0; i < positionsArray.length; i++) {
        for (let j = i + 1; j < positionsArray.length; j++) {
          if (positionsArray[i] && positionsArray[j]) {
            const routeName = `${roads[i]} to ${roads[j]}`
            // Check if both positions are non-null
            const route = L.Routing.control({
              waypoints: [L.latLng(positionsArray[i]), L.latLng(positionsArray[j])],
              distanceTemplate: "",
              timeTemplate: "",
              //TODO: add route analytics below
              summaryTemplate: `<h2>${routeName}</h2> Analytics info will be displayed here eg HGVs = 60 ...`,
              fitSelectedRoutes: true,
              draggableWaypoints: false,
              routeWhileDragging: false,
              createMarker: function (i, waypoint, n) {
                return null;
              },
              show: false,
              lineOptions: {
                addWaypoints: false,
                styles: [
                  {
                    color:
                      congestion >= 50
                        ? "red"
                        : congestion >= 20
                        ? "orange"
                        : "green",
                    opacity: 1,
                    weight: 5,
                  },
                ],
              },
            }).addTo(map);

            newRoutes.push(route);
            console.log("HERE 1!!!!", route);

            console.log(
              "Route drawn between positions[ " +
                i +
                " ] and positions [ " +
                j +
                " ]"
            );
            
            newRouteNames.push(routeName)
            newOriginalWaypoints[newRoutes.length - 1] = route.getWaypoints();
          }
        }
      }
      setRoutes(newRoutes);
      setOriginalWaypoints(newOriginalWaypoints);
      setRouteNames(newRouteNames)
      return () => {
        // Clean up by removing all routing controls
        newRoutes.forEach((route) => map.removeControl(route));
      };
    }
  }, [mapRef, positions]);

  useEffect(() => {
    const updatedMapCheckboxes = routes.reduce((acc, _, i) => {
      acc[`route_${i}`] = acc[`route_${i}`] || true;
      acc[`incoming_${i}`] = acc[`incoming_${i}`] || false;
      acc[`outgoing_${i}`] = acc[`outgoing_${i}`] || false;
      return acc;
    }, {});
  
    setMapCheckboxes((prevState) => ({
      ...prevState,
      ...updatedMapCheckboxes
    }));
  }, [routes]);



useEffect(() => {
  //clear map checkboxes if only 1 position is left on the map
  if (Object.values(positions).length === 1) {
    setRoutes([]);
  }
},[positions]);


const handleMapCheckBoxes = (event, i, type) => {
    console.log('Checkbox checked:', event.target.checked);
    const name = event.target.name;
    const isChecked = event.target.checked;
    setMapCheckboxes((prevState) => {
        const updatedState = { ...prevState };
        updatedState[name] = isChecked;
    
        // If a child checkbox was clicked, uncheck the other child checkbox
        const [parent, child] = name.split("_");
        if (parent === "incoming" || parent === "outgoing") {
          const otherChild = parent === "incoming" ? "outgoing" : "incoming";
          updatedState[`${otherChild}_${child}`] = false;
        } else {
            // If the parent checkbox was clicked, uncheck both children
            const child1Name = `incoming_${child}`;
            const child2Name = `outgoing_${child}`;
            updatedState[child1Name] = false;
            updatedState[child2Name] = false;
        }
      
        return updatedState;
      });
 
    const route = routes[i]
    if(isChecked){
        showRoute(i, type);
        if (name.includes("incoming_") || name.includes("outgoing_")) {
          route.show()
        }
    }else{
        if (name.includes("incoming_") || name.includes("outgoing_")) {
            route.hide()
            showRoute(i, "Route");
            return;
        }
        route.hide()
    }
}

const hideRoute = (index) => {
    const route = routes[index];
    if (route) {
        let originalWaypoint = originalWaypoints[index];
        route.options.lineOptions.styles[0].color = "rgba(255, 255, 255, 0)";
        route.setWaypoints(originalWaypoint);
    }
}

const showRoute = (index, type) => {
    let congestion;
    const route = routes[index];
    switch (type) {
        case "Route":
            congestion = incomingCount + outgoingCount;
            break;
        case "Incoming":
            congestion = incomingCount;
            break;
        case "Outgoing":
            congestion = outgoingCount;
            break;
    }
    let congestionColor =
    congestion >= 50 ? "red" : congestion >= 20 ? "orange" : "green";
    if (route) {
        let originalWaypoint = originalWaypoints[index];
        route.options.lineOptions.styles[0].color = congestionColor;
        route.setWaypoints(originalWaypoint);
    }
}

  const handleTogglePlotting = (road) => {
    if (road == selected) {
      setPlotting(false);
      setSelected("");
      console.log("SELECTED: ''");
    } else if (road != selected) {
      setPlotting(true);
      setSelected(road);
      console.log(`SELECTED: '${road}'`);
    }
  };

  const removePosition = () => {
    const selectedIdx = roads.indexOf(selected);
    const positionToRemove = positions[selected];
    setPositions((prevState) => {
      const newState = { ...prevState };
      delete newState[selected];
      return newState;
    });

    const newRoutes = routes.filter((route, index) => {
      const routePositions = originalWaypoints[index];
      // Check if the removed position exists in routePositions
      const hasRemovedPosition = routePositions.includes(positionToRemove);
      return !hasRemovedPosition;
    });
  
    // Update mapCheckboxes based on the remaining routes
    const newMapCheckboxes = newRoutes.reduce((acc, route, index) => {
      acc[index] = mapCheckboxes[routes.indexOf(route)];
      return acc;
    }, {});
  
    // Update routeNames based on the remaining routes
    const newRouteNames = newRoutes.map((route) => routeNames[routes.indexOf(route)]);
  
    setRoutes(newRoutes);
    setMapCheckboxes(newMapCheckboxes);
    setRouteNames(newRouteNames);
    setSelected("");
  };
  
  return (
    <div className={mapClass}>
      <div className="map-controls">
        <div className="map-controls__checkboxes">
          {routes.map((route, i) => (
            <div key={i}>
              <label
                className="map-controls__checkbox-label"
                id="routeCheckBox + {i}"
              >
                <input
                  type="checkbox"
                  name={`route_${i}`}
                  checked={mapCheckboxes[`route_${i}`]} 
                  onChange={(e) => handleMapCheckBoxes(e, i, "Route")}
                  defaultChecked
                />
                Route {routeNames[i]}
              </label>
              <ul className="map-controls__checkbox-sublist">
                <li>
                  <label className="map-controls__checkbox-label_sub">
                    <input
                      type="checkbox"
                      name={`incoming_${i}`}
                      checked={mapCheckboxes[`incoming_${i}`]}
                      onChange={(e) => handleMapCheckBoxes(e, i, "Incoming")}
                      disabled={!mapCheckboxes[`route_${i}`]}   
                    />
                    Incoming
                  </label>
                </li>
                <li>
                  <label className="map-controls__checkbox-label_sub">
                    <input
                     type="checkbox"
                     name={`outgoing_${i}`}
                     checked={mapCheckboxes[`outgoing_${i}`]}
                     onChange={(e) => handleMapCheckBoxes(e, i, "Outgoing")}
                     disabled={!mapCheckboxes[`route_${i}`]}   
                    />
                    Outgoing
                  </label>
                </li>
              </ul>
            </div>
          ))}
        </div>
       {roads.map((road, i) => (
          <Tooltip content="Mark Region" direction="top">
            <div className="map-marker">
              <RoomIcon
                onClick={() => handleTogglePlotting(road)}
                className="icon map-controls-icon"
                sx={{
                  color:
                    plotting && selected == road
                      ? "white"
                      : "rgb(165, 168, 165)",
                  backgroundColor: "rgb(106, 116, 133)",
                }}
              />
              <span className="map-marker__text">{road}</span>
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
        onClick={(e) => {
          console.log("MAP CLICKED", e, plotting);
          if (plotting) {
            setPositions((prevState) => ({
              ...prevState,
              [selected]: e.latlng,
            }));
            setPlotting(false);
          }
        }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
       <FeatureGroup>
        {roads.map((road, i) => {
          const position = positions[road];
          if (position) {
            return (
              <Marker key={i} position={position} label={road}>
                <Popup>
                  <div>{road}</div>
                </Popup>
              </Marker>
            );
          } else {
            return null;
          }
        })}
      </FeatureGroup>
      </Map>
      <Tooltip title="Expand Map" arrow>
        <IconButton className="map-expand" onClick={() => handleToggleExpand()}>
          <AspectRatioIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Remove Selected Marker" arrow>
        <IconButton className="map-expand" onClick={() => removePosition()}>
          <CloseIcon />
        </IconButton>
      </Tooltip>
    </div>
  );
};

export default AnalysisMap;
