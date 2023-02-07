// React
import React, { useState } from 'react';
import DeckGL from '@deck.gl/react';
import {LineLayer} from '@deck.gl/layers';
import MapGL from 'react-map-gl';

//CSS
import "./Map.css"

// Set your mapbox access token here
const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoiZ2xvZ2FuMTIzIiwiYSI6ImNsZHR1d3I3azJhMzQ0MW4waDJxcnVqdmQifQ.wPekEDtyDiv9aGVkCUMBUQ';

// Viewport settings
const INITIAL_VIEW_STATE = {
  longitude: -122.41669,
  latitude: 37.7853,
  zoom: 13,
  pitch: 0,
  bearing: 0
};

// Data to be used by the LineLayer
const data = [
  {sourcePosition: [-122.41669, 37.7853], targetPosition: [-122.41669, 37.781]}
];

// function Map({width, height}) {
//   const layers = [
//     new LineLayer({id: 'line-layer', data})
//   ];

//   return (
//     <DeckGL
//       initialViewState={INITIAL_VIEW_STATE}
//       controller={true}
//       layers={layers}
//     >
//       <Map mapboxAccessToken={MAPBOX_ACCESS_TOKEN} />
//     </DeckGL>
//   );
// }

const Map = props => {
  const { width, height, viewState, onViewStateChange } = props;

  const layers = [
    new LineLayer({id: 'line-layer', data})
  ];

  return (
      <div className='map'>
        <MapGL
        width = {width}
        height = {height}
        mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
        viewState = {viewState}
        onViewStateChange = {onViewStateChange}
        />
      </div>
      

  // return (
  //   <div className="MapGL">
  //     <DeckGL
  //       initialViewState={INITIAL_VIEW_STATE}
  //       controller={true}
  //       layers={layers}
  //     >
  //     <MapGL mapboxAccessToken={MAPBOX_ACCESS_TOKEN} />
  //     </DeckGL>
  //   </div>
  );

}

export default Map