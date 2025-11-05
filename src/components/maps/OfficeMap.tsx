"use client";

import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapPin } from "lucide-react";
import { renderToStaticMarkup } from "react-dom/server";

// Create a custom Leaflet icon using L.divIcon
const createCustomMapPinIcon = () => {
  const iconHtml = renderToStaticMarkup(
    <MapPin
      size={32}
      color="#1e40af"
      strokeWidth={2}
      style={{
        backgroundColor: "white",
        borderRadius: "50%",
        padding: "4px",
        boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    />
  );

  return L.divIcon({
    html: iconHtml,
    className: "custom-map-pin-icon",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -30],
  });
};

const OfficeMap = () => {
  const officeLocation = {
    lat: -3.3770885,
    lng: 29.3601258,
    address:
      "Entente Sportive de Bujumbura, Avenue Nicolas Mayugi N° 3, Bujumbura, Burundi",
  };

  // Fix for Leaflet default icon paths
  React.useEffect(() => {
    // @ts-ignore
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "/leaflet/marker-icon-2x.png",
      iconUrl: "/leaflet/marker-icon.png",
      shadowUrl: "/leaflet/marker-shadow.png",
    });
  }, []);

  const customIcon = createCustomMapPinIcon();

  return (
    <MapContainer
      center={[officeLocation.lat, officeLocation.lng]}
      zoom={17}
      style={{ height: "400px", width: "100%", borderRadius: "0.5rem" }}
      scrollWheelZoom={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker
        position={[officeLocation.lat, officeLocation.lng]}
        icon={customIcon}
      >
        <Popup>
          <div className="font-semibold">JM Sport Center</div>
          <div className="text-sm">{officeLocation.address}</div>
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default OfficeMap;
