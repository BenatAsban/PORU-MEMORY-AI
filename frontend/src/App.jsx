import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import AddItem from './pages/AddItem';
import MyItems from './pages/MyItems';
import Search from './pages/Search';
import Login from './pages/Login';
import Register from './pages/Register';   // ← Add this

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-950 text-white">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/add" element={<AddItem />} />
            <Route path="/items" element={<MyItems />} />
            <Route path="/search" element={<Search />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />   {/* Add this */}
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;