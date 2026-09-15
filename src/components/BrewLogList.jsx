import './BrewLogList.css';

function formatDate(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toLocaleDateString('es-CO', { day: 'numeric', month: 'short' });
}

function BrewLogList({ brews }) {
  if (brews.length === 0) {
    return (
      <p className="brew-log-empty">
        Aún no has registrado ninguna preparación con esta receta.
      </p>
    );
  }

  return (
    <div className="brew-log-list">
      {brews.map((brew) => (
        <div key={brew.id} className="brew-entry">
          <div className="brew-entry-header">
            <span className="brew-date">{formatDate(brew.brewedAt)}</span>
            <span className="brew-rating">
              {'★'.repeat(brew.rating)}
              {'☆'.repeat(5 - brew.rating)}
            </span>
          </div>

          {brew.tastingNote?.tags?.length > 0 && (
            <div className="brew-tags">
              {brew.tastingNote.tags.map((tag) => (
                <span key={tag} className="brew-tag">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {brew.notes && <p className="brew-notes">{brew.notes}</p>}
        </div>
      ))}
    </div>
  );
}

export default BrewLogList;
