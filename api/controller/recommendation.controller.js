import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Helper function to calculate cosine similarity
function cosineSimilarity(vecA, vecB) {
  const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  return dotProduct / (magnitudeA * magnitudeB);
}

// Function to get recommendations for a user
export async function getRecommendations(req, res) {
  const userId = parseInt(req.params.userId);

  try {
    // Get the user's saved posts
    const savedPosts = await prisma.savedPost.findMany({
      where: { userId },
      include: { post: true },
    });

    // Check if the user has saved posts
    if (savedPosts.length === 0) {
      return res.status(200).json({ message: "No saved posts to base recommendations on." });
    }

    // Get all posts in the database
    const allPosts = await prisma.post.findMany({
      include: { postDetail: true },
    });

    // Validate saved posts to avoid invalid or missing data
    const savedFeatures = savedPosts
      .map((savedPost) => {
        if (!savedPost.post || savedPost.post.price == null || savedPost.post.bedroom == null || savedPost.post.bathroom == null) {
          return null;  // Skip invalid posts
        }

        return [
          savedPost.post.price,
          savedPost.post.bedroom || 0,
          savedPost.post.bathroom || 0,
          savedPost.post.type === 'buy' ? 1 : 0, // Binary encoding for type
          savedPost.post.property === 'apartment' ? 1 : 0, // Binary encoding for property
        ];
      })
      .filter((features) => features !== null);  // Filter out invalid features

    // If no valid saved posts exist
    if (savedFeatures.length === 0) {
      return res.status(200).json({ message: "No valid saved posts to base recommendations on." });
    }

    // Calculate average feature vector for saved posts
    const avgSavedFeatures = savedFeatures[0].map((_, i) =>
      savedFeatures.reduce((sum, vec) => sum + vec[i], 0) / savedFeatures.length
    );

    // Calculate cosine similarity for all posts
    const recommendations = allPosts.map((post) => {
      if (!post.price || post.bedroom == null || post.bathroom == null) {
        return null;  // Skip invalid posts
      }

      const postFeatures = [
        post.price,
        post.bedroom || 0,
        post.bathroom || 0,
        post.type === 'buy' ? 1 : 0,
        post.property === 'apartment' ? 1 : 0,
      ];

      const similarity = cosineSimilarity(avgSavedFeatures, postFeatures);
      return { ...post, similarity };
    }).filter((post) => post !== null);  // Filter out invalid posts

    // If no valid recommendations, return a message
    if (recommendations.length === 0) {
      return res.status(200).json({ message: "No valid recommendations available." });
    }

    // Sort recommendations by similarity score
    recommendations.sort((a, b) => b.similarity - a.similarity);

    // Return top 10 recommendations
    res.status(200).json(recommendations.slice(0, 10));
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
