import { useState, useEffect, useContext } from 'react';
import { Package, Edit, Trash2, Eye, MapPin, X } from 'lucide-react';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';

export default function MyItems() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);

    // Modal states
    const [viewItem, setViewItem] = useState(null);
    const [editItem, setEditItem] = useState(null);
    const [editForm, setEditForm] = useState({ name: '', location: '', exactSpot: '', notes: '' });
    const [editImage, setEditImage] = useState(null);
    const [editPreview, setEditPreview] = useState(null);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const res = await api.get('/items');
            setItems(res.data.items || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const deleteItem = async (id) => {
        if (!window.confirm("Delete this item?")) return;
        try {
            await api.delete(`/items/${id}`);
            setItems(items.filter(item => item._id !== id));
        } catch (error) {
            alert("Failed to delete");
        }
    };

    // Open Edit Modal
    const openEditModal = (item) => {
        setEditItem(item);
        setEditForm({
            name: item.name,
            location: item.location,
            exactSpot: item.exactSpot || '',
            notes: item.notes || '',
        });
        setEditPreview(item.imageUrl || null);
        setEditImage(null);
    };

    // Handle file change in edit
    const handleEditFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setEditImage(file);
            setEditPreview(URL.createObjectURL(file));
        }
    };

    // Submit edit
    const handleEditSubmit = async (e) => {
        e.preventDefault();
        if (!editForm.name || !editForm.location) {
            alert("Item Name and Location are required!");
            return;
        }
        setUpdating(true);
        const formData = new FormData();
        formData.append('name', editForm.name);
        formData.append('location', editForm.location);
        formData.append('exactSpot', editForm.exactSpot);
        formData.append('notes', editForm.notes);
        if (editImage) formData.append('image', editImage);

        try {
            const res = await api.put(`/items/${editItem._id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            // Update local list
            setItems(items.map(i => i._id === editItem._id ? res.data.item : i));
            setEditItem(null);
            alert("Item updated!");
        } catch (error) {
            console.error(error);
            alert("Update failed: " + (error.response?.data?.message || error.message));
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return <div className="p-6 text-center">Loading your items...</div>;

    return (
        <div className="p-6 pb-24">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-violet-400">📦 My Items</h1>
                <span className="text-gray-400">{items.length} items</span>
            </div>

            {items.length === 0 ? (
                <div className="text-center py-20">
                    <Package size={80} className="mx-auto text-gray-600" />
                    <p className="text-xl text-gray-400 mt-6">No items added yet</p>
                    <p className="text-gray-500">Add your first item using + button</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {items.map((item) => (
                        <div key={item._id} className="bg-gray-900 rounded-3xl overflow-hidden border border-gray-800">
                            {item.imageUrl && (
                                <img
                                    src={item.imageUrl}
                                    alt={item.name}
                                    className="w-full h-48 object-cover"
                                />
                            )}
                            <div className="p-5">
                                <h3 className="text-xl font-semibold">{item.name}</h3>
                                <p className="text-violet-400 mt-1 flex items-center gap-2">
                                    <MapPin size={16} /> {item.location}
                                </p>
                                {item.exactSpot && <p className="text-gray-400 text-sm mt-1">📍 {item.exactSpot}</p>}
                                {item.notes && <p className="text-gray-500 mt-3 text-sm line-clamp-2">{item.notes}</p>}

                                <div className="flex gap-3 mt-6">
                                    {/* View Button */}
                                    <button
                                        onClick={() => setViewItem(item)}
                                        className="flex-1 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 py-3 rounded-2xl flex items-center justify-center gap-2"
                                    >
                                        <Eye size={18} /> View
                                    </button>
                                    {/* Edit Button */}
                                    <button
                                        onClick={() => openEditModal(item)}
                                        className="flex-1 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 py-3 rounded-2xl flex items-center justify-center gap-2"
                                    >
                                        <Edit size={18} /> Edit
                                    </button>
                                    {/* Delete Button */}
                                    <button
                                        onClick={() => deleteItem(item._id)}
                                        className="flex-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 py-3 rounded-2xl flex items-center justify-center gap-2"
                                    >
                                        <Trash2 size={18} /> Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* ========== VIEW MODAL ========== */}
            {viewItem && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-900 rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-gray-900 p-4 flex justify-between items-center border-b border-gray-800">
                            <h2 className="text-2xl font-bold text-violet-400">Item Details</h2>
                            <button onClick={() => setViewItem(null)} className="text-gray-400 hover:text-white">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="p-5">
                            {viewItem.imageUrl && (
                                <img src={viewItem.imageUrl} alt={viewItem.name} className="w-full rounded-2xl mb-4" />
                            )}
                            <h3 className="text-2xl font-semibold">{viewItem.name}</h3>
                            <p className="text-violet-400 flex items-center gap-2 mt-2"><MapPin size={18} /> {viewItem.location}</p>
                            {viewItem.exactSpot && <p className="text-gray-300 mt-1">📍 Exact spot: {viewItem.exactSpot}</p>}
                            {viewItem.notes && <p className="text-gray-400 mt-4 bg-gray-800 p-3 rounded-xl">📝 {viewItem.notes}</p>}
                            <p className="text-gray-500 text-sm mt-4">Added on: {new Date(viewItem.createdAt).toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* ========== EDIT MODAL ========== */}
            {editItem && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-900 rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-gray-900 p-4 flex justify-between items-center border-b border-gray-800">
                            <h2 className="text-2xl font-bold text-yellow-400">Edit Item</h2>
                            <button onClick={() => setEditItem(null)} className="text-gray-400 hover:text-white">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleEditSubmit} className="p-5 space-y-4">
                            {/* Image preview + upload */}
                            <div className="bg-gray-800 rounded-2xl p-4 text-center">
                                {editPreview ? (
                                    <img src={editPreview} alt="preview" className="mx-auto rounded-xl max-h-40 object-cover" />
                                ) : (
                                    <div className="h-32 flex items-center justify-center border border-dashed border-gray-600 rounded-xl">
                                        <span className="text-gray-400">No image</span>
                                    </div>
                                )}
                                <input type="file" accept="image/*" onChange={handleEditFileChange} className="mt-3 text-sm text-gray-400" />
                            </div>

                            <input type="text" placeholder="Item Name *" value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3" required />

                            <input type="text" placeholder="Location *" value={editForm.location} onChange={e => setEditForm({ ...editForm, location: e.target.value })}
                                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3" required />

                            <input type="text" placeholder="Exact Spot (Optional)" value={editForm.exactSpot} onChange={e => setEditForm({ ...editForm, exactSpot: e.target.value })}
                                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3" />

                            <textarea placeholder="Notes (Optional)" value={editForm.notes} onChange={e => setEditForm({ ...editForm, notes: e.target.value })}
                                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 h-24" />

                            <button type="submit" disabled={updating}
                                className="w-full bg-yellow-600 hover:bg-yellow-700 py-3 rounded-xl font-semibold disabled:opacity-70">
                                {updating ? "Updating..." : "Update Item"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}