// Define Vadodara coordinates
var vadodara = ee.Geometry.Point([73.1812, 22.3072]);
var clickedPoints = [];
// Define the date range
var startDate = '2020-02-01';
var endDate = '2024-02-10';

// Load Landsat 8/9 Collection and filter by date and location
var landsat = ee.ImageCollection('LANDSAT/LC09/C02/T1_TOA') // Landsat 9, change to LC08 for Landsat 8
              .filterBounds(vadodara)
              .filterDate(startDate, endDate)
              .sort('CLOUD_COVER') // Sort by least cloud cover
              .first(); // Select the best image

// Check if an image is available
if (landsat) {
  print('Landsat Image:', landsat);

  // Define visualization parameters for different views
  var visTrueColor = {bands: ['B4', 'B3', 'B2'], min: 0, max: 0.3, gamma: 1.4};
  var visFalseColor = {bands: ['B5', 'B4', 'B3'], min: 0, max: 0.3};
  var visSWIR = {bands: ['B6', 'B5', 'B4'], min: 0, max: 0.3};
  
  // Add different views to the map
  Map.addLayer(landsat, visTrueColor, 'True Color');
  Map.addLayer(landsat, visFalseColor, 'False Color (Vegetation)');
  Map.addLayer(landsat, visSWIR, 'SWIR Composite');
  
  // Add image to the map
  Map.centerObject(vadodara, 10);
  Map.setOptions('HYBRID');
}

// Function to Extract Time Series at Clicked Location
var getTimeSeries = function(coords) {
  var point = clickedPoints.push(ee.Geometry.Point([coords.lon, coords.lat]));
  
  // Filter the ImageCollection to the same area and date range
  var landsatCollection = ee.ImageCollection('LANDSAT/LC09/C02/T1_TOA')
                            .filterBounds(point)
                            .filterDate(startDate, endDate)
                            .sort('system:time_start'); // Sort by time
  
  // Select bands for True Color, False Color, and SWIR
  var trueColorCollection = landsatCollection.select(['B4', 'B3', 'B2']);  // True Color (Red, Green, Blue)
  var falseColorCollection = landsatCollection.select(['B5', 'B4', 'B3']); // False Color (Vegetation)
  var swirCollection = landsatCollection.select(['B6', 'B5', 'B4']);        // SWIR Composite (SWIR, NIR, Red)
  
  // Extract time series for a specific band in False Color (e.g., Red Band, B5)
  var falseColorRedChart = ui.Chart.image.series({
    imageCollection: falseColorCollection.select('B5'), // Select Red band for False Color
    region: point,
    reducer: ee.Reducer.mean(),
    scale: 30, // Landsat resolution
    xProperty: 'system:time_start'
  }).setOptions({
    title: 'False Color (Red) Time Series',
    vAxis: {title: 'Reflectance Value'},
    hAxis: {title: 'Date'},
    lineWidth: 2,
    pointSize: 4
  });

  // Print the chart for the selected band (Red)
  print(falseColorRedChart);
};

// Add click event listener to map
Map.onClick(getTimeSeries);

