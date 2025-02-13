import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Import Link for routing
import SearchBar from "../../components/searchbar/searchBar";
import "./homePage.scss";
import { AuthContext } from "../../context/AuthContext";

function Homepage() {
  const { currentUser } = useContext(AuthContext);
  const [recommendedProperties, setRecommendedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch recommendations when the component mounts
  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        if (!currentUser?.id) return; // Ensure the user is logged in

        // Fetch recommendations from the backend
        const response = await fetch(
          `http://localhost:8800/api/recommendations/${currentUser.id}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch recommendations");
        }

        const data = await response.json();

        // Ensure the response is an array before setting state
        if (Array.isArray(data)) {
          setRecommendedProperties(data);
        } else {
          // Handle invalid data silently without displaying it in the frontend
          setRecommendedProperties([]); // Empty array to avoid showing invalid data
        }
      } catch (error) {
        console.error("Error fetching recommendations:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [currentUser]);

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
              <span>Apartment</span> with exclusive listings curated just for
              you.
            </p>
          </div>
          <div className="searchContainer">
            <SearchBar />
          </div>
        </div>
      </div>

      {/* Recommended Properties Section */}
      <div className="recommendationsSection">
        <h2>Recommended for You</h2>
        {loading ? (
          <p>Loading recommendations...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : (
          <div className="propertiesGrid">
            {recommendedProperties.length > 0 ? (
              recommendedProperties.map((property) => (
                <Link
                  key={property.id}
                  to={`/${property.id}`} // Navigate to single property page
                  className="propertyCardLink"
                >
                  <div className="propertyCard">
                    <img
                      src={property.images?.[0] || "/default-image.jpg"} // Use first image or a default one if not available
                      alt={property.title || "Property Image"}
                    />
                    <div className="details">
                      <h3>{property.title || "Untitled Property"}</h3>
                      <p>NRs. {property.price?.toLocaleString() || "0"}</p>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <p>No recommendations available.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Homepage;
