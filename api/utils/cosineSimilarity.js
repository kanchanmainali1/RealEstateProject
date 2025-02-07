

export function cosineSimilarity(A, B) {
    const dotProduct = A.reduce((acc, val, i) => acc + val * B[i], 0);
    const normA = Math.sqrt(A.reduce((acc, val) => acc + val * val, 0));
    const normB = Math.sqrt(B.reduce((acc, val) => acc + val * val, 0));
    return dotProduct / (normA * normB);
  }
  