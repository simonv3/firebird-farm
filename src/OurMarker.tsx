import { Marker, Popup } from "react-leaflet";

import * as L from "leaflet";
import styled from "@emotion/styled";
import Lightbox from "./Lightbox";

const StyledPop = styled(Popup)`
  border-radius: 0;
  .leaflet-popup-content-wrapper {
    border-radius: 0;
  }

  .leaflet-popup-tip-container {
    visibility: hidden;
  }
`;

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
      eventHandlers={{
        click: () => {
          console.log("Marker clicked", number);
          document.getElementById(`marker-${number}`)?.scrollIntoView({
            behavior: "smooth",
          });
        },
      }}
      icon={L.divIcon({
        className: "number-icon",
        html: `<div style="background-color: #007bff; color: white; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-size: 14px;">${number}</div>`,
        iconSize: [30, 30],
      })}
    >
      {/* <StyledPop minWidth={480}>
        <b>{title}</b>
        <div>{description}</div>
        <Lightbox images={images ?? []} />
      </StyledPop> */}
    </Marker>
  );
};

export default OurMarker;
