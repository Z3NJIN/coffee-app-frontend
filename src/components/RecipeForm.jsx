import { useState, useMemo } from 'react';
import { createRecipe, BREW_METHODS } from '../api/recipes';
import './RecipeForm.css';

const initialFormState = {
  name: '',
  method: 'V60',
  coffeeDoseGrams: '',
  waterDoseGrams: '',
  extractionTimeSeconds: '',
  temperatureCelsius: '',
  grindSize: '',
};

function RecipeForm() {
  const [form, setForm] = useState(initialFormState);
  const [status, setStatus] = useState('idle'); // idle | saving | success | error
  const [errorMessage, setErrorMessage] = useState('');

  const ratio = useMemo(() => {
    const coffee = parseFloat(form.coffeeDoseGrams);
    const water = parseFloat(form.waterDoseGrams);
    if (!coffee || !water || coffee <= 0) return null;
    return (water / coffee).toFixed(2);
  }, [form.coffeeDoseGrams, form.waterDoseGrams]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus('saving');
    setErrorMessage('');

    try {
      await createRecipe({
        name: form.name,
        method: form.method,
        coffeeDoseGrams: parseFloat(form.coffeeDoseGrams),
        waterDoseGrams: parseFloat(form.waterDoseGrams),
        extractionTimeSeconds: form.extractionTimeSeconds
          ? parseInt(form.extractionTimeSeconds, 10)
          : null,
        temperatureCelsius: form.temperatureCelsius
          ? parseInt(form.temperatureCelsius, 10)
          : null,
        grindSize: form.grindSize || null,
      });
      setStatus('success');
      setForm(initialFormState);
    } catch (error) {
      setStatus('error');
      const message =
        error.response?.data?.message || 'No se pudo guardar la receta. Intenta de nuevo.';
      setErrorMessage(message);
    }
  }

  return (
    <div className="recipe-form-page">
      <div className="recipe-form-card">
        <h1 className="recipe-form-title">Nueva receta</h1>
        <p className="recipe-form-subtitle">
          Registra los parámetros de tu preparación.
        </p>

        <form onSubmit={handleSubmit} className="recipe-form">
          <div className="field">
            <label htmlFor="name">Nombre</label>
            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              placeholder="V60 mañanero"
              required
            />
          </div>

          <div className="field">
            <label htmlFor="method">Método</label>
            <select
              id="method"
              name="method"
              value={form.method}
              onChange={handleChange}
            >
              {BREW_METHODS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>

          <div className="field-row">
            <div className="field">
              <label htmlFor="coffeeDoseGrams">Dosis de café (g)</label>
              <input
                id="coffeeDoseGrams"
                name="coffeeDoseGrams"
                type="number"
                step="1"
                min="0"
                value={form.coffeeDoseGrams}
                onChange={handleChange}
                placeholder="20"
                required
              />
            </div>

            <div className="field">
              <label htmlFor="waterDoseGrams">Agua (g)</label>
              <input
                id="waterDoseGrams"
                name="waterDoseGrams"
                type="number"
                step="1"
                min="0"
                value={form.waterDoseGrams}
                onChange={handleChange}
                placeholder="300"
                required
              />
            </div>
          </div>

          {ratio && (
            <div className="ratio-display">
              <span className="ratio-label">Ratio</span>
              <span className="ratio-value">1 : {ratio}</span>
            </div>
          )}

          <div className="field-row">
            <div className="field">
              <label htmlFor="extractionTimeSeconds">Tiempo (segundos)</label>
              <input
                id="extractionTimeSeconds"
                name="extractionTimeSeconds"
                type="number"
                min="0"
                value={form.extractionTimeSeconds}
                onChange={handleChange}
                placeholder="165"
              />
            </div>

            <div className="field">
              <label htmlFor="temperatureCelsius">Temperatura (°C)</label>
              <input
                id="temperatureCelsius"
                name="temperatureCelsius"
                type="number"
                min="0"
                value={form.temperatureCelsius}
                onChange={handleChange}
                placeholder="93"
              />
            </div>
          </div>

          <div className="field">
            <label htmlFor="grindSize">Molienda</label>
            <input
              id="grindSize"
              name="grindSize"
              type="text"
              value={form.grindSize}
              onChange={handleChange}
              placeholder="Media-fina"
            />
          </div>

          <button type="submit" disabled={status === 'saving'}>
            {status === 'saving' ? 'Guardando…' : 'Guardar receta'}
          </button>

          {status === 'success' && (
            <p className="form-message success">Receta guardada.</p>
          )}
          {status === 'error' && (
            <p className="form-message error">{errorMessage}</p>
          )}
        </form>
      </div>
    </div>
  );
}

export default RecipeForm;
