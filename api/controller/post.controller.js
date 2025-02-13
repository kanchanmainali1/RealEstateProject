import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";

// Get all posts
export const getPosts = async (req, res) => {
  const { city, type, bedroom, minPrice, maxPrice } = req.query;
  try {
    const posts = await prisma.post.findMany({
      where: {
        city: city && city.trim() !== "" ? city : undefined,
        type: type || undefined,
        bedroom: bedroom && !isNaN(bedroom) ? parseInt(bedroom, 10) : undefined,
        price: {
          gte: minPrice && minPrice !== "0" ? parseInt(minPrice, 10) : undefined,
          lte: maxPrice && maxPrice !== "0" ? parseInt(maxPrice, 10) : undefined,
        },
      },
    });
    res.status(200).json(posts);
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).json({ message: "Failed to get posts" });
  }
};

// Get single post with authentication check
export const getPost = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json({ message: "Invalid post ID" });

  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        postDetail: true,
        user: { select: { username: true, avatar: true } },
      },
    });

    if (!post) return res.status(404).json({ message: "Post not found" });

    const token = req.cookies?.token;
    if (!token) return res.status(200).json({ ...post, isSaved: false });

    jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
      if (err) return res.status(200).json({ ...post, isSaved: false });

      const saved = await prisma.savedPost.findUnique({
        where: {
          userId_postId: { postId: id, userId: payload.id },
        },
      });

      res.status(200).json({ ...post, isSaved: !!saved });
    });
  } catch (err) {
    console.error("Error fetching post:", err);
    res.status(500).json({ message: "Failed to get post" });
  }
};

// Add new post
export const addPost = async (req, res) => {
  const { postData, postDetail } = req.body;
  const tokenUserId = req.userId;
  if (!tokenUserId) return res.status(401).json({ message: "Unauthorized" });

  try {
    const newPost = await prisma.post.create({
      data: {
        ...postData,
        userId: tokenUserId,
        postDetail: { create: postDetail },
      },
    });
    res.status(201).json(newPost);
  } catch (err) {
    console.error("Error creating post:", err);
    res.status(500).json({ message: "Failed to create post" });
  }
};

// Update post
export const updatePost = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json({ message: "Invalid post ID" });

  const { postData, postDetail } = req.body;
  const tokenUserId = req.userId;
  if (!tokenUserId) return res.status(401).json({ message: "Unauthorized" });

  try {
    const existingPost = await prisma.post.findUnique({ where: { id } });
    if (!existingPost) return res.status(404).json({ message: "Post not found" });

    if (existingPost.userId !== tokenUserId) {
      return res.status(403).json({ message: "Not authorized to update this post" });
    }

    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        ...postData,
        postDetail: postDetail ? { update: postDetail } : undefined,
      },
    });

    res.status(200).json(updatedPost);
  } catch (err) {
    console.error("Error updating post:", err);
    res.status(500).json({ message: "Failed to update post" });
  }
};

// Delete post
export const deletePost = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json({ message: "Invalid post ID" });

  const tokenUserId = req.userId;
  if (!tokenUserId) return res.status(401).json({ message: "Unauthorized" });

  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include: { postDetail: true },
    });

    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.userId !== tokenUserId) {
      return res.status(403).json({ message: "Not authorized to delete this post" });
    }

    // Use transaction to delete dependent records before the post
    await prisma.$transaction([
      // Delete SavedPost records referencing this post
      prisma.savedPost.deleteMany({ where: { postId: id } }),
      
      // Delete post details (if any)
      post.postDetail ? prisma.postDetail.delete({ where: { postId: id } }) : Promise.resolve(),

      // Finally, delete the post
      prisma.post.delete({ where: { id } }),
    ]);

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    console.error("Error deleting post:", err);
    res.status(500).json({ message: "Failed to delete post" });
  }
};
