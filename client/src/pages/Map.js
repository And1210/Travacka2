import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import axios from 'axios';

import "mapbox-gl/dist/mapbox-gl.css";
import "../styles/Map.css";

const MAPBOXGL_KEY = 'pk.eyJ1IjoiYW5kMTIxMCIsImEiOiJja3pnN2VybHYzb3h6Mm9vZmtnc2F6c3JyIn0.RiEy5W9gZsMzFJ8ikp03uA';
const API_ROUTE = process.env.REACT_APP_API_URL;

mapboxgl.accessToken = MAPBOXGL_KEY;

function Map() {
  const mapContainer = useRef(null);

  const initMap = (coords, zoom) => {
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: coords,//[-18.75, 65],
      zoom: zoom,
    });
  };

  useEffect(() => {
    initMap([-18.75, 65], 5);
  }, []);

  return (
    <div>
      <div className="map-grid-container">
        <div>Placeholder</div>
        <div ref={mapContainer} className="map-container" />
      </div>
    </div>
  );
}

export default Map;
