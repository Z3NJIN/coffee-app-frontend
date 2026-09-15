import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import RecipeForm from './components/RecipeForm';
import RecipeList from './components/RecipeList';
import RecipeDetail from './components/RecipeDetail';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <nav className="app-nav">
          <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
            Mis recetas
          </NavLink>
          <NavLink to="/recipes/new" className={({ isActive }) => (isActive ? 'active' : '')}>
            Nueva receta
          </NavLink>
        </nav>

        <Routes>
          <Route path="/" element={<RecipeList />} />
          <Route path="/recipes/new" element={<RecipeForm />} />
          <Route path="/recipes/:id" element={<RecipeDetail />} />
          <Route path="/recipes/:id/edit" element={<RecipeForm />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
