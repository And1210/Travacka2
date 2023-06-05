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

function SelectionMap({desiredCountries, onCountryClick}) {
  // const visitedColour = '#4F8A6D';
  const desiredColour = '#4F8A6D';//'#8FB1B7';
  const defaultColour = '#9998A3';

  const fillDest = (name) => {
    if (desiredCountries.includes(name)) {
      return desiredColour;
    } else {
      return defaultColour;
    }
  };

  return (
      <ComposableMap
        className="countries-map"
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
                onClick={(e) => onCountryClick(geo.properties.geounit)}
                style={{
                  default: {
                    outline: "none",
                    fill: fillDest(geo.properties.geounit)
                  },
                  hover: {
                    outline: "none",
                    fill: fillDest(geo.properties.geounit)
                  },
                  pressed: {
                    outline: "none",
                    fill: fillDest(geo.properties.geounit)
                  },
                }}
              />
            ))
          }
        </Geographies>
      </ComposableMap>
    );
}

export default SelectionMap;
