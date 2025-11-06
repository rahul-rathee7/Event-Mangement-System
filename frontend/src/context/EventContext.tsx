"use client"
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';


type Event = {
  _id?: string
  title?: string
  name?: string
  description?: string
  location?: string
  date?: string
  time?: string
  image?: string
  // allow extra fields (ticketOptions, tags etc)
  [key: string]: any
}

interface EventContextType {
    events: Event[];
    setEvents: React.Dispatch<React.SetStateAction<Event[]>>;
    FeaturedEvents: Event[];
    sendData: (payload?: Partial<Event>) => Promise<void>
}

export const EventContext = createContext<EventContextType>({
    events: [],
    setEvents: (() => {}) as React.Dispatch<React.SetStateAction<Event[]>>,
    FeaturedEvents: [],
    sendData: async () => {},
});

export const EventContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [events, setEvents] = useState<Event[]>([]);
    const [FeaturedEvents, setFeaturedEvents] = useState<Event[]>([]);

    // sendData: creates event on backend
    const sendData = async (payload: Partial<Event> = {}) => {
        try {
            const apiBase = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

            // normalize payload keys: backend expects `title` (some code used `name`)
            const body: any = {
                ...payload,
                title: (payload as any).title || (payload as any).name || '',
            };

            // remove client-only attrs
            delete body.coverImage; // we'll not send raw File here
            // ensure arrays/objects are serialized if needed
            if (body.tags && !Array.isArray(body.tags)) {
                try { body.tags = JSON.parse(body.tags) } catch {}
            }
            if (body.ticketOptions && typeof body.ticketOptions !== 'string') {
                body.ticketOptions = body.ticketOptions;
            }

            // If payload includes a File (cover image) — send as multipart
            if ((payload as any).coverImage && (payload as any).coverImage.file) {
                const fd = new FormData();
                // map fields
                fd.append('title', body.title);
                fd.append('description', body.description || '');
                fd.append('shortDescription', body.shortDescription || '');
                fd.append('startDate', body.startDate ? new Date(body.startDate).toISOString() : '');
                if (body.endDate) fd.append('endDate', new Date(body.endDate).toISOString());
                fd.append('location', body.location || '');
                fd.append('isOnline', String(body.isOnline ?? false));
                fd.append('category', body.category || '');
                if (body.capacity !== undefined) fd.append('capacity', String(body.capacity));
                fd.append('ticketPrice', String(body.ticketPrice ?? 0));
                fd.append('isFree', String(body.isFree ?? true));
                fd.append('isPublic', String(body.isPublic ?? true));
                if (body.tags) fd.append('tags', JSON.stringify(body.tags));
                if (body.ticketOptions) fd.append('ticketOptions', JSON.stringify(body.ticketOptions));
                fd.append('organizerInfo', body.organizerInfo || '');
                fd.append('image', (payload as any).coverImage.file);

                const res = await axios.post(`${apiBase}/api/events/create-event`, fd, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                    withCredentials: true
                });

                if (res.data?.success) {
                    // optionally refresh events list
                    setEvents(prev => [res.data.event, ...prev]);
                } else {
                    console.error('Create event failed:', res.data);
                    throw new Error(res.data?.message || 'Create failed');
                }
            } else {
                // send JSON (no file)
                const res = await axios.post(`${apiBase}/api/events/create-event`, body, { withCredentials: true });
                if (res.data?.success) {
                    setEvents(prev => [res.data.event, ...prev]);
                } else {
                    console.error('Create event failed:', res.data);
                    throw new Error(res.data?.message || 'Create failed');
                }
            }
        } catch (err) {
            console.error('sendData error', err);
            throw err;
        }
    };

    // removed accidental immediate sendData() call

    useEffect(() => {
        async function fetchFeaturedEvents () {
            try {
                const res = await axios.get((process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000') + `/api/events/featured-events`, { withCredentials: true });
                if(res.data.success) {
                    setFeaturedEvents(res.data.events); 
                } else {
                    console.log(res.data.message);
                }
            } catch (err) {
                console.error(err);
            }
        }
        fetchFeaturedEvents(); 
    }, [])

    useEffect(() => {
        const fetchEvents = async () => {
            try{
                const res = await axios.get((process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000') + `/api/events/get-all`, { withCredentials: true });
                if(res.data.success) {
                    console.log(res.data.events);
                    setEvents(res.data.events); 
                } else {
                    console.log(res.data.message);
                }
            }
            catch(err) {
                console.error(err);
            }
        }
        const timeoutId = setTimeout(fetchEvents, 100); 
        return () => clearTimeout(timeoutId); 
    }, []);

    return (
        <EventContext.Provider value={{ events, sendData, setEvents, FeaturedEvents}}>
            {children}
        </EventContext.Provider>
    );
};

export const useEventContext = () => {
    const context = React.useContext(EventContext);
    if (!context) {
        throw new Error('useEventContext must be used within a EventContextProvider');
    }
    return context;
}


export default EventContext