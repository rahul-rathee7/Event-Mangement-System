import mongoose from 'mongoose';

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
    isFree: {
        type: Boolean,
     },
    isPublic: {
        type: Boolean,
     },
    tags: {
        type: [String],
     },
    image: {
        type: String,
     },
    organizerInfo: {
        type: String,
     },
});

export default mongoose.model('EventData', eventDataSchema);