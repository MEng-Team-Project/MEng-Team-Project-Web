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

// Redux
import { connect } from 'react-redux';

// Redux Actions
import {
  getAnalytics,
  setAnalytics
} from "../../../../actions/analyticsActions";

const AnalysisMap = (props) => {
  const [positions, setPositions] = useState({});  
  //const {roads = Object.keys(positions), visible, setVisible } = props;
  const {roads = Object.keys(positions), visible, setVisible, analytics, totalAnalytics } = props;
  //const { roads, visible, setVisible, analytics, analyticsLoading } = props;
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

  useEffect(() => {
    // when analytics is updated, draw routes with predetermined values
    for(let i = 0; i < routes.length; i++){
      const routeName = routeNames[i]
      const [start, end] = routeName.split(" to ")
      showRoute(i,"Route", start, end)
    }
  }, [analytics])
  
  const incomingCount = 5;
  const outgoingCount = 49;

  useEffect(() => {
    const positionsArray = Object.values(positions);

    if (mapRef.current && positionsArray.filter((p) => p).length >= 2) {
      // Filter out null elements
      const map = mapRef.current.leafletElement;

      const newRoutes = [];
      const newOriginalWaypoints = {};
      const newRouteNames = []

      //let congestion = incomingCount + outgoingCount;

      //const data = analytics
  
      //routingControl was being created for every combination of i and j, Meaning n*(n-1)/2 lines drawn between all possible pairs of points.
      for (let i = 0; i < positionsArray.length; i++) {
        for (let j = i + 1; j < positionsArray.length; j++) {
          if (positionsArray[i] && positionsArray[j]) {
            console.log("roads", roads)
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
                      calculateCongestion(roads[i], roads[j], "Route"),
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


const handleMapCheckBoxes = (event, i, type, routeName) => {
    console.log('Checkbox checked:', event.target.checked);
    const name = event.target.name;
    const isChecked = event.target.checked;
    const [startRoad, endRoad] = routeName.split(" to ");
    console.log("start ", startRoad);
    console.log("end ", endRoad);
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
        showRoute(i, type, startRoad, endRoad);
        if (name.includes("incoming_") || name.includes("outgoing_")) {
          route.show()
        }
    }else{
        if (name.includes("incoming_") || name.includes("outgoing_")) {
            route.hide()
            showRoute(i, type, startRoad, endRoad);
            return;
        }
        route.hide()
        hideRoute(i)
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

const showRoute = (index, type, startRoad, endRoad) => {
    let congestion;
    const route = routes[index];
    switch (type) {
        case "Route":
            //const objectTypes = filter.asdasd
            congestion = calculateCongestion(startRoad, endRoad, "Route");
            break;
        case "Incoming":
            congestion = calculateCongestion(startRoad, endRoad, "Incoming");
            break;
        case "Outgoing":
            congestion = calculateCongestion(startRoad, endRoad, "Outgoing");
            break;
    }
    let congestionColor = congestion
    // if analytics store not empty use original route colour determined by function
    if (route) { 
        let originalWaypoint = originalWaypoints[index];
        route.options.lineOptions.styles[0].color = congestionColor;
        route.setWaypoints(originalWaypoint);
    }
    // otherwise use grey colour to indicate lack of data.
    // else {
    //   let originalWaypoint = originalWaypoints[index];
    //     route.options.lineOptions.styles[0].color = "grey";
    //     route.setWaypoints(originalWaypoint);
    // }
}

// Calculate and congestion against standardised values for a route (both directions)

const calculateCongestion = (startRoad, endRoad, direction) => { //add filters store as a parameter

  //const standardisedCarMin = 4012 
  const standardisedCarMax = 4595
  //const standardisedHGVMin = 42
  const standardisedHGVMax = 55
  //const standardisedBicycleMin = 552 
  const standardisedBicycleMax = 779
  //const standardisedPersonMin = 1000    // CHANGE - find actual value
  const standardisedPersonMax = 2000    // CHANGE - find actual value

  console.log(analytics)
  if(analytics.counts){
    console.log(analytics.counts.length)
    //console.log(totalAnalytics)
  }

  // Get the counts object for the specified start and end points
  // check for direction paramater, if both combine values from both
  // if incoming switch stand and end road parameters
  // if either incoming or outgoing - half the max value

  let localAnalytics = null

  if(analytics.counts.length === 0 && totalAnalytics.counts.length === 0){
    return "grey"
  } else if (analytics.counts.length === 0){
    localAnalytics = totalAnalytics //analytics.all?
  } else { localAnalytics = analytics}

  let routeCounts = null
  let routeCounts2 = null
  let scaler = 1
  
  if(direction === "Route"){
    for(let i = 0; i < localAnalytics.counts.length; i++){
      if(localAnalytics.counts[i].start === startRoad && localAnalytics.counts[i].end === endRoad) {
        routeCounts = localAnalytics.counts[i].counts;
        break
      }
    }
    for(let i = 0; i < localAnalytics.counts.length; i++){
      if(localAnalytics.counts[i].end === startRoad && localAnalytics.counts[i].start === endRoad) {
        routeCounts2 = localAnalytics.counts[i].counts;
        break
      }
    }
  }
  else if(direction === "Outgoing"){
    for(let i = 0; i < localAnalytics.counts.length; i++){
      if(localAnalytics.counts[i].start === startRoad && localAnalytics.counts[i].end === endRoad) {
        routeCounts = localAnalytics.counts[i].counts;
        break
      }
    }
    scaler = 0.5
  }
  else if(direction === "Incoming"){
    for(let i = 0; i < localAnalytics.counts.length; i++){
      if(localAnalytics.counts[i].end === startRoad && localAnalytics.counts[i].start === endRoad) {
        routeCounts = localAnalytics.counts[i].counts;
        break
      }
    }
    scaler = 0.5
  }
  
  // change to routeCounts.interval -- seconds //
  const timeInSeconds = localAnalytics.interval //- analytics.startTime   // CHANGE WHEN TIME FORMAT IS KNOWN

  // accomodate multiple vehicle being filtered for
  let fileteredTotal = 0

  for (let i = 0; i < localAnalytics.objects.length; i++) {
    switch (localAnalytics.objects[i]) {
      case "car":
        fileteredTotal += standardisedCarMax;
        break;
      case "hgv":
        fileteredTotal += standardisedHGVMax;
        break;
      case "person":
        fileteredTotal += standardisedPersonMax;
        break;
      case "bicycle":
        fileteredTotal += standardisedBicycleMax;
        break;
      default:
        // Handle any other cases
        break;
    }
  }
  console.log(fileteredTotal)
  // Calculate the congestion value
  let congestionValue = 0;

  if(routeCounts2 != null){
    congestionValue = ( ( (routeCounts.total + routeCounts2.total) / timeInSeconds) / (fileteredTotal * scaler / (24*60*60)) ) * 100
  }
  else {
    congestionValue = ( ( (routeCounts.total) / timeInSeconds) / (fileteredTotal * scaler / (24*60*60)) ) * 100
  }

  // output the congestion level string
  console.log(congestionValue)
  console.log(localAnalytics)
  let congestionLevel = "";
  if (congestionValue <= 33 && congestionValue > 0) {   // CHANGE - USE MINIMUM VALUE instead of 33?
    congestionLevel = "green";
  } else if (congestionValue <= 66) {
    congestionLevel = "orange";
  } else if (congestionValue > 66){
    congestionLevel = "red";
  }

return congestionLevel;
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

    return (
        <div className="map">
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

const mapStateToProps = state => {
  return {
    analytics: state.analytics.analytics, // subject to edit for specific values
    totalAnalytics: state.analytics.analytics.all
  }
}

export default connect(mapStateToProps, {getAnalytics, setAnalytics}) (AnalysisMap);

//export default AnalysisMap;
