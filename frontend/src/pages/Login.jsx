import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate('/');
        } catch (error) {
            alert("Login failed: " + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6">
            <div className="bg-gray-900 p-8 rounded-3xl w-full max-w-md">
                <h1 className="text-3xl font-bold text-violet-400 mb-6">Login</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-gray-800 p-3 rounded-xl" required />
                    <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-gray-800 p-3 rounded-xl" required />
                    <button type="submit" className="w-full bg-violet-600 hover:bg-violet-700 p-3 rounded-xl font-semibold">Login</button>
                </form>
                <p className="text-center text-gray-400 mt-4">
                    Don't have an account? <Link to="/register" className="text-violet-400">Register</Link>
                </p>
            </div>
        </div>
    );
}