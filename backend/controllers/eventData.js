import events from '../data.json' with { type: 'json' };

export const event_data = async (req, res) => {
    const { id } = req.body;

    try {
        const Event = events.find(event => event.id === parseInt(id));

        if(!Event){
            return res.status(200).json({ success: false, message: "No event found" });
        }

        return res.status(200).json({ success: true, Event });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
}

export const featured_events = async (req, res) => {
    try{
        if(events.length === 0) {
            return res.status(200).json({success: false, message: "No events found"});
        }
        
        const featured = events.filter((event, i) => i < 4)
        return res.status(200).json({success: true, message: "featured events fetched", events: featured});
    }catch(err) {
        return res. status(500).json({success: false, message: "Server Error"})
    }
}

export const all_events = async (req, res) => {
    try {
        if(events.length === 0){
            return res.status(200).json({ success: false, message: "No events found" });
        }

        return res.status(200).json({ success: true, events });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
}