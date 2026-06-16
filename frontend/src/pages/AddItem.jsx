import { useState, useRef, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera } from 'lucide-react';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';

export default function AddItem() {
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [exactSpot, setExactSpot] = useState('');
    const [notes, setNotes] = useState('');
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);

    const fileInputRef = useRef(null);
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    // If not logged in, redirect to login
    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !location) {
            alert("Item Name and Location are required!");
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            alert("You are not logged in. Please login again.");
            navigate('/login');
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append('name', name);
        formData.append('location', location);
        formData.append('exactSpot', exactSpot || '');
        formData.append('notes', notes || '');
        if (image) formData.append('image', image);

        try {
            const res = await api.post('/items/add', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert("✅ Item successfully saved!");
            setName('');
            setLocation('');
            setExactSpot('');
            setNotes('');
            setImage(null);
            setPreview(null);
            navigate('/items');
        } catch (error) {
            console.error("Add Item Error:", error);
            if (error.response?.status === 401) {
                alert("Session expired. Please login again.");
                localStorage.removeItem('token');
                navigate('/login');
            } else {
                alert("Failed to add item: " + (error.response?.data?.message || error.message));
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 pb-24">
            <h1 className="text-3xl font-bold text-violet-400 mb-6">➕ Add New Item</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-gray-900 rounded-3xl p-6 text-center">
                    {preview ? (
                        <img src={preview} alt="preview" className="mx-auto rounded-2xl max-h-64 object-cover" />
                    ) : (
                        <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-700 rounded-2xl">
                            <button type="button" onClick={() => fileInputRef.current.click()} className="flex flex-col items-center text-gray-400 hover:text-white">
                                <Camera size={48} />
                                <p className="mt-3">Tap to add photo</p>
                            </button>
                        </div>
                    )}
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                </div>

                <input type="text" placeholder="Item Name * (e.g. Charger)" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-2xl px-5 py-4 text-lg" required />
                <input type="text" placeholder="Location * (e.g. Bedroom Table)" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-2xl px-5 py-4 text-lg" required />
                <input type="text" placeholder="Exact Spot (Optional)" value={exactSpot} onChange={(e) => setExactSpot(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-2xl px-5 py-4" />
                <textarea placeholder="Notes (Optional)" value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-2xl px-5 py-4 h-24" />

                <button type="submit" disabled={loading} className="w-full bg-violet-600 hover:bg-violet-700 py-5 rounded-2xl text-xl font-semibold disabled:opacity-70">
                    {loading ? "Saving..." : "Save Item"}
                </button>
            </form>
        </div>
    );
}