let geonames = ['Austria', 'Croatia', 'CzechRepublic', 'Denmark', 'England', 'Finland', 'FlemishRegion', 'France',
  'Germany', 'Greece', 'Hungary', 'Iceland', 'Ireland', 'Italy', 'Netherlands', 'NorthernIreland',
  'Norway', 'Portugal', 'Romania', 'Scotland', 'Spain', 'Sweden', 'Switzerland', 'Wales', 'WalloonRegion'];

let geo2svgmap = {
  'Austria': 'Austria',
  'Croatia': 'Croatia',
  'CzechRepublic': 'Czech Republic',
  'Denmark': 'Denmark',
  'England': 'United Kingdom',
  'Finland': 'Finland',
  'FlemishRegion': 'Belgium',
  'France': 'France',
  'Germany': 'Germany',
  'Greece': 'Greece',
  'Hungary': 'Hungary',
  'Iceland': 'Iceland',
  'Ireland': 'Ireland',
  'Italy': 'Italy',
  'Netherlands': 'Netherlands',
  'NorthernIreland': 'United Kingdom',
  'Norway': 'Norway',
  'Portugal': 'Portugal',
  'Romania': 'Romania',
  'Scotland': 'United Kingdom',
  'Spain': 'Spain',
  'Sweden': 'Sweden',
  'Switzerland': 'Switzerland',
  'Wales': 'United Kingdom',
  'WalloonRegion': 'Belgium'
};

function geo2svg(geo) {
  return geo2svgmap[geo];
}
function svg2geo(svg) {
  if (svg == 'United Kingdom') {
    return ['England', 'Wales', 'Scotland', 'NorthernIreland'];
  } else if (svg == 'Belgium') {
    return ['FlemishRegion', 'WalloonRegion'];
  } else {
    return [svg.replace(' ', '')];
  }
}

function checkValidName(svg) {
  return geonames.includes(svg2geo(svg)[0]);
}

module.exports = {
  geo2svg,
  svg2geo,
  checkValidName
}
