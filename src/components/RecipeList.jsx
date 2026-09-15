import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllRecipes, methodLabel, BREW_METHODS } from '../api/recipes';
import './RecipeList.css';

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
        if (!cancelled) {
          setRecipes(data);
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
            {status === 'loaded' && `${recipes.length} receta${recipes.length === 1 ? '' : 's'} registrada${recipes.length === 1 ? '' : 's'}`}
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
          {recipes.map((recipe) => (
            <Link key={recipe.id} to={`/recipes/${recipe.id}`} className="recipe-card">
              <div className="recipe-card-header">
                <span className="recipe-method">{methodLabel(recipe.method)}</span>
                <span className="recipe-ratio">1 : {recipe.ratio}</span>
              </div>
              <h2 className="recipe-name">{recipe.name}</h2>
              <div className="recipe-details">
                <span>{recipe.coffeeDoseGrams} g café</span>
                <span>{recipe.waterDoseGrams} g agua</span>
                {recipe.temperatureCelsius && <span>{recipe.temperatureCelsius}°C</span>}
                {recipe.extractionTimeSeconds && (
                  <span>
                    {Math.floor(recipe.extractionTimeSeconds / 60)}:
                    {String(recipe.extractionTimeSeconds % 60).padStart(2, '0')}
                  </span>
                )}
              </div>
              {recipe.grindSize && (
                <p className="recipe-grind">Molienda: {recipe.grindSize}</p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default RecipeList;
