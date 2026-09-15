import { useState } from 'react';
import { createBrew } from '../api/brews';
import './BrewForm.css';

const initialState = {
  rating: 3,
  notes: '',
  acidity: 3,
  sweetness: 3,
  body: 3,
  tags: '',
};

function BrewForm({ recipeId, onBrewCreated }) {
  const [form, setForm] = useState(initialState);
  const [status, setStatus] = useState('idle'); // idle | saving | error
  const [errorMessage, setErrorMessage] = useState('');

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus('saving');
    setErrorMessage('');

    const tags = form.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    try {
      const created = await createBrew({
        recipeId: Number(recipeId),
        rating: Number(form.rating),
        notes: form.notes || null,
        tastingNote: {
          acidity: Number(form.acidity),
          sweetness: Number(form.sweetness),
          body: Number(form.body),
          tags,
        },
      });
      setForm(initialState);
      setStatus('idle');
      onBrewCreated?.(created);
    } catch (error) {
      setStatus('error');
      setErrorMessage(
        error.response?.data?.message || 'No se pudo registrar la preparación.'
      );
    }
  }

  return (
    <form onSubmit={handleSubmit} className="brew-form">
      <h2 className="brew-form-title">Registrar preparación</h2>

      <div className="field">
        <label htmlFor="rating">Rating: {form.rating}</label>
        <input
          id="rating"
          name="rating"
          type="range"
          min="1"
          max="5"
          step="1"
          value={form.rating}
          onChange={handleChange}
        />
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="acidity">Acidez: {form.acidity}</label>
          <input
            id="acidity"
            name="acidity"
            type="range"
            min="1"
            max="5"
            step="1"
            value={form.acidity}
            onChange={handleChange}
          />
        </div>
        <div className="field">
          <label htmlFor="sweetness">Dulzor: {form.sweetness}</label>
          <input
            id="sweetness"
            name="sweetness"
            type="range"
            min="1"
            max="5"
            step="1"
            value={form.sweetness}
            onChange={handleChange}
          />
        </div>
        <div className="field">
          <label htmlFor="body">Cuerpo: {form.body}</label>
          <input
            id="body"
            name="body"
            type="range"
            min="1"
            max="5"
            step="1"
            value={form.body}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="field">
        <label htmlFor="tags">Notas de sabor (separadas por coma)</label>
        <input
          id="tags"
          name="tags"
          type="text"
          value={form.tags}
          onChange={handleChange}
          placeholder="panela, cítrico"
        />
      </div>

      <div className="field">
        <label htmlFor="notes">Notas libres</label>
        <textarea
          id="notes"
          name="notes"
          value={form.notes}
          onChange={handleChange}
          placeholder="¿Cómo salió esta vez?"
          rows={2}
        />
      </div>

      <button type="submit" disabled={status === 'saving'}>
        {status === 'saving' ? 'Guardando…' : 'Registrar'}
      </button>

      {status === 'error' && <p className="form-message error">{errorMessage}</p>}
    </form>
  );
}

export default BrewForm;
