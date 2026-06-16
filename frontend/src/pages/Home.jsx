import { Link } from 'react-router-dom';
import { PlusCircle, Package, Mic } from 'lucide-react';

export default function Home() {
    return (
        <div className="p-6">
            <div className="text-center mt-10">
                <h1 className="text-5xl font-bold text-violet-400 mb-3">Poru Memory AI</h1>
                <p className="text-gray-400 text-xl">Unoda stuff enga irukku nu marakadha...</p>
            </div>

            <div className="grid grid-cols-1 gap-4 mt-16">
                <Link to="/search" className="bg-gray-900 hover:bg-gray-800 p-8 rounded-3xl flex items-center gap-6">
                    <div className="bg-violet-500/20 p-5 rounded-2xl">
                        <Mic size={40} className="text-violet-400" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-semibold">Voice Search</h3>
                        <p className="text-gray-400">"Enga charger irukku?" nu kelu</p>
                    </div>
                </Link>

                <Link to="/add" className="bg-gray-900 hover:bg-gray-800 p-8 rounded-3xl flex items-center gap-6">
                    <div className="bg-emerald-500/20 p-5 rounded-2xl">
                        <PlusCircle size={40} className="text-emerald-400" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-semibold">Add New Item</h3>
                        <p className="text-gray-400">Photo eduthu save pannu</p>
                    </div>
                </Link>

                <Link to="/items" className="bg-gray-900 hover:bg-gray-800 p-8 rounded-3xl flex items-center gap-6">
                    <div className="bg-amber-500/20 p-5 rounded-2xl">
                        <Package size={40} className="text-amber-400" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-semibold">My Items</h3>
                        <p className="text-gray-400">Saved items paaru</p>
                    </div>
                </Link>
            </div>
        </div>
    );
}