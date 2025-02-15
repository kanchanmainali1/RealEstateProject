import prisma from "../lib/prisma.js";

// Fetch all posts (admin-only)
export const fetchAllPosts = async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      include: { user: true, postDetail: true },
    });
    res.status(200).json(posts);
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).json({ message: "Failed to fetch posts" });
  }
};

// Update post status (admin-only)
export const updatePostStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  // Validate status
  const allowedStatuses = ["pending", "approved", "rejected"];
  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid status value" });
  }

  try {
    const updatedPost = await prisma.post.update({
      where: { id: parseInt(id) },
      data: { status },
    });
    res.status(200).json(updatedPost);
  } catch (err) {
    console.error("Error updating post status:", err);
    if (err.code === "P2025") {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(500).json({ message: "Failed to update post status" });
  }
};

// Delete any post (admin-only)
export const deletePost = async (req, res) => {
  const { id } = req.params;

  try {
    // Check if the post exists
    const post = await prisma.post.findUnique({ where: { id: parseInt(id) } });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    await prisma.post.delete({ where: { id: parseInt(id) } });
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    console.error("Error deleting post:", err);
    res.status(500).json({ message: "Failed to delete post" });
  }
};

// Fetch all users (admin-only)
export const fetchAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

// Block or unblock a user (admin-only)
export const toggleBlockUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await prisma.user.findUnique({ where: { id: parseInt(id) } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: { isBlocked: !user.isBlocked },
    });
    res.status(200).json(updatedUser);
  } catch (err) {
    console.error("Error toggling user block status:", err);
    if (err.code === "P2025") {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(500).json({ message: "Failed to toggle block status" });
  }
};