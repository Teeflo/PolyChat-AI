import { pipeline, cos_sim, FeatureExtractionPipeline } from '@xenova/transformers';
import type { Message } from '../types';

// Singleton class to ensure we only load the model once
class EmbeddingService {
  private static instance: FeatureExtractionPipeline | null = null;

  static async getInstance() {
    if (this.instance === null) {
      this.instance = (await pipeline(
        'feature-extraction',
        'Xenova/all-MiniLM-L6-v2'
      )) as FeatureExtractionPipeline;
    }
    return this.instance;
  }
}

// Function to calculate embeddings for a batch of texts
async function getEmbeddings(texts: string[]): Promise<number[][]> {
  const extractor = await EmbeddingService.getInstance();
  const embeddings = await Promise.all(
    texts.map(async (text) => {
      const embedding = await extractor(text, { pooling: 'mean', normalize: true });
      return embedding.tolist();
    })
  );
  return embeddings;
}

// Main function to get relevant context
export async function getRelevantContext(
  query: string,
  history: Message[],
  maxMessages: number = 5
): Promise<Message[]> {
  if (history.length === 0) {
    return [];
  }

  // Prepare texts for embedding
  const queryText = query;
  const historyTexts = history.map((msg) => `${msg.role}: ${msg.content}`);

  // Generate embeddings
  const [queryEmbedding, ...historyEmbeddings] = await getEmbeddings([queryText, ...historyTexts]);

  // Calculate similarities
  const similarities = historyEmbeddings.map((histEmbedding) =>
    cos_sim(queryEmbedding, histEmbedding)
  );

  // Get indices of top N most similar messages
  const topIndices = similarities
    .map((similarity, index) => ({ similarity, index }))
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, maxMessages)
    .map((item) => item.index);

  // Retrieve the most relevant messages and sort them chronologically
  const relevantMessages = topIndices
    .map((index) => history[index])
    .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

  return relevantMessages;
}
