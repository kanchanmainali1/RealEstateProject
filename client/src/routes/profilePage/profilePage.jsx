import "./profilePage.scss";
import apiRequest from "../../lib/apiRequest";
import { Await, Link, useLoaderData, useNavigate } from "react-router-dom";
import { Suspense, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import Chat from "../../components/chat/chat";
import List from "../../components/list/list";


function ProfilePage() {
  const data = useLoaderData();
 
  const { updateUser, currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await apiRequest.post("/auth/logout");
      updateUser(null);
      navigate("/");
    } catch (err) {
      console.error("Logout Error:", err);
    }
  };

  if (!data) {
    return <p>Loading profile data...</p>;
  }

  return (
    <div className="profilePage">
      <div className="details">
        <div className="wrapper">
          <div className="title">
            <h1>User Information</h1>
            <Link to="/profile/update">
              <button>Update Profile</button>
            </Link>
          </div>
          <div className="info">
            <span>
              Avatar:
              <img src={currentUser?.avatar || "noavatar.jpg"} alt="User Avatar" />
            </span>
            <span>
              Username: <b>{currentUser?.username}</b>
            </span>
            <span>
              E-mail: <b>{currentUser?.email}</b>
            </span>
            <button onClick={handleLogout}>Logout</button>
          </div>

          {/* My List Section */}
          <div className="title">
            <h1>My List</h1>
            <Link to="/add">
              <button>Create New Post</button>
            </Link>
          </div>
          <Suspense fallback={<p>Loading...</p>}>
            <Await resolve={data?.postResponse} errorElement={<p>Error loading posts!</p>}>
              {(postResponse) =>
                postResponse?.data?.userPosts?.length ? (
                  <List posts={postResponse.data.userPosts} />
                ) : (
                  <p>No posts found.</p>
                )
              }
            </Await>
          </Suspense>

          {/* Saved List Section */}
          <div className="title">
            <h1>Saved List</h1>
          </div>
          <Suspense fallback={<p>Loading...</p>}>
            <Await resolve={data?.postResponse} errorElement={<p>Error loading posts!</p>}>
              {(postResponse) =>
                postResponse?.data?.savedPosts?.length ? (
                  <List posts={postResponse.data.savedPosts} />
                ) : (
                  <p>No saved posts found.</p>
                )
              }
            </Await>
          </Suspense>
        </div>
      </div>

      {/* Chat Section */}
      <div className="chatContainer">
        <div className="wrapper">
          <Suspense fallback={<p>Loading...</p>}>
            <Await resolve={data?.chatResponse} errorElement={<p>Error loading chats!</p>}>
              {(chatResponse) =>
                chatResponse?.data?.length ? (
                  <Chat chats={chatResponse.data} />
                ) : (
                  <p>No chats found.</p>
                )
              }
            </Await>
          </Suspense>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
