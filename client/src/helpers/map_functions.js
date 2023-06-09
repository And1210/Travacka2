function generateImgGeoJSON(imgCoords, urls) {
  let imgGeoJSON = {"type": "FeatureCollection", "features": []};
  let features = [];
  for (let i = 0; i < imgCoords.length; i++) {
    let cur = {"id": i, "type": "Feature", "geometry": {'coordinates': imgCoords[i], 'type': "Point"}, "properties": {"name": i, 'html': {id: i, width: 200, src: urls[i]}}};
    features.push(cur);
  }
  imgGeoJSON.features = features;
  return imgGeoJSON;
}

function displayImgGeoJSON(imgGeoJSON, mapObj) {
  if(typeof mapObj.getLayer('img_data') !== 'undefined')
    mapObj.removeLayer('img_data');
  if(typeof mapObj.getSource('img_data') !== 'undefined')
    mapObj.removeSource('img_data');
  mapObj.addSource('img_data', {
    'type': 'geojson',
    'data': imgGeoJSON
  });
  mapObj.addLayer({
    'id': 'img_data',
    'type': 'circle',
    'source': 'img_data',
    'paint': {
      'circle-radius': 6,
      'circle-color': '#FF0000'
    }
  });
}

function readImg(imgs, map) {
  let imgCoords = [];
  let urls = [];
  for (let i = 0; i < imgs.length; i++) {
    let img = imgs[i];
    imgCoords.push(img.coords);
    urls.push(`${API_ROUTE}/${img.url}`);
  }
  let imgGeoJSON  = generateImgGeoJSON(imgCoords, urls);
  displayImgGeoJSON(imgGeoJSON, map);
}

module.exports = {
  generateImgGeoJSON,
  displayImgGeoJSON,
  readImg
};
