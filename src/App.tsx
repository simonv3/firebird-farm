import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polygon } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import * as L from "leaflet";
import { css } from "@emotion/css";

const AIRTABLE_TOKEN =
  "patzhOJ8RPc16jjLW.6de0b728c2258e0f12634c8cef8fb919106d61357e934e1fd391b32170a278fe";
const BASE_ID = "appsG0MMwAvSWLYMq";

type Coords = { lat: number; lng: number }[][];

type Polygon = {
  type: "polygon";
  coords: Coords;
  title: string;
  number?: number;
  description: string;
  images?: string[];
};

type Marker = {
  type: "marker";
  coords: number[];
  title: string;
  number?: number;
  description: string;
  images?: string[];
};

type Shape = Marker | Polygon;

const OurMarker: React.FC<{
  position: { lat: number; lng: number };
  number?: number;
  title: string;
  description: string;
  images?: string[];
}> = ({ position, number, title, description, images }) => {
  return (
    <Marker
      position={[position.lat, position.lng]}
      icon={L.divIcon({
        className: "number-icon",
        html: `<div style="background-color: #007bff; color: white; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-size: 14px;">${number}</div>`,
        iconSize: [30, 30],
      })}
    >
      <Popup>
        <b>{title}</b>
        <div>{description}</div>
        {images?.map((image, i) => (
          <img
            key={i}
            src={image}
            alt={title}
            style={{ width: "100px", height: "auto" }}
          />
        ))}
      </Popup>
    </Marker>
  );
};

const App = () => {
  const [shapes, setShapes] = useState<Shape[]>([]);

  // Utility function to calculate the centroid of a polygon
  const calculatePolygonCenter = (coords: Coords) => {
    let latSum = 0;
    let lngSum = 0;
    let totalPoints = 0;

    coords.forEach((coordSet) => {
      coordSet.forEach((point) => {
        latSum += point.lat;
        lngSum += point.lng;
        totalPoints++;
      });
    });

    return {
      lat: latSum / totalPoints,
      lng: lngSum / totalPoints,
    };
  };

  // Fetch data from Airtable
  const fetchLocationsFromAirtable = async () => {
    const personalToken = AIRTABLE_TOKEN; // Replace with your Airtable personal token
    const baseId = BASE_ID; // Replace with your Airtable Base ID
    const tableName = "Locations"; // Replace with your Airtable table name

    const url = `https://api.airtable.com/v0/${baseId}/${tableName}`;

    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${personalToken}`,
        },
      });

      const data = await response.json();
      const formattedData = data.records.map(
        (record: {
          fields: {
            type: string;
            coords: string;
            title: string;
            number: number;
            description: string;
            images: any[];
          };
        }) => ({
          type: record.fields.type,
          coords: JSON.parse(record.fields.coords),
          title: record.fields.title,
          number: record.fields.number,
          description: record.fields.description,
          images: record.fields.images?.map(
            (image) => image.thumbnails?.large.url
          ),
        })
      );
      setShapes(formattedData);
    } catch (error) {
      console.error("Error fetching data from Airtable:", error);
    }
  };

  useEffect(() => {
    fetchLocationsFromAirtable();
  }, []);

  return (
    <div
      className={css`
        width: 100%;
        height: 100vh;
      `}
    >
      <MapContainer
        center={[39.0541714, -76.8821369]}
        zoom={20}
        className={css`
          height: 90vh;
          width: 100%;
        `}
      >
        <TileLayer
          url="http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          attribution="© <a href='http://www.esri.com/'>Esri</a> i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
        />
        {shapes.map((shape, index) => {
          if (shape.type === "polygon") {
            const center = calculatePolygonCenter(shape.coords);
            return (
              <React.Fragment key={index}>
                <Polygon positions={shape.coords} />
                <OurMarker
                  position={center}
                  number={shape.number || index + 1}
                  title={shape.title}
                  description={shape.description}
                  images={shape.images}
                />
              </React.Fragment>
            );
          } else if (shape.type === "marker") {
            return (
              <OurMarker
                key={index}
                position={{ lat: shape.coords[0], lng: shape.coords[1] }}
                number={shape.number || index + 1}
                title={shape.title}
                description={shape.description}
                images={shape.images}
              />
            );
          }
          return null;
        })}
      </MapContainer>
      Rest of site
    </div>
  );
};

export default App;
