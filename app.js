const map = L.map("map", { minZoom: 19 }).setView(
  [39.0541714, -76.8821369],
  17
); // Set initial view to San Francisco

L.tileLayer(
  "http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  {
    maxZoom: 19,
    minZoom: 17,
    attribution:
      "©" +
      '<a href="http://www.esri.com/">Esri</a>' +
      "i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
    ext: "jpg",
  }
).addTo(map);

const load = async () => {
  const response = await fetch("./data/locations.json");
  const shapes = await response.json();

  // Function to draw shapes on the map
  shapes.forEach((shape, index) => {
    let layer;

    if (shape.type === "polygon") {
      layer = L.polygon(shape.coords).addTo(map);
    } else if (shape.type === "circle") {
      layer = L.circle(shape.coords, { radius: shape.radius }).addTo(map);
    } else if (shape.type === "marker") {
      // Create a custom div icon with a number
      const numberIcon = L.divIcon({
        className: "number-icon",
        html: `<div style="background-color: #007bff; color: white; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-size: 14px;">${
          shape.number || index + 1
        }</div>`,
        iconSize: [30, 30],
      });

      layer = L.marker(shape.coords, { icon: numberIcon }).addTo(map);
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
