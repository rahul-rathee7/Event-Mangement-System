import mongoose from 'mongoose';

const ticketOptionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    }
});

const eventDataSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    shortDescription: {
        type: String,
    },
    startDate: {
        type: Date,
    },
    endDate: {
        type: Date,
    },
    location: {
        type: String,
    },
    isOnline: {
        type: Boolean,
    },
    category: {
        type: String,
    },
    capacity: {
        type: Number,
    },
    ticketPrice: {
        type: Number,
    },

    // 👇 FIXED: Explicit object structure
    ticketOptions: {
        type: [ticketOptionSchema],
        default: []
    },

    isFree: {
        type: Boolean,
    },
    isPublic: {
        type: Boolean,
    },

    // Tags should always be strings
    tags: {
        type: [String],
        default: []
    },

    image: {
        type: String,
    },

    organizerInfo: {
        type: String,
    },

    register_user_id: {
        type: [String],
        default: []
    }
});

export default mongoose.model('EventData', eventDataSchema);