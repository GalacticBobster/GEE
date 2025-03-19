// Get the map of India
var India = ee.FeatureCollection('USDOS/LSIB/2017')
 .filter(ee.Filter.eq('COUNTRY_NA', 'India'));
 
Map.addLayer(India, {}, 'India');

// Define years for the animation
var years = ee.List.sequence(2000, 2020);

// Define an Image Collection where each image corresponds to a year


// Visualization parameters
//var nighttimeVis = {min: 0.0, max: 60.0, palette: ['black', 'blue', 'purple', 'red', 'orange', 'yellow']};

// Center map and display first year's image
var dataset = ee.ImageCollection('NOAA/VIIRS/DNB/MONTHLY_V1/VCMCFG')
                  .filter(ee.Filter.date('2020-05-01', '2020-05-31'))
var nighttime = dataset.select('avg_rad');
//var nighttimeVis = {min: 0.0, max: 100.0}
Map.centerObject(India, 4);
Map.addLayer(nighttime, {min:0.0, max:1},'Nighttime');




