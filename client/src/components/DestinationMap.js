import React from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Graticule,
  Annotation,
  Marker
} from "react-simple-maps";

const geoUrl = "https://raw.githubusercontent.com/deldersveld/topojson/master/continents/europe.json";

function DestinationMap({visitedCountries, desiredCountries}) {
  if (!visitedCountries) {
    visitedCountries = [];
  }
  if (!desiredCountries) {
    desiredCountries = [];
  }

  const visitedColour = '#4F8A6D';
  const toVisitColour = '#306178';
  const defaultColour = '#9998A3';

  const fillDest = (name) => {
    if (visitedCountries.includes(name)) {
      return visitedColour;
    } else if (desiredCountries.includes(name)) {
      return toVisitColour;
    } else {
      return defaultColour;
    }
  };

  return (
      <ComposableMap
        width={800}
        height={400}
        projection="geoAzimuthalEqualArea"
        projectionConfig={{
          center: [5, 0],
          rotate: [-10.0, -53.0, 0],
          scale: 600
        }}
      >
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="#9998A3"
                stroke="#EAEAEC"
                style={{
                  default: {
                    outline: "none",
                    fill: fillDest(geo.properties.geounit)
                  },
                  hover: { outline: "none" },
                  pressed: { outline: "none" },
                }}
              />
            ))
          }
        </Geographies>
        <Annotation
          subject={[-40, 50]}
          dx={0}
          dy={0}
          connectorProps={{
            stroke: 'none'
          }}>
          <text x="10" y="1" textAnchor="center" alignmentBaseline="middle" fill="#000" stroke="#000">
            {'Visited'}
          </text>
        </Annotation>
        <Marker coordinates={[-40, 50]}>
          <circle r={8} fill={visitedColour} />
        </Marker>
        <Annotation
          subject={[-37, 47.5]}
          dx={0}
          dy={0}
          connectorProps={{
            stroke: 'none'
          }}>
          <text x="10" y="1" textAnchor="center" alignmentBaseline="middle" fill="#000" stroke="#000">
            {'Going to Visit'}
          </text>
        </Annotation>
        <Marker coordinates={[-37, 47.5]}>
          <circle r={8} fill={toVisitColour} />
        </Marker>
        <Annotation
          subject={[-34.25, 45]}
          dx={0}
          dy={0}
          connectorProps={{
            stroke: 'none'
          }}>
          <text x="10" y="1" textAnchor="center" alignmentBaseline="middle" fill="#000" stroke="#000">
            {'Not on the Plan'}
          </text>
        </Annotation>
        <Marker coordinates={[-34.25, 45]}>
          <circle r={8} fill={defaultColour} />
        </Marker>
      </ComposableMap>
    );
}

export default DestinationMap;
