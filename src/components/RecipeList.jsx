import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllRecipes, methodLabel, BREW_METHODS } from '../api/recipes';
import { getAverageRating } from '../api/brews';
import './RecipeList.css';

function starsFor(rating) {
  if (!rating) return null;
  const rounded = Math.round(rating);
  return '★'.repeat(rounded) + '☆'.repeat(5 - rounded);
}

function RecipeList() {
  const [recipes, setRecipes] = useState([]);
  const [status, setStatus] = useState('loading'); // loading | loaded | error
  const [errorMessage, setErrorMessage] = useState('');
  const [methodFilter, setMethodFilter] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function loadRecipes() {
      setStatus('loading');
      try {
        const data = await getAllRecipes(methodFilter || undefined);

        // El listado no trae el rating promedio, así que se pide aparte
        // por cada receta y se combina antes de mostrar.
        const withRatings = await Promise.all(
          data.map(async (recipe) => {
            try {
              const averageRating = await getAverageRating(recipe.id);
              return { ...recipe, averageRating };
            } catch {
              return { ...recipe, averageRating: null };
            }
          })
        );

        if (!cancelled) {
          setRecipes(withRatings);
          setStatus('loaded');
        }
      } catch (error) {
        if (!cancelled) {
          setErrorMessage(
            error.response?.data?.message || 'No se pudieron cargar las recetas.'
          );
          setStatus('error');
        }
      }
    }

    loadRecipes();
    return () => {
      cancelled = true;
    };
  }, [methodFilter]);

  return (
    <div className="recipe-list-page">
      <div className="recipe-list-header">
        <div>
          <h1 className="recipe-list-title">Mis recetas</h1>
          <p className="recipe-list-subtitle">
            {status === 'loaded' &&
              `${recipes.length} receta${recipes.length === 1 ? '' : 's'} registrada${recipes.length === 1 ? '' : 's'}`}
          </p>
        </div>

        <select
          value={methodFilter}
          onChange={(e) => setMethodFilter(e.target.value)}
          className="method-filter"
        >
          <option value="">Todos los métodos</option>
          {BREW_METHODS.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>
      </div>

      {status === 'loading' && <p className="state-message">Cargando recetas…</p>}

      {status === 'error' && <p className="state-message error">{errorMessage}</p>}

      {status === 'loaded' && recipes.length === 0 && (
        <p className="state-message">
          Todavía no hay recetas. Crea la primera para empezar tu bitácora.
        </p>
      )}

      {status === 'loaded' && recipes.length > 0 && (
        <div className="recipe-grid">
          {recipes.map((recipe) => {
            const stars = starsFor(recipe.averageRating);
            return (
              <Link key={recipe.id} to={`/recipes/${recipe.id}`} className="recipe-card">
                <div className="recipe-card-header">
                  <span className="recipe-method">{methodLabel(recipe.method)}</span>
                  <div className="recipe-ratio-group">
                    <span className="recipe-ratio-label">RATIO</span>
                    <span className="recipe-ratio-value">1 : {recipe.ratio}</span>
                  </div>
                </div>

                <h2 className="recipe-name">{recipe.name}</h2>

                <div className="recipe-chips">
                  <span className="chip">{recipe.coffeeDoseGrams} g café</span>
                  <span className="chip">{recipe.waterDoseGrams} g agua</span>
                  {recipe.temperatureCelsius && (
                    <span className="chip">{recipe.temperatureCelsius} °C</span>
                  )}
                  {recipe.extractionTimeSeconds && (
                    <span className="chip">
                      {Math.floor(recipe.extractionTimeSeconds / 60)}:
                      {String(recipe.extractionTimeSeconds % 60).padStart(2, '0')}
                    </span>
                  )}
                </div>

                <div className="recipe-card-footer">
                  <span className="recipe-grind">
                    {recipe.grindSize ? `Molienda ${recipe.grindSize}` : ''}
                  </span>
                  {stars && <span className="recipe-stars">{stars}</span>}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default RecipeList;
