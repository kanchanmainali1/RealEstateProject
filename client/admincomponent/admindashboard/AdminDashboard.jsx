import React, { useState } from "react";
import "./AdminDashboard.scss";

const AdminDashboard = () => {
  const [posts, setPosts] = useState([
    { id: 1, title: "House for Sale", author: "User1", status: "Pending" },
    { id: 2, title: "Apartment for Rent", author: "User2", status: "Approved" },
  ]);
  const [users, setUsers] = useState([
    { id: 1, name: "John Doe", email: "john@example.com", blocked: false },
    { id: 2, name: "Jane Doe", email: "jane@example.com", blocked: false },
  ]);

  const approvePost = (id) => {
    setPosts(posts.map((post) => (post.id === id ? { ...post, status: "Approved" } : post)));
  };

  const rejectPost = (id) => {
    setPosts(posts.filter((post) => post.id !== id));
  };

  const toggleBlockUser = (id) => {
    setUsers(users.map((user) => (user.id === id ? { ...user, blocked: !user.blocked } : user)));
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
            <p>Total Posts: {posts.length}</p>
            <p>Pending Posts: {posts.filter(post => post.status === "Pending").length}</p>
            <p>Total Users: {users.length}</p>
            <p>Blocked Users: {users.filter(user => user.blocked).length}</p>
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
              {posts.map((post) => (
                <tr key={post.id}>
                  <td>{post.title}</td>
                  <td>{post.author}</td>
                  <td>{post.status}</td>
                  <td>
                    {post.status === "Pending" && (
                      <>
                        <button onClick={() => approvePost(post.id)}>Approve</button>
                        <button onClick={() => rejectPost(post.id)}>Reject</button>
                      </>
                    )}
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
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <button onClick={() => toggleBlockUser(user.id)}>
                      {user.blocked ? "Unblock" : "Block"}
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
