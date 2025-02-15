import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import './map.scss';
import "leaflet/dist/leaflet.css";
import Pin from '../pin/Pin';

function Map({ items, onMapClick }) {
  if (!Array.isArray(items) || items.length === 0) {
    return <p>No properties to display on the map.</p>;
  }

  const MapClickHandler = () => {
    useMapEvents({
      click: (event) => {
        const { lat, lng } = event.latlng;
        if (onMapClick) {
          onMapClick(lat, lng);
        }
      },
    });
    return null;
  };

  const mapCenter = items.length === 1
    ? [items[0].latitude, items[0].longitude]
    : [28.3949, 84.1240];

  return (
    <MapContainer
      center={mapCenter}
      zoom={7}
      scrollWheelZoom={true}
      className="map"
      style={{ height: '100%', width: '100%' }} // Ensure the map has a defined height
    >
      <TileLayer
        attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {items.map((item) => (
        <Pin item={item} key={item.id} />
      ))}
      
      <MapClickHandler />
    </MapContainer>
  );
}

export default Map;