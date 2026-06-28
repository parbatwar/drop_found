import { Routes, Route } from 'react-router-dom';
import Register from './pages/auth/Register';
import Login from './pages/auth/Login';

function App() {
  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default App;