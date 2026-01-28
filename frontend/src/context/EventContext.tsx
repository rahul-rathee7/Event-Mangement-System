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
  [key: string]: any
}

interface EventContextType {
    events: Event[];
    setEvents: React.Dispatch<React.SetStateAction<Event[]>>;
    FeaturedEvents: Event[];
    sendData: (payload?: Partial<Event>) => Promise<void>
    isLoading?: boolean;
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
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const sendData = async (payload: Partial<Event> = {}) => {
        try {
            const apiBase = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
            const body: any = {
                ...payload,
                title: (payload as any).title || (payload as any).name || '',
            };
            delete body.coverImage;
            if (body.tags && !Array.isArray(body.tags)) {
                try { body.tags = JSON.parse(body.tags) } catch {}
            }
            if (body.ticketOptions && typeof body.ticketOptions !== 'string') {
                body.ticketOptions = body.ticketOptions;
            }

            const fd = new FormData();

            // Append all fields to FormData
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
const cover = (payload as any).coverImage;
if (cover) {
    if (cover instanceof File) {
        fd.append('image', cover);
    } else if (cover && (cover as any).file instanceof File) {
        fd.append('image', (cover as any).file);
    } else if (typeof cover === 'string') {
        fd.append('imageUrl', cover);
    }
}

            const res = await axios.post(`${apiBase}/api/events/create-event`, fd, {
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true
            });

            if (res.data?.success) {
                setEvents(prev => [res.data.event, ...prev]);
            } else {
                console.error('Create event failed:', res.data);
                throw new Error(res.data?.message || 'Create failed');
            }
        } catch (err) {
            console.error('sendData error', err);
            throw err;
        }
    };

    useEffect(() => {
        const fetchEvents = async () => {
            setIsLoading(true);
            try {
                const [featuredEventsRes, allEventsRes] = await Promise.all([
                    axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/events/featured-events`, { withCredentials: true }),
                    axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/events/get-all`, { withCredentials: true })
                ]);

                if (featuredEventsRes.data.success) {
                    setFeaturedEvents(featuredEventsRes.data.events);
                } else {
                    console.log(featuredEventsRes.data.message);
                }

                if (allEventsRes.data.success) {
                    console.log(allEventsRes.data.events);
                    setEvents(allEventsRes.data.events);
                } else {
                    console.log(allEventsRes.data.message);
                }
            } catch (err) {
                console.error('Error fetching events:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchEvents();
    }, []);

    return (
        <EventContext.Provider value={{ events, sendData, setEvents, isLoading, FeaturedEvents}}>
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