import "./listPage.scss";
import Filter from "../../components/filter/Filter";
import Map from "../../components/map/map";
import { Await, useLoaderData } from "react-router-dom";
import { Suspense } from "react";
import Card from "../../components/card/card";

function ListPage() {
  const posts = useLoaderData(); // Ensure this contains postResponse
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
  
    try {
      const response = await fetch(`http://localhost:8800/api/posts/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`, // Auth Token
        },
      });
  
      if (response.ok) {
        setPosts(posts.filter((post) => post.id !== id)); // Remove post from UI
      } else {
        const data = await response.json();
        alert(data.message || "Failed to delete post.");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };
  
  return (
    <div className="listPage">
      <div className="listContainer">
        <div className="wrapper">
          <Filter />
          <Suspense fallback={<p>Loading...</p>}>
            <Await
              resolve={posts?.postResponse} // Use optional chaining
              errorElement={<p>Error loading posts!</p>}
            >
              {(postResponse) =>
                postResponse?.data?.map((post) => ( // Ensure data exists
                  // <Card key={post.id} item={post} />
                  <Card key={post.id} item={post} onDelete={handleDelete} />


                ))
              }
            </Await>
          </Suspense>
        </div>
      </div>
      <div className="mapContainer">
        <Suspense fallback={<p>Loading...</p>}>
          <Await
            resolve={posts?.postResponse} // Use the correct variable here
            errorElement={<p>Error loading map data!</p>}
          >
            {(postResponse) => <Map items={postResponse?.data || []} />} {/* Ensure data exists */}
          </Await>
        </Suspense>
      </div>
    </div>
  );
}

export default ListPage;
