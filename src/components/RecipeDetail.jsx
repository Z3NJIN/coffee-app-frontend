import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getRecipeById, methodLabel, deleteRecipe } from '../api/recipes';
import { getBrewsByRecipe, getAverageRating } from '../api/brews';
import BrewForm from './BrewForm';
import BrewLogList from './BrewLogList';
import './RecipeDetail.css';

function RecipeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [brews, setBrews] = useState([]);
  const [averageRating, setAverageRating] = useState(null);
  const [status, setStatus] = useState('loading'); // loading | loaded | error
  const [errorMessage, setErrorMessage] = useState('');
  const [deleting, setDeleting] = useState(false);

  const loadAll = useCallback(async () => {
    setStatus('loading');
    try {
      const [recipeData, brewsData, average] = await Promise.all([
        getRecipeById(id),
        getBrewsByRecipe(id),
        getAverageRating(id),
      ]);
      setRecipe(recipeData);
      setBrews(brewsData);
      setAverageRating(average);
      setStatus('loaded');
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || 'No se pudo cargar la receta.'
      );
      setStatus('error');
    }
  }, [id]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  async function handleBrewCreated() {
    // Refresca la bitácora y el promedio tras registrar una nueva preparación,
    // sin recargar la receta completa.
    try {
      const [brewsData, average] = await Promise.all([
        getBrewsByRecipe(id),
        getAverageRating(id),
      ]);
      setBrews(brewsData);
      setAverageRating(average);
    } catch {
      // si falla el refresco, el usuario aún puede recargar manualmente
    }
  }

  async function handleDelete() {
    const confirmed = window.confirm(
      `¿Eliminar "${recipe.name}"? Esta acción no se puede deshacer.`
    );
    if (!confirmed) return;

    setDeleting(true);
    try {
      await deleteRecipe(id);
      navigate('/');
    } catch (error) {
      setDeleting(false);
      alert(
        error.response?.data?.message || 'No se pudo eliminar la receta.'
      );
    }
  }

  if (status === 'loading') {
    return <p className="detail-state-message">Cargando receta…</p>;
  }

  if (status === 'error') {
    return <p className="detail-state-message error">{errorMessage}</p>;
  }

  return (
    <div className="recipe-detail-page">
      <Link to="/" className="back-link">
        ← Mis recetas
      </Link>

      <div className="detail-header">
        <div className="detail-header-top">
          <span className="detail-method">{methodLabel(recipe.method)}</span>
          <div className="detail-actions">
            <Link to={`/recipes/${id}/edit`} className="edit-link">
              Editar
            </Link>
            <button
              type="button"
              className="delete-button"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? 'Eliminando…' : 'Eliminar'}
            </button>
          </div>
        </div>
        <h1 className="detail-name">{recipe.name}</h1>
      </div>

      <div className="detail-stats">
        <div className="stat">
          <span className="stat-label">Ratio</span>
          <span className="stat-value ratio">1 : {recipe.ratio}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Café</span>
          <span className="stat-value">{recipe.coffeeDoseGrams} g</span>
        </div>
        <div className="stat">
          <span className="stat-label">Agua</span>
          <span className="stat-value">{recipe.waterDoseGrams} g</span>
        </div>
        {recipe.temperatureCelsius && (
          <div className="stat">
            <span className="stat-label">Temperatura</span>
            <span className="stat-value">{recipe.temperatureCelsius}°C</span>
          </div>
        )}
        {recipe.extractionTimeSeconds && (
          <div className="stat">
            <span className="stat-label">Tiempo</span>
            <span className="stat-value">
              {Math.floor(recipe.extractionTimeSeconds / 60)}:
              {String(recipe.extractionTimeSeconds % 60).padStart(2, '0')}
            </span>
          </div>
        )}
        {recipe.grindSize && (
          <div className="stat">
            <span className="stat-label">Molienda</span>
            <span className="stat-value">{recipe.grindSize}</span>
          </div>
        )}
        {averageRating != null && averageRating > 0 && (
          <div className="stat">
            <span className="stat-label">Rating promedio</span>
            <span className="stat-value ratio">{averageRating.toFixed(1)} ★</span>
          </div>
        )}
      </div>

      <BrewForm recipeId={id} onBrewCreated={handleBrewCreated} />

      <h2 className="brew-log-title">Bitácora ({brews.length})</h2>
      <BrewLogList brews={brews} />
    </div>
  );
}

export default RecipeDetail;
