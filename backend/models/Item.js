import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    location: {
        type: String,
        required: true
    },
    exactSpot: {
        type: String
    },
    imageUrl: {
        type: String
    },
    tags: [{
        type: String
    }],
    lastSeen: {
        type: Date,
        default: Date.now
    },
    notes: String
}, {
    timestamps: true
});

const Item = mongoose.model('Item', itemSchema);
export default Item;