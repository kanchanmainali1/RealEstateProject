// src/pages/listPage.jsx

import "./listPage.scss";
import Filter from "../../components/filter/filter";
import Card from "../../components/card/card";
import Map from "../../components/map/map";
import { Await, useLoaderData } from "react-router-dom";
import { Suspense, useEffect, useState } from "react";
import axios from "axios";

function ListPage() {
  const data = useLoaderData();
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    // Ensure data exists and has posts before fetching recommendations
    if (data?.postResponse?.data && data.postResponse.data.length > 0) {
      const postId = data.postResponse.data[0].id; // Use first post as reference for recommendations

      axios
        .get(`http://localhost:8800/api/recommendations/${postId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        .then((res) => setRecommendations(res.data))
        .catch((err) => console.error("Error fetching recommendations:", err));
    }
  }, [data]);

  return (
    <div className="listPage">
      <div className="listContainer">
        <div className="wrapper">
          <Filter />
          <Suspense fallback={<p>Loading...</p>}>
            <Await
              resolve={data?.postResponse}
              errorElement={<p>Error loading posts!</p>}
            >
              {(postResponse) =>
                postResponse?.data?.map((post) => (
                  <Card key={post.id} item={post} />
                ))
              }
            </Await>
          </Suspense>
        </div>
      </div>

      {/* Recommendations Section */}
      {recommendations.length > 0 && (
        <div className="recommendations">
          <h2>Recommended Properties for You</h2>
          <div className="grid grid-cols-3 gap-4">
            {recommendations.map((post) => (
              <Card key={post.id} item={post} />
            ))}
          </div>
        </div>
      )}

      <div className="mapContainer">
        <Suspense fallback={<p>Loading...</p>}>
          <Await
            resolve={data?.postResponse}
            errorElement={<p>Error loading map data!</p>}
          >
            {(postResponse) => <Map items={postResponse?.data || []} />}
          </Await>
        </Suspense>
      </div>
    </div>
  );
}

export default ListPage;
