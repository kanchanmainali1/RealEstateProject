import { useContext } from "react";
import SearchBar from "../../components/searchbar/searchBar";
import "./homePage.scss";
import { AuthContext } from "../../context/AuthContext";

function Homepage() {
  const { currentUser } = useContext(AuthContext);
  console.log(currentUser);

  // Dummy data for recommended properties (replace with actual data later)
  const recommendedProperties = [
    {
      id: 1,
      title: "Luxury Apartment in Kathmandu",
      price: "NRs.1,200,000",
      image: "/a1.webp",
    },
    {
      id: 2,
      title: "Modern House in Pokhara",
      price: "NRs.2,500,000",
      image: "/b1.webp",
    },
    {
      id: 3,
      title: "Small Family House ",
      price: "NRs.800,000",
      image: "/c3.webp",
    },
    {
      id: 4,
      title: "Spacious Family Home",
      price: "NRs.1,500,000",
      image: "/d4.webp",
    },
  ];

  // Dummy data for the image gallery
  const galleryImages = [
    { id: 1, src: "/house1.jpg", alt: "Luxury Apartment" },
    { id: 2, src: "/Home.png", alt: "ModernHouse" },
  ];

  return (
    <div className="homePage">
      {/* Hero Section */}
      <div className="heroSection">
        <div className="overlay"></div>
        <div className="content">
            <div className="hometext"> 
            <h1 className="title">Find Your Perfect Home</h1>
          <p className="subtitle">
            Unlock the door to your next <span>House</span> and{" "}
            <span>Apartment</span> with exclusive listings curated just for you.
          </p>
            </div>
         
          <div className="searchContainer">
            <SearchBar />
          </div>
        </div>
      </div>

      {/* Image Gallery Section */}
      <div className="photoGallery">
        <h2>Explore Our Listings</h2>
        <div className="galleryGrid">
          {galleryImages.map((image) => (
            <div key={image.id} className="galleryItem">
              <img src={image.src} alt={image.alt} />
              <div className="overlayText">{image.alt}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Properties Section */}
      <div className="recommendationsSection">
        <h2>Recommended for You</h2>
        <div className="propertiesGrid">
          {recommendedProperties.map((property) => (
            <div key={property.id} className="propertyCard">
              <img src={property.image} alt={property.title} />
              <div className="details">
                <h3>{property.title}</h3>
                <p>{property.price}</p>
                <button>View Details</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Homepage;
