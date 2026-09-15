import apiClient from './client';

export async function createBrew(brew) {
  const response = await apiClient.post('/api/brews', brew);
  return response.data;
}

export async function getBrewsByRecipe(recipeId) {
  const response = await apiClient.get(`/api/recipes/${recipeId}/brews`);
  return response.data;
}

export async function getAverageRating(recipeId) {
  const response = await apiClient.get(`/api/recipes/${recipeId}/brews/average-rating`);
  return response.data.averageRating;
}
