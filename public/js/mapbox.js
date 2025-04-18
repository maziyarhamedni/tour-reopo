// "use strict";
// var __importDefault = (this && this.__importDefault) || function (mod) {
//     return (mod && mod.__esModule) ? mod : { "default": mod };
// };

// const leaflet_1 = __importDefault(require("leaflet"));
// const element = document.getElementById('map');
// if (!element) {
//     throw new Error('element not exists');
// }
// const data = element.dataset.locations;
// if (!data) {
//     throw new Error('dataset on element location  not exists');
// }
// const tourLocation = JSON.parse(data);
// console.log(tourLocation);
// // Target's GPS coordinates.
// // Set map's center to target with zoom 14.
// // map.setView(target, 14);
// // // Place a marker on the same location.
// // L.marker(target).addTo(map);
// // Prepare GeoJSON features from the tour locations
// const geojsonData = {
//     type: 'FeatureCollection',
//     features: tourLocation.map((location) => ({
//         type: location.type,
//         properties: {
//             describtion: location.description,
//             day: location.day
//         },
//         geometry: {
//             type: location.type,
//             coordinates: location.coordinates,
//         },
//     })),
// };
// // // Initialize the map
// const map = leaflet_1.default.map(element).setView([20, 0], 2); // Set initial view to a centered point
// // Add OpenStreetMap tiles
// leaflet_1.default.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//     maxZoom: 19,
//     attribution: '©OpenStreetMap',
// }).addTo(map);
// // Add GeoJSON layer to the map
// leaflet_1.default.geoJSON(geojsonData, {
//     onEachFeature: function (feature, layer) {
//         if (feature.properties && feature.properties.name) {
//             layer.bindPopup(feature.properties.name);
//         }
//     },
// }).addTo(map);
