import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Register first
            await api.post('/auth/register', { name, email, password });
            // After successful registration, automatically login
            await login(email, password);
            navigate('/');
        } catch (error) {
            alert("Registration failed: " + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6">
            <div className="bg-gray-900 p-8 rounded-3xl w-full max-w-md">
                <h1 className="text-3xl font-bold text-violet-400 mb-6">Register</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} className="w-full bg-gray-800 p-3 rounded-xl" required />
                    <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-gray-800 p-3 rounded-xl" required />
                    <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-gray-800 p-3 rounded-xl" required />
                    <button type="submit" disabled={loading} className="w-full bg-violet-600 hover:bg-violet-700 p-3 rounded-xl font-semibold disabled:opacity-70">
                        {loading ? "Creating account..." : "Register"}
                    </button>
                </form>
                <p className="text-center text-gray-400 mt-4">
                    Already have an account? <Link to="/login" className="text-violet-400">Login</Link>
                </p>
            </div>
        </div>
    );
}