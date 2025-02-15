import React, { useState, useEffect } from "react";

import "./AdminDashboard.scss";
import apiRequest from "../../lib/apiRequest";

const AdminDashboard = () => {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchPosts();
    fetchUsers();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await apiRequest.get("/admin/posts");
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await apiRequest.get("/admin/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const updatePostStatus = async (id, status) => {
    try {
      await apiRequest.patch(`/admin/posts/${id}/status`, { status });
      fetchPosts();
    } catch (error) {
      console.error("Error updating post status:", error);
    }
  };

  const editPost = async (id, newTitle) => {
    try {
      await apiRequest.patch(`/admin/posts/${id}`, { title: newTitle });
      fetchPosts();
    } catch (error) {
      console.error("Error editing post:", error);
    }
  };

  const deletePost = async (id) => {
    try {
      await apiRequest.delete(`/admin/posts/${id}`);
      fetchPosts();
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const toggleBlockUser = async (id) => {
    try {
      await apiRequest.patch(`/admin/users/${id}/block`);
      fetchUsers();
    } catch (error) {
      console.error("Error updating user status:", error);
    }
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <h2>Admin Panel</h2>
        <ul>
          <li>Dashboard</li>
          <li>Manage Posts</li>
          <li>Pending Posts</li>
          <li>Manage Users</li>
          <li>Settings</li>
        </ul>
      </aside>

      <main className="main-content">
        <section className="overview">
          <h2>Dashboard Overview</h2>
          <div className="stats">
            <p>Total Posts: {posts?.length || 0}</p>
            <p>Pending Posts: {posts?.filter((post) => post?.status === "Pending")?.length || 0}</p>
            <p>Total Users: {users?.length || 0}</p>
            <p>Blocked Users: {users?.filter((user) => user?.isBlocked)?.length || 0}</p>
          </div>
        </section>

        <section className="posts">
          <h2>Manage Posts</h2>
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts?.map((post) => (
                <tr key={post.id}>
                  <td>
                    <input
                      type="text"
                      defaultValue={post.title}
                      onBlur={(e) => editPost(post.id, e.target.value)}
                    />
                  </td>
                  <td>{post?.user?.username || "Unknown"}</td>
                  <td>{post?.status}</td>
                  <td>
                    {post.status === "pending" && (
                      <>
                        <button onClick={() => updatePostStatus(post.id, "approved")}>Approve</button>
                        <button onClick={() => updatePostStatus(post.id, "rejected")}>Reject</button>
                      </>
                    )}
                    <button onClick={() => deletePost(post.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="users">
          <h2>Manage Users</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users?.map((user) => (
                <tr key={user.id}>
                  <td>{user?.username}</td>
                  <td>{user?.email}</td>
                  <td>
                    <button onClick={() => toggleBlockUser(user.id)}>
                      {user?.isBlocked ? "Unblock" : "Block"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;