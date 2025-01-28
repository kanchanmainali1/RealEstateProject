import "./listPage.scss";
import Filter from "../../components/filter/Filter";
import Card from "../../components/card/Card";
import Map from "../../components/map/map";
import { Await, useLoaderData } from "react-router-dom";
import { Suspense } from "react";

function ListPage() {
  const posts = useLoaderData(); // Ensure this contains postResponse

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
                  <Card key={post.id} item={post} />
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
