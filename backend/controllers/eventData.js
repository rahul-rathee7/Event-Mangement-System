import events from "../models/eventData.js";
import { v2 as cloudinary } from 'cloudinary'

export const event_data = async (req, res) => {
  const id = req.params.id;

  try {
    const Event = await events.findById(id);

    if (!Event) {
      return res.status(404).json({
        success: false,
        message: "No event found",
      });
    }

    return res.status(200).json({
      success: true,
      Event
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


export const featured_events = async (req, res) => {
  try {
    const featured = await events.find().limit(4);

    return res.status(200).json({
      success: true,
      message: "Featured events fetched",
      events: featured,
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const all_events = async (req, res) => {
  try {
    const allEvents = await events.find();

    return res.status(200).json({
      success: true,
      events: allEvents,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
// ...existing code...
export const create_event = async (req, res) => {
  try {
    let imageUrl = "";

    // If frontend uploaded file in multipart/form-data, multer fills req.file
    if (req.file) {
      const base64Image = req.file.buffer.toString('base64');
      const uploaded = await cloudinary.uploader.upload(`data:${req.file.mimetype};base64,${base64Image}`, {
        folder: "event-images",
        resource_type: "image",
      });

      if (uploaded && uploaded.secure_url) {
        imageUrl = uploaded.secure_url;
      }
    }

    if (!imageUrl && req.body?.imageUrl) {
      imageUrl = req.body.imageUrl;
    }

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
      ticketOptions,
      organizerInfo,
    } = req.body;

    const title = reqTitle || name;

    // 3. VALIDATION
    const requiredFields = { title, startDate, organizerInfo };
    const missingFields = Object.entries(requiredFields)
      .filter(([key, value]) => !value)
      .map(([key]) => key);

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required event fields: ${missingFields.join(', ')}`,
      });
    }

    const newEvent = new events({
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
      tags: tags ? JSON.parse(tags) : [],
      ticketOptions: ticketOptions ? JSON.parse(ticketOptions) : [],
      image: imageUrl,
      organizerInfo,
    });

    const savedEvent = await newEvent.save();

    return res.status(201).json({
      success: true,
      message: "Event created successfully",
      event: savedEvent,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
