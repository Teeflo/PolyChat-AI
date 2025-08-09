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

// Streaming support: yields partial text chunks as they arrive
export async function streamAIResponse(
  messages: Message[],
  apiKey: string,
  model: string,
  onChunk: (delta: string) => void,
  systemPrompt?: string,
  abortController?: AbortController
): Promise<string> {
  const apiMessages = messages.map(({ id, timestamp, modelId, ...message }) => message);
  if (systemPrompt && systemPrompt.trim()) apiMessages.unshift({ role: 'system', content: systemPrompt.trim() });
  let response: Response;
  try {
    response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'PolyChat AI',
        'Accept': 'text/event-stream'
      },
      body: JSON.stringify({ model, messages: apiMessages, stream: true }),
      signal: abortController?.signal
    });
  } catch {
    return fetchAIResponse(messages, apiKey, model, systemPrompt);
  }
  if (!response.ok || !response.body) {
    return fetchAIResponse(messages, apiKey, model, systemPrompt);
  }
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let full = '';
  let buffer = '';
  while (true) {
    let result;
    try {
      result = await reader.read();
    } catch (e:any) {
      if (abortController?.signal.aborted) break;
      throw e;
    }
    const { value, done } = result;
    if (done) break;
    if (value) {
      buffer += decoder.decode(value, { stream: true });
      const parts = buffer.split(/\n\n/);
      buffer = parts.pop() || '';
      for (const block of parts) {
        const lines = block.split(/\n/).map(l => l.trim()).filter(Boolean);
        for (const line of lines) {
          if (!line.startsWith('data:')) continue;
            const payload = line.slice(5).trim();
            if (!payload) continue;
            if (payload === '[DONE]') { buffer=''; break; }
            try {
              const json = JSON.parse(payload);
              const delta: string | undefined = json.choices?.[0]?.delta?.content;
              if (delta) { full += delta; onChunk(delta); }
            } catch {
              full += payload; onChunk(payload);
            }
        }
      }
    }
  }
  return full;
}