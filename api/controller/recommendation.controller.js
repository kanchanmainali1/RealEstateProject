// api/controller/recommendation.controller.js

import { PrismaClient } from "@prisma/client";
import { cosineSimilarity } from "../utils/cosineSimilarity.js"; // Import the cosine similarity utility

const prisma = new PrismaClient();

// Get similar listings for a given post
export const getSimilarListings = async (req, res) => {
  try {
    const { postId } = req.params; // Get the current post ID from the URL

    // Fetch the current post by ID
    const currentPost = await prisma.post.findUnique({
      where: { id: Number(postId) },
    });

    if (!currentPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Convert current post into a feature vector
    const currentPostVector = getFeatureVector(currentPost);

    // Fetch all posts except the current one
    const allPosts = await prisma.post.findMany({
      where: { id: { not: currentPost.id } },
    });

    // Calculate similarity scores for each post
    const similarityScores = allPosts.map((post) => {
      const postVector = getFeatureVector(post);
      const similarity = cosineSimilarity(currentPostVector, postVector);
      return { post, similarity };
    });

    // Sort posts by similarity score in descending order
    const sortedPosts = similarityScores
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 5); // Return top 5 recommendations

    // Send the recommended posts
    res.status(200).json(sortedPosts.map((item) => item.post));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching similar listings" });
  }
};

// Convert a post into a feature vector
function getFeatureVector(post) {
  return [
    post.city === "City A" ? 1 : 0, // Location encoding
    post.city === "City B" ? 1 : 0, // Location encoding
    normalizePrice(post.price), // Normalized price
    post.property === "house" ? 1 : 0, // Property type encoding
    post.property === "land" ? 1 : 0, // Property type encoding
    post.property === "apartment" ? 1 : 0, // Property type encoding
    post.bedroom, // Bedrooms
    post.bathroom, // Bathrooms
  ];
}

// Normalize the price (e.g., between 0 and 1)
function normalizePrice(price) {
  const maxPrice = 1000000; // Adjust based on your data range
  return price / maxPrice;
}
