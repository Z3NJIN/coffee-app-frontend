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
