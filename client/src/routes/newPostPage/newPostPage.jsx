import { useState } from "react";
import "./newPostPage.scss";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import apiRequest from "../../lib/apiRequest";
import UploadWidget from "../../components/uploadWidget/UploadWidget";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Pin from "../../components/pin/Pin";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function NewPostPage() {
  const [value, setValue] = useState("");
  const [images, setImages] = useState([]);
  const [error, setError] = useState("");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [type, setType] = useState("rent");  // Track the selected type (rent/buy)

  const navigate = useNavigate();

  const handleMapClick = (e) => {
    const { lat, lng } = e.latlng;
    setLatitude(lat);
    setLongitude(lng);
  };

  const MapClickHandler = () => {
    useMapEvents({
      click: handleMapClick,
    });
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const inputs = Object.fromEntries(formData);

    try {
      const res = await apiRequest.post("/posts", {
        postData: {
          title: inputs.title,
          price: parseInt(inputs.price),
          address: inputs.address,
          city: inputs.city,
          bedroom: parseInt(inputs.bedroom),
          bathroom: parseInt(inputs.bathroom),
          type: inputs.type,
          property: inputs.property,
          latitude: latitude,
          longitude: longitude,
          images: images,
        },
        postDetail: {
          desc: value,
          utilities: inputs.utilities,
          pet: inputs.pet,
          income: inputs.income,
          size: parseInt(inputs.size),
          school: parseInt(inputs.school),
          bus: parseInt(inputs.bus),
          restaurant: parseInt(inputs.restaurant),
        },
      });
      navigate("/" + res.data.id);
    } catch (err) {
      console.log(err);
      setError("An error occurred while submitting the form.");
    }
  };

  return (
    <div className="newPostPage">
      <div className="formContainer">
        <h1>Add New Post</h1>
        <div className="wrapper">
          <form onSubmit={handleSubmit}>
            <div className="item">
              <label htmlFor="title">Title</label>
              <input id="title" name="title" type="text" required />
            </div>
            <div className="item">
              <label htmlFor="price">Price</label>
              <input id="price" name="price" type="number" required />
            </div>
            <div className="item">
              <label htmlFor="address">Address</label>
              <input id="address" name="address" type="text" required />
            </div>
            <div className="item description">
              <label htmlFor="desc">Description</label>
              <ReactQuill theme="snow" onChange={setValue} value={value} />
            </div>
            <div className="item">
              <label htmlFor="city">City</label>
              <input id="city" name="city" type="text" required />
            </div>
            <div className="item">
              <label htmlFor="bedroom">Bedroom Number</label>
              <input min={1} id="bedroom" name="bedroom" type="number" required />
            </div>
            <div className="item">
              <label htmlFor="bathroom">Bathroom Number</label>
              <input min={1} id="bathroom" name="bathroom" type="number" required />
            </div>
            <div className="item">
              <label>Location</label>
              <div style={{ height: "300px", width: "100%", marginBottom: "10px" }}>
                <MapContainer
                  center={[26.3949, 87.1240]}
                  zoom={7}
                  scrollWheelZoom={false}
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <MapClickHandler />
                  {latitude && longitude && (
                    <Pin
                      item={{
                        latitude,
                        longitude,
                        img: images[0] || "",
                        title: "Selected Location",
                        bedroom: 1,
                        price: 0,
                        id: "selected-location",
                      }}
                    />
                  )}
                </MapContainer>
              </div>
            </div>
            <div className="item">
              <label htmlFor="latitude">Latitude</label>
              <input
                id="latitude"
                name="latitude"
                type="text"
                value={latitude || ""}
                readOnly
                required
              />
            </div>
            <div className="item">
              <label htmlFor="longitude">Longitude</label>
              <input
                id="longitude"
                name="longitude"
                type="text"
                value={longitude || ""}
                readOnly
                required
              />
            </div>
            <div className="item">
              <label htmlFor="type">Type</label>
              <select
                name="type"
                required
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="rent">Rent</option>
                <option value="buy">Buy</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="property">Property</label>
              <select name="property" required>
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                
              </select>
            </div>

            {/* Conditional rendering for Utilities and Pet Policy */}
            {type === "rent" && (
              <>
                <div className="item">
                  <label htmlFor="utilities">Utilities Policy</label>
                  <select name="utilities" required>
                    <option value="owner">Owner is responsible</option>
                    <option value="tenant">Tenant is responsible</option>
                    <option value="shared">Shared</option>
                  </select>
                </div>
                <div className="item">
                  <label htmlFor="pet">Pet Policy</label>
                  <select name="pet" required>
                    <option value="allowed">Allowed</option>
                    <option value="not-allowed">Not Allowed</option>
                  </select>
                </div>
              </>
            )}

            <div className="item">
              <label htmlFor="income">Income Policy</label>
              <input
                id="income"
                name="income"
                type="text"
                placeholder="Income Policy"
                required
              />
            </div>
            <div className="item">
              <label htmlFor="size">Total Size (sqft)</label>
              <input min={0} id="size" name="size" type="number" required />
            </div>
            <div className="item">
              <label htmlFor="school">School Distance</label>
              <input min={0} id="school" name="school" type="number" required />
            </div>
            <div className="item">
              <label htmlFor="bus">Bus Stop Distance</label>
              <input min={0} id="bus" name="bus" type="number" required />
            </div>
            <div className="item">
              <label htmlFor="restaurant">Restaurant Distance</label>
              <input min={0} id="restaurant" name="restaurant" type="number" required />
            </div>
            <div className="item">
              <UploadWidget
                uwConfig={{
                  multiple: true,
                  cloudName: "dpnldzy1p",
                  uploadPreset: "realestate",
                  folder: "posts",
                }}
                setState={setImages}
              />
            </div>
            <button className="sendButton">Add</button>
            {error && <span>{error}</span>}
          </form>
        </div>
      </div>
      <div className="sideContainer">
        {images.map((image, index) => (
          <img src={image} key={index} alt="" />
        ))}
      </div>
    </div>
  );
}

export default NewPostPage;
