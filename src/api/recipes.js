import apiClient from './client';

export const BREW_METHODS = [
  { value: 'V60', label: 'V60' },
  { value: 'AEROPRESS', label: 'Aeropress' },
  { value: 'FRENCH_PRESS', label: 'Prensa francesa' },
  { value: 'MOKA_POT', label: 'Moka pot' },
];

export async function createRecipe(recipe) {
  const response = await apiClient.post('/api/recipes', recipe);
  return response.data;
}

export async function getAllRecipes(method) {
  const response = await apiClient.get('/api/recipes', {
    params: method ? { method } : {},
  });
  return response.data;
}

export async function getRecipeById(id) {
  const response = await apiClient.get(`/api/recipes/${id}`);
  return response.data;
}

export async function updateRecipe(id, recipe) {
  const response = await apiClient.put(`/api/recipes/${id}`, recipe);
  return response.data;
}

export async function deleteRecipe(id) {
  await apiClient.delete(`/api/recipes/${id}`);
}

export function methodLabel(value) {
  const found = BREW_METHODS.find((m) => m.value === value);
  return found ? found.label : value;
}
