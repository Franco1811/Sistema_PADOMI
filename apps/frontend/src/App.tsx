import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import Admin from './Admin'; // Asegúrate de que este sea el nombre de tu archivo
import Dashboard from './Dashboard';

function App() {
  const token = localStorage.getItem('token');
  const rol = localStorage.getItem('rol');

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Ruta para Médicos */}
        <Route 
          path="/dashboard" 
          element={token ? <Dashboard /> : <Navigate to="/login" />} 
        />
        
        {/* RUTA NUEVA: Para Administradores */}
        <Route 
          path="/admin" 
          element={token && rol === 'ADMINISTRATIVO' ? <Admin /> : <Navigate to="/login" />} 
        />
        
        {/* Ruta por defecto: Redirige al dashboard según el rol */}
        <Route path="/" element={
          token ? (rol === 'ADMINISTRATIVO' ? <Navigate to="/admin" /> : <Navigate to="/dashboard" />) 
                : <Navigate to="/login" />
        } />
      </Routes>
    </Router>
  );
}

export default App;