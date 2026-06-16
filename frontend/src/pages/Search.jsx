import { useState, useContext } from 'react';
import { Mic, Search as SearchIcon } from 'lucide-react';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';

export default function Search() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const { user } = useContext(AuthContext);

    const recognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    const startVoiceSearch = () => {
        if (!recognition) {
            alert("Your browser doesn't support voice search");
            return;
        }

        const recog = new recognition();
        recog.lang = 'ta-IN'; // Tamil + English support
        recog.interimResults = false;

        recog.onstart = () => setIsListening(true);
        recog.onend = () => setIsListening(false);

        recog.onresult = async (event) => {
            const transcript = event.results[0][0].transcript;
            setQuery(transcript);
            await searchItems(transcript);
        };

        recog.start();
    };

    const searchItems = async (searchQuery) => {
        if (!searchQuery) return;

        setLoading(true);
        try {
            const res = await api.get(`/items/search?q=${searchQuery}`);
            setResults(res.data.items || []);
        } catch (error) {
            console.error(error);
            // Fallback: Get all items and filter
            const allRes = await api.get('/items');
            const filtered = allRes.data.items.filter(item =>
                item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.location.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setResults(filtered);
        } finally {
            setLoading(false);
        }
    };

    const handleTextSearch = (e) => {
        e.preventDefault();
        searchItems(query);
    };

    return (
        <div className="p-6 pb-24">
            <h1 className="text-3xl font-bold text-violet-400 mb-6">🔍 Search Items</h1>

            {/* Search Bar */}
            <form onSubmit={handleTextSearch} className="flex gap-3 mb-8">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search... (e.g. charger, passport)"
                    className="flex-1 bg-gray-900 border border-gray-700 rounded-2xl px-6 py-4 text-lg"
                />
                <button
                    type="button"
                    onClick={startVoiceSearch}
                    className={`p-4 rounded-2xl transition-all ${isListening ? 'bg-red-500 animate-pulse' : 'bg-violet-600 hover:bg-violet-700'}`}
                >
                    <Mic size={28} />
                </button>
                <button type="submit" className="bg-violet-600 hover:bg-violet-700 px-8 rounded-2xl">
                    <SearchIcon size={28} />
                </button>
            </form>

            {/* Results */}
            {loading ? (
                <p className="text-center text-gray-400">Searching...</p>
            ) : results.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                    {results.map((item) => (
                        <div key={item._id} className="bg-gray-900 rounded-3xl p-5 border border-gray-700">
                            {item.imageUrl && <img src={item.imageUrl} alt="" className="w-full h-48 object-cover rounded-2xl mb-4" />}
                            <h3 className="text-xl font-semibold">{item.name}</h3>
                            <p className="text-violet-400 mt-1">📍 {item.location}</p>
                            {item.exactSpot && <p className="text-gray-400 text-sm">→ {item.exactSpot}</p>}
                        </div>
                    ))}
                </div>
            ) : query && (
                <p className="text-center text-gray-400 mt-10">No items found for "{query}"</p>
            )}
        </div>
    );
}