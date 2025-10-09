'use client'
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';


type Event = {
  _id: string
  title: string
  description: string
  location: string
  date: string
  time: string
  image: string
}

interface EventContextType {
    events: Event[];
    setEvents: React.Dispatch<React.SetStateAction<Event[]>>;
    FeaturedEvents: Event[]
}

export const EventContext = createContext<EventContextType>({
    events: [],
    setEvents: () => {},
    FeaturedEvents: [],
});

export const EventContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [events, setEvents] = useState<Event[]>([]);
    const [FeaturedEvents, setFeaturedEvents] = useState<Event[]>([]);

    useEffect(() => {
        async function fetchFeaturedEvents () {
        await axios.get(`http://localhost:5000/api/events/featured-events`).then((res) => {
            if(res.data.success) {
                setFeaturedEvents(res.data.events); 
            }
            else{
                console.log(res.data.message);
            }
        })}
        fetchFeaturedEvents(); 
    }, [])

    useEffect(() => {
    const fetchEvents = async () => {
        try{
            const res = await axios.get(`http://localhost:5000/api/events/get-all`);
            if(res.data.success) {
                console.log(res.data.events);
                setEvents(res.data.events); 
            }
            else{
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
        <EventContext.Provider value={{ events, setEvents, FeaturedEvents}}>
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