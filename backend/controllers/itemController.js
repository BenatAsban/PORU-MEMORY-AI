import Item from '../models/Item.js';
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Upload buffer to Cloudinary
const uploadToCloudinary = (buffer, folder) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { folder: folder },
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
        );
        uploadStream.end(buffer);
    });
};

export const addItem = async (req, res) => {
    try {
        console.log("=== ADD ITEM START ===");
        console.log("req.user:", req.user);

        const { name, location, exactSpot, tags, notes } = req.body;
        const userId = req.user?.id;

        if (!userId) {
            console.error("❌ No userId in req.user");
            return res.status(401).json({ success: false, message: "User not authenticated" });
        }

        console.log("Name:", name, "Location:", location);

        let imageUrl = '';
        if (req.file) {
            try {
                console.log("Uploading image to Cloudinary...");
                const result = await uploadToCloudinary(req.file.buffer, 'poru-memory-ai');
                imageUrl = result.secure_url;
                console.log("✅ Image uploaded:", imageUrl);
            } catch (cloudError) {
                console.error("Cloudinary upload error:", cloudError);
                // Continue without image
            }
        }

        // Parse tags if sent as string
        let tagsArray = [];
        if (tags) {
            tagsArray = typeof tags === 'string' ? tags.split(',').map(t => t.trim()) : tags;
        }

        const itemData = {
            userId,
            name: name.trim(),
            location: location.trim(),
            exactSpot: exactSpot || '',
            imageUrl,
            tags: tagsArray,
            notes: notes || ''
        };

        console.log("Creating item with data:", itemData);

        const item = await Item.create(itemData);
        console.log("✅ Item created:", item._id);

        res.status(201).json({
            success: true,
            message: "Item added successfully",
            item
        });
    } catch (error) {
        console.error("❌ Add Item Error:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

export const getItems = async (req, res) => {
    try {
        const items = await Item.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json({ success: true, items });
    } catch (error) {
        console.error("Get Items Error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const updateItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, location, exactSpot, tags, notes } = req.body;

        const existingItem = await Item.findOne({ _id: id, userId: req.user.id });
        if (!existingItem) {
            return res.status(404).json({ success: false, message: "Item not found" });
        }

        let imageUrl = existingItem.imageUrl;
        if (req.file) {
            try {
                const result = await uploadToCloudinary(req.file.buffer, 'poru-memory-ai');
                imageUrl = result.secure_url;
            } catch (err) {
                console.error("Image upload failed on update:", err);
            }
        }

        let tagsArray = existingItem.tags;
        if (tags) {
            tagsArray = typeof tags === 'string' ? tags.split(',').map(t => t.trim()) : tags;
        }

        const updatedItem = await Item.findByIdAndUpdate(
            id,
            {
                name: name || existingItem.name,
                location: location || existingItem.location,
                exactSpot: exactSpot !== undefined ? exactSpot : existingItem.exactSpot,
                tags: tagsArray,
                notes: notes !== undefined ? notes : existingItem.notes,
                imageUrl
            },
            { new: true }
        );

        res.json({ success: true, item: updatedItem });
    } catch (error) {
        console.error("Update Error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const deleteItem = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Item.findOneAndDelete({ _id: id, userId: req.user.id });
        if (!deleted) {
            return res.status(404).json({ success: false, message: "Item not found" });
        }
        res.json({ success: true, message: "Item deleted" });
    } catch (error) {
        console.error("Delete Error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export { upload };