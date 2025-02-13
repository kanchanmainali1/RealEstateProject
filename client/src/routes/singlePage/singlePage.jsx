import "./singlePage.scss";
import Slider from "../../components/slider/Slider";
import Map from "../../components/map/map";
import { useNavigate, useLoaderData } from "react-router-dom";
import DOMPurify from "dompurify";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";

function SinglePage() {
  const post = useLoaderData();
  const [saved, setSaved] = useState(post?.isSaved || false); // Fallback to false if isSaved is undefined
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSave = async () => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    setSaved((prev) => !prev);
    try {
      await apiRequest.post("/users/save", { postId: post.id });
    } catch (err) {
      console.log(err);
      setSaved((prev) => !prev);
    }
  };

  return (
    <div className="singlePage">
      <div className="details">
        <div className="wrapper">
          <Slider images={post?.images || []} />
          <div className="info">
            <div className="top">
              <div className="post">
                <h1>{post?.title || "No Title Available"}</h1>
                <div className="address">
                  <img src="/pin.png" alt="Pin" />
                  <span>{post?.address || "No Address Available"}</span>
                </div>
                <div className="price">
                  NRs.{post?.price || "0"}
                </div>
                <div className="propertyType">
                  <span>Type: </span>
                  <strong>{post?.type === "rent" ? "For Rent" : "For Sale"}</strong>
                </div>
              </div>
              <div className="user">
                <img src={post?.user?.avatar || "/noavatar.jpg"} alt="User Avatar" />
                <span>{post?.user?.username || "Unknown User"}</span>
              </div>
            </div>
            <div
              className="bottom"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(post?.postDetail?.desc || "No Description Available"),
              }}
            ></div>
          </div>
        </div>
      </div>
      <div className="features">
        <div className="wrapper">
          <p className="title">General</p>
          <div className="listVertical">
            {post?.type === "rent" && (
              <>
                <div className="feature">
                  <img src="/utility.png" alt="Utilities" />
                  <div className="featureText">
                    <span>Utilities</span>
                    <p>
                      {post?.postDetail?.utilities === "owner"
                        ? "Owner is responsible"
                        : "Tenant is responsible"}
                    </p>
                  </div>
                </div>
                <div className="feature">
                  <img src="/pet.png" alt="Pet Policy" />
                  <div className="featureText">
                    <span>Pet Policy</span>
                    <p>
                      {post?.postDetail?.pet === "allowed"
                        ? "Pets Allowed"
                        : post?.postDetail?.pet === "notAllowed"
                        ? "Pets not Allowed"
                        : "Not Applicable"}
                    </p>
                  </div>
                </div>
              </>
            )}
            <div className="feature">
              <img src="/fee.png" alt="Income Policy" />
              <div className="featureText">
                <span>Income Policy</span>
                <p>{post?.postDetail?.income || "No Information"}</p>
              </div>
            </div>
          </div>
          <p className="title">Sizes</p>
          <div className="sizes">
            <div className="size">
              <img src="/size.png" alt="Size" />
              <span>{post?.postDetail?.size || "0"} sqft</span>
            </div>
            <div className="size">
              <img src="/bed.png" alt="Beds" />
              <span>{post?.bedroom || "0"} beds</span>
            </div>
            <div className="size">
              <img src="/bath.png" alt="Baths" />
              <span>{post?.bathroom || "0"} bathroom</span>
            </div>
          </div>
          <p className="title">Nearby Places</p>
          <div className="listHorizontal">
            <div className="feature">
              <img src="/school.png" alt="School" />
              <div className="featureText">
                <span>School</span>
                <p>
                  {post?.postDetail?.school
                    ? post.postDetail.school > 999
                      ? post.postDetail.school / 1000 + "km"
                      : post.postDetail.school + "m"
                    : "No Information"}{" "}
                  away
                </p>
              </div>
            </div>
            <div className="feature">
              <img src="/bus.png" alt="Bus Stop" />
              <div className="featureText">
                <span>Bus Stop</span>
                <p>{post?.postDetail?.bus || "0"}m away</p>
              </div>
            </div>
            <div className="feature">
              <img src="/restaurant.png" alt="Restaurant" />
              <div className="featureText">
                <span>Restaurant</span>
                <p>{post?.postDetail?.restaurant || "0"}m away</p>
              </div>
            </div>
          </div>
          <p className="title">Location</p>
          <div className="mapContainer">
            <Map items={[post]} />
          </div>
          <div className="buttons">
            <button>
              <img src="/chat.png" alt="Chat" />
              Send a Message
            </button>
            <button
              onClick={handleSave}
              style={{
                backgroundColor: saved ? "#fece51" : "white",
              }}
            >
              <img src="/save.png" alt="Save" />
              {saved ? "Place Saved" : "Save the Place"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SinglePage;
