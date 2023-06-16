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
  
    console.log("congestion update")
    console.log("analytics.counts", analytics.counts)
    if(totalAnalytics.counts.length === 0){ //analytics.counts.length === 0 && 
      return "grey"
    } else if (analytics.counts.length === 0){
      
      localAnalytics = totalAnalytics //analytics.all?
    } else { localAnalytics = analytics}
    
    console.log("localAnalytics.counts", localAnalytics.counts);
  
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
      for(let i = 0; i < localAnalytics.counts.length; i++){
        if(localAnalytics.counts[i].end === startRoad && localAnalytics.counts[i].start === endRoad) {
          routeCounts2 = localAnalytics.counts[i].counts;
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
      for(let i = 0; i < localAnalytics.counts.length; i++){
        if(localAnalytics.counts[i].end === startRoad && localAnalytics.counts[i].start === endRoad) {
          routeCounts2 = localAnalytics.counts[i].counts;
          break
        }
      }
      scaler = 0.5
    }
    
    console.log("myRouteCounts:", routeCounts);

    // change to routeCounts.interval -- seconds //
    const timeInSeconds = localAnalytics.interval //
  
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
  
    if(routeCounts && routeCounts2){
      congestionValue = ( ( (routeCounts.total + routeCounts2.total) ) / ((fileteredTotal * scaler / (24*60*60)) * timeInSeconds) ) * 100
    }
    else if (routeCounts) {
      congestionValue = ( ( (routeCounts.total) ) / ((fileteredTotal * scaler / (24*60*60)) * timeInSeconds) ) * 100
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

  // console.log("analytics live update:", analytics)

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

  // when analytics is updated, draw routes with predetermined values
  
  useEffect(() => {
    console.log("UPDATE ELLO BIG BOI")
    for(let i = 0; i < routes.length; i++){
      const routeName = routeNames[i]
      const [start, end] = routeName.split(" to ")
      showRoute(i,"Route", start, end);
    }
  }, [analytics]);
  
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

      let localAnalytics = null
      let routeCounts = null
      let routeCounts2 = null
  
      //routingControl was being created for every combination of i and j, Meaning n*(n-1)/2 lines drawn between all possible pairs of points.
      for (let i = 0; i < positionsArray.length; i++) {
        for (let j = i + 1; j < positionsArray.length; j++) {

          if(totalAnalytics.counts.length === 0){
            const message = "No data has been provided"
          }
          else {
            localAnalytics = totalAnalytics

            for(let k = 0; k < localAnalytics.counts.length; k++){
              if(localAnalytics.counts[k].start === roads[i] && localAnalytics.counts[k].end === roads[j]) {
                routeCounts = localAnalytics.counts[k].counts??0;
                break
              }
            }
            for(let k = 0; k < localAnalytics.counts.length; k++){
              if(localAnalytics.counts[k].end === roads[i] && localAnalytics.counts[k].start === roads[j]) {
                routeCounts2 = localAnalytics.counts[k].counts??0;
                break
              }
            }
          }

          if(analytics.counts.length === 0){
            const message = "No data has been provided"
          }
          else {
            localAnalytics = analytics
            for(let k = 0; k < localAnalytics.counts.length; k++){
              if(localAnalytics.counts[k].start === roads[i] && localAnalytics.counts[k].end === roads[j]) {
                routeCounts = localAnalytics.counts[k].counts??0;
                break
              }
            }
            for(let k = 0; k < localAnalytics.counts.length; k++){
              if(localAnalytics.counts[k].end === roads[i] && localAnalytics.counts[k].start === roads[j]) {
                routeCounts2 = localAnalytics.counts[k].counts??0;
                break
              }
            }
          }

          
            
          // console.log("positionsArray:", positionsArray, localAnalytics, analytics, localAnalytics.counts, analytics.counts, totalAnalytics.counts.length, roads);

          // console.log("ROUTE COUNTS:", conts)
          if (positionsArray[i] && positionsArray[j]) {
            console.log("roads", roads)
            const routeName = `${roads[i]} to ${roads[j]}`
            // Check if both positions are non-null

            console.log("myRouteCounts->pre show:", routeCounts);
            
            let carCount = 0, bicycleCount = 0, hgvCount = 0, personCount = 0;
            
            if (routeCounts) {
              if (routeCounts.car) 
                carCount += routeCounts.car;
              if (routeCounts.bicycle != null) 
                bicycleCount += routeCounts.bicycle;
              if (routeCounts.hgv != null) 
                hgvCount += routeCounts.hgv;
              if (routeCounts.person != null) 
                personCount += routeCounts.person;
            }
            if (routeCounts2) {
              if (routeCounts2.car != null) 
                carCount += routeCounts2.car;
              if (routeCounts2.bicycle != null) 
                bicycleCount += routeCounts2.bicycle;
              if (routeCounts2.hgv != null) 
                hgvCount += routeCounts2.hgv;
              if (routeCounts2.person != null) 
                personCount += routeCounts2.person;
            }

            const route = L.Routing.control({
              waypoints: [L.latLng(positionsArray[i]), L.latLng(positionsArray[j])],
              distanceTemplate: "",
              timeTemplate: "",
              //TODO: add route analytics below
              summaryTemplate: (routeCounts) ? `<h2>${routeName}</h2> All Route Analytics:<br>
                                                Cars: ${carCount}<br>
                                                Bicycles: ${bicycleCount}<br>
                                                HGVs: ${hgvCount}<br>
                                                People ${personCount}` : '',
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

    let outgoingCount = null
    let incomingCount = null
    let localAnalytics = analytics

    if(analytics && totalAnalytics){
      for(let i = 0; i < localAnalytics.counts.length; i++){
        if(localAnalytics.counts[i].start === startRoad && localAnalytics.counts[i].end === endRoad) {
          outgoingCount = localAnalytics.counts[i].counts;
          break
        }
      }

      for(let i = 0; i < localAnalytics.counts.length; i++){
        if(localAnalytics.counts[i].end === startRoad && localAnalytics.counts[i].start === endRoad) {
          incomingCount = localAnalytics.counts[i].counts;
          break
        }
      }
  }
    const route = routes[i]
    if(isChecked){
        showRoute(i, type, startRoad, endRoad);
        if (name.includes("incoming_")) {
          route.show()
          let incomingCar = 0, incomingBicycle = 0, incomingHgv = 0, incomingPerson = 0;
          if (incomingCount) {
            incomingCar += incomingCount.car??0;
            incomingBicycle += incomingCount.bicycle??0;
            incomingHgv += incomingCount.hgv??0;
            incomingPerson += incomingCount.person??0;
          }
          route.options.summaryTemplate = `<h2>${routeName}</h2> Incoming Analytics:<br>
                                                            Cars: ${incomingCar}<br>
                                                            Bicycles: ${incomingBicycle}<br>
                                                            HGVs: ${incomingHgv}<br>
                                                            People: ${incomingPerson}`;
        }
        else if(name.includes("outgoing_")){
          route.show()
          let outgoingCar = 0, outgoingBicycle = 0, outgoingHgv = 0, outgoingPerson = 0;
          if (outgoingCount) {
            outgoingCar += outgoingCount.car??0;
            outgoingBicycle += outgoingCount.bicycle??0;
            outgoingHgv += outgoingCount.hgv??0;
            outgoingPerson += outgoingCount.person??0;
          }
          route.options.summaryTemplate = `<h2>${routeName}</h2> Outgoing Analytics:<br>
                                                            Cars: ${outgoingCar??0}<br>
                                                            Bicycles: ${outgoingBicycle??0}<br>
                                                            HGVs: ${outgoingHgv??0}<br>
                                                            People: ${outgoingPerson??0}`;
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
                  onChange={(e) => handleMapCheckBoxes(e, i, "Route", routeNames[i])}
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
                      onChange={(e) => handleMapCheckBoxes(e, i, "Incoming", routeNames[i])}
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
                     onChange={(e) => handleMapCheckBoxes(e, i, "Outgoing", routeNames[i])}
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
          console.log("routes", routeNames)
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

const mapStateToProps = state => {
  return {
    analytics: state.analytics.analytics, // subject to edit for specific values
    totalAnalytics: state.analytics.analytics.all
  }
}

export default connect(mapStateToProps, {getAnalytics, setAnalytics}) (AnalysisMap);