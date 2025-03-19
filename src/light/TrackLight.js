//Get the map of India
var India = ee.FeatureCollection('USDOS/LSIB/2017')
 .filter(ee.Filter.eq('COUNTRY_NA', 'India'));
 
Map.addLayer(India, {}, 'India');

// Define years for the animation
var years = ee.List.sequence(2000, 2020);

// Define an Image Collection where each image corresponds to a year
var yearlyCollection = ee.ImageCollection(years.map(function(year) {
  var image = ee.ImageCollection("MODIS/006/MOD13A1")
    .filterDate(ee.Date.fromYMD(year, 1, 1), ee.Date.fromYMD(year, 12, 31))
    .mean()
    .select('NDVI') // Select the NDVI band
    .clip(India) // Clip to India's boundary
    .visualize({min: 0, max: 9000, palette: ['blue', 'green', 'red']}) // Apply styling
    .set('system:time_start', ee.Date.fromYMD(year, 1, 1)); // Set time metadata
  
  return image;
}));

// Define video visualization parameters
var videoArgs = {
  framesPerSecond: 5,
  region: India.geometry(), // Use India's boundary as the region
  dimensions: 10,
  format: 'mp4'
};

// Export video to Google Drive
Export.video.toDrive({
  collection: yearlyCollection,
  description: 'NDVI_India_Yearly_Animation',
  folder: 'EarthEngineExports',
  fileNamePrefix: 'NDVI_India_animation',
  framesPerSecond: videoArgs.framesPerSecond,
  dimensions: videoArgs.dimensions,
  region: videoArgs.region
});

// Print and visualize the first year image
print(yearlyCollection);
Map.centerObject(India, 4);
Map.addLayer(yearlyCollection.first(), {}, 'First Year NDVI');


//var nightlights = ee.ImageCollection('NOAA/DMSP-OLS/NIGHTTIME_LIGHTS')
//  .select('stable_lights')
//  .filter(ee.Filter.date('1993-01-01', '1993-12-31'));
  
// Calculate the mean of the nighttime lights for 1993
//var avgNightlights = nightlights.mean();

// Mask the average nighttime lights image using the Indian boundary
//var maskedNightlights = avgNightlights.clip(India);

// Add the average nighttime lights layer to the map
//Map.addLayer(maskedNightlights, {
//  min: 0,
//  max: 63,
//  palette: ['black', 'yellow', 'orange', 'red'] // Color palette for lights intensity
//}, 'Average Nightlights 1993');

// Center the map on India
//Map.centerObject(India, 6);  // Zoom level set to 6
