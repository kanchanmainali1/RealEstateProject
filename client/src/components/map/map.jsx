import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import './map.scss';
import "leaflet/dist/leaflet.css";
import Pin from '../pin/Pin';

function Map({ items, onMapClick }) {
  // Handler for map clicks
  const MapClickHandler = () => {
    useMapEvents({
      click: (event) => {
        const { lat, lng } = event.latlng;
        onMapClick(lat, lng); // Pass the clicked coordinates to the parent
      },
    });
    return null;
  };

  return (
    <MapContainer
      center={
        items.length === 1
          ? [items[0].latitude, items[0].longitude]
          : [28.3949, 84.1240]
      }
      zoom={7}
      scrollWheelZoom={false}
      className='map'
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {items.map((item) => (
        <Pin item={item} key={item.id} />
      ))}
      <MapClickHandler /> {/* Add the click handler */}
    </MapContainer>
  );
}

export default Map;