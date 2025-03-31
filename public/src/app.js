const map = L.map("map", { minZoom: 18, maxZoom: 18 }).setView(
  [39.0541714, -76.8821369],
  15
); // Set initial view to San Francisco

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: "© OpenStreetMap",
}).addTo(map);

const load = async () => {
  const response = await fetch("../data/locations.json");
  const shapes = await response.json();

  // Function to draw shapes on the map
  shapes.forEach((shape) => {
    let layer;

    if (shape.type === "polygon") {
      layer = L.polygon(shape.coords).addTo(map);
    } else if (shape.type === "circle") {
      layer = L.circle(shape.coords, { radius: shape.radius }).addTo(map);
    } else if (shape.type === "marker") {
      layer = L.marker(shape.coords).addTo(map);
    }

    if (layer) {
      layer.bindPopup(
        `<b>${shape.title}</b><br><img src="${shape.image}" alt="${shape.title}" style="width:100px;height:auto;">`
      );
    }
  });

  // Add Leaflet Draw plugin
  const drawnItems = new L.FeatureGroup();
  map.addLayer(drawnItems);

  const drawControl = new L.Control.Draw({
    edit: {
      featureGroup: drawnItems,
    },
    draw: {
      polygon: true,
      polyline: true,
      rectangle: true,
      circle: true,
      marker: true,
    },
  });
  map.addControl(drawControl);

  // Handle shape creation and log coordinates
  map.on(L.Draw.Event.CREATED, function (event) {
    const layer = event.layer;
    drawnItems.addLayer(layer);

    let coordinates;
    if (layer instanceof L.Marker) {
      coordinates = layer.getLatLng();
      alert(`Marker coordinates: ${coordinates.lat}, ${coordinates.lng}`);
    } else if (layer instanceof L.Polygon || layer instanceof L.Polyline) {
      coordinates = layer.getLatLngs();
      alert(`Shape coordinates: ${JSON.stringify(coordinates)}`);
    } else if (layer instanceof L.Circle) {
      const center = layer.getLatLng();
      const radius = layer.getRadius();
      alert(`Circle center: ${center.lat}, ${center.lng}, Radius: ${radius}`);
    }
  });
};

load();
// JSON array of shapes with coordinates and associated images
// const shapes = [
//   {
//     type: "polygon",
//     coords: [
//       [37.7749, -122.4194],
//       [37.775, -122.4184],
//       [37.7745, -122.4175],
//     ],
//     title: "Polygon 1",
//     image: "images/polygon1.jpg",
//   },
//   {
//     type: "circle",
//     coords: [39.0541714, -76.8821369],
//     radius: 100,
//     title: "Circle 1",
//     image: "images/circle1.jpg",
//   },
//   {
//     type: "marker",
//     coords: [37.776, -122.421],
//     title: "Marker 1",
//     image: "images/marker1.jpg",
//   },
// ];
