import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";

//  Get all posts
export const getPosts = async (req, res) => {
  const query = req.query;
  console.log("Query Params:", query);  // Debugging log

  try {
    const posts = await prisma.post.findMany({
      where: {
        city: query.city && query.city !== "" ? query.city : undefined,  // Ignore empty strings
        type: query.type || undefined,
        bedroom: query.bedroom && !isNaN(query.bedroom) ? parseInt(query.bedroom, 10) : undefined,
        price: {
          gte: query.minPrice && query.minPrice !== "0" ? parseInt(query.minPrice, 10) : undefined,
          lte: query.maxPrice && query.maxPrice !== "0" ? parseInt(query.maxPrice, 10) : undefined,
        },
      },
    });

    console.log("Fetched Posts:", posts);  // Debugging log

    res.status(200).json(posts);
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).json({ message: "Failed to get posts" });
  }
};

//  Get single post with authentication check
export const getPost = async (req, res) => {
  const id = parseInt(req.params.id, 10);

  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        postDetail: true,
        user: { select: { username: true, avatar: true } },
      },
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const token = req.cookies?.token;

    if (token) {
      jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
        if (!err) {
          const saved = await prisma.savedPost.findUnique({
            where: {
              userId_postId: {
                postId: id,
                userId: payload.id,
              },
            },
          });

          return res.status(200).json({ ...post, isSaved: !!saved });
        }
      });
    } else {
      res.status(200).json({ ...post, isSaved: false });
    }
  } catch (err) {
    console.error("Error fetching post:", err);
    res.status(500).json({ message: "Failed to get post" });
  }
};

//  Add new post
export const addPost = async (req, res) => {
  const { postData, postDetail } = req.body;
  const tokenUserId = req.userId;

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

//  Update post
export const updatePost = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { postData, postDetail } = req.body;
  const tokenUserId = req.userId;

  try {
    const existingPost = await prisma.post.findUnique({ where: { id } });

    if (!existingPost) {
      return res.status(404).json({ message: "Post not found" });
    }

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

//  Delete post
export const deletePost = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const tokenUserId = req.userId;

  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include: { postDetail: true }, //  Include postDetail to check if it exists
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.userId !== tokenUserId) {
      return res.status(403).json({ message: "Not authorized to delete this post" });
    }

    //  Delete related PostDetail first
    if (post.postDetail) {
      await prisma.postDetail.delete({
        where: { postId: id },
      });
    }

    // Now delete the Post
    await prisma.post.delete({ where: { id } });

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    console.error("Error deleting post:", err);
    res.status(500).json({ message: "Failed to delete post" });
  }
};
