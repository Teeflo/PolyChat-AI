import { fetchAvailableModels } from './modelsApi';

export async function testOpenRouterAPI(): Promise<{
  success: boolean;
  message: string;
  modelCount?: number;
}> {
  try {
    const models = await fetchAvailableModels();
    return {
      success: true,
      message: `Modèles récupérés: ${models.length}`,
      modelCount: models.length,
    };
  } catch (error: unknown) {
    return { success: false, message: error instanceof Error ? error.message : String(error) };
  }
}
