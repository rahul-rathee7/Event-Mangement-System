import eventData from '../models/eventData.js';
import events from '../data.json' with { type: 'json' };

export const event_data = async (req, res) => {
    const id = req.params.id;
    console.log(id);

    try {
        const Event = events.find(event => event.id === parseInt(id));
        console.log(Event);

        if (!Event) {
            return res.status(200).json({ success: false, message: "No event found" });
        }

        return res.status(200).json({ success: true, Event });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
}

export const featured_events = async (req, res) => {
    try {
        if (events.length === 0) {
            return res.status(200).json({ success: false, message: "No events found" });
        }

        const featured = events.filter((event, i) => i < 4)
        return res.status(200).json({ success: true, message: "featured events fetched", events: featured });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Server Error" })
    }
}

export const all_events = async (req, res) => {
    try {
        if (events.length === 0) {
            return res.status(200).json({ success: false, message: "No events found" });
        }

        return res.status(200).json({ success: true, events });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
}


export const create_event = async (req, res) => {
    // accept either `title` or `name` from frontend
    const {
      title: reqTitle,
      name,
      description,
      shortDescription,
      startDate,
      endDate,
      location,
      isOnline,
      category,
      capacity,
      ticketPrice,
      isFree,
      isPublic,
      tags,
      image,
      organizerInfo,
    } = req.body;

    const title = reqTitle || name; // fallback to `name` if frontend sends `name`

    if (!title || !startDate || !organizerInfo) {
        return res.status(400).json({ success: false, message: "Missing required event fields" });
    }

    try {
        const newEvent = new eventData({
            title,
            description,
            shortDescription,
            startDate,
            endDate,
            location,
            isOnline,
            category,
            capacity,
            ticketPrice,
            isFree,
            isPublic,
            tags,
            image,
            organizerInfo,
        });

        const savedEvent = await newEvent.save();
        return res.status(201).json({ success: true, message: "Event created successfully", event: savedEvent });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
}