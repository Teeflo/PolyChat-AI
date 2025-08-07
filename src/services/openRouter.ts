import type { Message } from '../types/index';

const API_URL = 'https://openrouter.ai/api/v1/chat/completions';

export const fetchAIResponse = async (
  messages: Message[],
  apiKey: string,
  model: string,
  systemPrompt?: string
): Promise<string> => {
  try {
    // Préparer les messages pour l'API en excluant les propriétés spécifiques à l'interface
    const apiMessages = messages.map(({ id, timestamp, modelId, ...message }) => message);
    
    // Ajouter le system prompt au début si fourni et pas vide
    if (systemPrompt && systemPrompt.trim()) {
      apiMessages.unshift({
        role: 'system',
        content: systemPrompt.trim()
      });
    }

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'PolyChat AI',
      },
      body: JSON.stringify({
        model,
        messages: apiMessages,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch AI response: ${error.message}`);
    }
    throw new Error('An unknown error occurred while fetching AI response');
  }
};