import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UsageStats } from '../types';

interface UsageStatsStore extends UsageStats {
  recordUserMessage: (modelIds: string[]) => void;
  recordAssistantResponse: (modelId: string, responseTimeMs: number) => void;
  recordNewConversation: (modelId: string) => void;
  resetStats: () => void;
}

const DEFAULT_STATS: UsageStats = {
  totalConversations: 0,
  totalMessages: 0,
  totalUserMessages: 0,
  totalAssistantMessages: 0,
  avgResponseTimeMs: 0,
  perModel: {},
  lastUpdated: new Date().toISOString(),
};

export const useUsageStats = create<UsageStatsStore>()(
  persist(
    (set, get) => ({
      ...DEFAULT_STATS,
      recordUserMessage: (modelIds: string[]) => {
        const state = get();
        const updatedPerModel = { ...state.perModel };
        modelIds.forEach((id) => {
          const m = updatedPerModel[id] || { conversations: 0, messages: 0, avgResponseTimeMs: 0 };
          updatedPerModel[id] = { ...m, messages: m.messages + 1 };
        });
        set({
          totalMessages: state.totalMessages + modelIds.length,
          totalUserMessages: state.totalUserMessages + 1,
          perModel: updatedPerModel,
          lastUpdated: new Date().toISOString(),
        });
      },
      recordAssistantResponse: (modelId: string, responseTimeMs: number) => {
        const state = get();
        const model = state.perModel[modelId] || { conversations: 0, messages: 0, avgResponseTimeMs: 0 };
        // Update averaged response time for model
        const newModelAvg = model.messages > 0
          ? Math.round(((model.avgResponseTimeMs * Math.max(model.messages - 1, 0)) + responseTimeMs) / model.messages)
          : responseTimeMs;
        // Update global avg using totalAssistantMessages count
        const newTotalAssistant = state.totalAssistantMessages + 1;
        const newGlobalAvg = state.totalAssistantMessages > 0
          ? Math.round(((state.avgResponseTimeMs * state.totalAssistantMessages) + responseTimeMs) / newTotalAssistant)
          : responseTimeMs;
        set({
          totalMessages: state.totalMessages + 1,
          totalAssistantMessages: newTotalAssistant,
          avgResponseTimeMs: newGlobalAvg,
          perModel: {
            ...state.perModel,
            [modelId]: { ...model, messages: model.messages + 1, avgResponseTimeMs: newModelAvg },
          },
          lastUpdated: new Date().toISOString(),
        });
      },
      recordNewConversation: (modelId: string) => {
        const state = get();
        const model = state.perModel[modelId] || { conversations: 0, messages: 0, avgResponseTimeMs: 0 };
        set({
          totalConversations: state.totalConversations + 1,
          perModel: { ...state.perModel, [modelId]: { ...model, conversations: model.conversations + 1 } },
          lastUpdated: new Date().toISOString(),
        });
      },
      resetStats: () => set({ ...DEFAULT_STATS, lastUpdated: new Date().toISOString() }),
    }),
    { name: 'polychat-usage-stats' }
  )
);
