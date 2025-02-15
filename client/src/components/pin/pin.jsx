import { Marker, Popup } from "react-leaflet";
import "./pin.scss";
import { Link } from "react-router-dom";

function Pin({ item }) {
  return (
    <Marker position={[item.latitude, item.longitude]}>
      <Popup>
        <div className="popupContainer">
          <img 
            src={item.img || '/path/to/default-image.jpg'} // Fallback image
            alt={item.title || 'Property Image'} // Alt text for accessibility
          />
          <div className="textContainer">
            <Link to={`/${item.id}`}>{item.title}</Link>
            <span>{item.bedroom} bedroom</span>
            <b>NRs {item.price}</b>
          </div>
        </div>
      </Popup>
    </Marker>
  );
}

export default Pin;
