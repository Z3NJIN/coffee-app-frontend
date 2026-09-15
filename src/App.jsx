import { useState } from 'react';
import RecipeForm from './components/RecipeForm';
import RecipeList from './components/RecipeList';
import './App.css';

function App() {
  const [view, setView] = useState('list'); // 'list' | 'form'

  return (
    <div className="app">
      <nav className="app-nav">
        <button
          className={view === 'list' ? 'active' : ''}
          onClick={() => setView('list')}
        >
          Mis recetas
        </button>
        <button
          className={view === 'form' ? 'active' : ''}
          onClick={() => setView('form')}
        >
          Nueva receta
        </button>
      </nav>

      {view === 'list' ? <RecipeList /> : <RecipeForm />}
    </div>
  );
}

export default App;
