import { NavLink, useLocation } from 'react-router-dom';
import { Home, Search, Plus, Package } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Navbar() {
    const location = useLocation();
    const [isOtherActive, setIsOtherActive] = useState(false);

    useEffect(() => {
        // Check if current path is NOT '/add'
        setIsOtherActive(location.pathname !== '/add');
    }, [location]);

    const baseClass = "flex flex-col items-center gap-1 transition-all duration-300 ease-out text-gray-500 hover:text-gray-300";
    const activeClass = "flex flex-col items-center gap-1 transition-all duration-300 ease-out text-violet-400 -translate-y-1";

    const iconClass = (isActive) => `w-6 h-6 transition-all duration-300 ${isActive ? 'stroke-violet-400' : 'stroke-gray-500'}`;

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-900/90 backdrop-blur-lg border-t border-gray-800 rounded-t-3xl pb-2 pt-3 z-50">
            <div className="flex justify-around items-end max-w-md mx-auto">

                {/* Home */}
                <NavLink to="/" end className={({ isActive }) => isActive ? activeClass : baseClass}>
                    {({ isActive }) => (
                        <div className="relative">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${isActive ? 'bg-violet-500/20 ring-2 ring-violet-400 shadow-lg shadow-violet-500/50' : 'bg-gray-800/50'}`}>
                                <Home className={iconClass(isActive)} />
                            </div>
                            <span className={`text-xs font-medium mt-1 ${isActive ? 'text-violet-400' : 'text-gray-500'}`}>Home</span>
                        </div>
                    )}
                </NavLink>

                {/* Search */}
                <NavLink to="/search" className={({ isActive }) => isActive ? activeClass : baseClass}>
                    {({ isActive }) => (
                        <div className="relative">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${isActive ? 'bg-violet-500/20 ring-2 ring-violet-400 shadow-lg shadow-violet-500/50' : 'bg-gray-800/50'}`}>
                                <Search className={iconClass(isActive)} />
                            </div>
                            <span className={`text-xs font-medium mt-1 ${isActive ? 'text-violet-400' : 'text-gray-500'}`}>Search</span>
                        </div>
                    )}
                </NavLink>

                {/* Add Item - Now exactly like My Items */}
                <NavLink to="/add" className={({ isActive }) => isActive ? activeClass : baseClass}>
                    {({ isActive }) => (
                        <div className="relative">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${isActive ? 'bg-violet-500/20 ring-2 ring-violet-400 shadow-lg shadow-violet-500/50' : 'bg-gray-800/50'}`}>
                                <Plus className={iconClass(isActive)} />
                            </div>
                            <span className={`text-xs font-medium mt-1 ${isActive ? 'text-violet-400' : 'text-gray-500'}`}>Add</span>
                        </div>
                    )}
                </NavLink>

                {/* My Items */}
                <NavLink to="/items" className={({ isActive }) => isActive ? activeClass : baseClass}>
                    {({ isActive }) => (
                        <div className="relative">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${isActive ? 'bg-violet-500/20 ring-2 ring-violet-400 shadow-lg shadow-violet-500/50' : 'bg-gray-800/50'}`}>
                                <Package className={iconClass(isActive)} />
                            </div>
                            <span className={`text-xs font-medium mt-1 ${isActive ? 'text-violet-400' : 'text-gray-500'}`}>Items</span>
                        </div>
                    )}
                </NavLink>
            </div>
        </div>
    );
}