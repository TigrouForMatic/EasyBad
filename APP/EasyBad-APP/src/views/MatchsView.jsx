import { useState, useEffect } from "react";
import axios from "axios";
import {dateFormat} from "../js/date";

function MatchsView() {
    const [clubId, setClubId] = useState(1);
    const [typeEvent, setTypeEvent] = useState([]);
    const [event, setEvent] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [{ data: typeEventData }, { data: eventData }] = await Promise.all([
                    axios.get("http://localhost:3200/eventType?clubid=" + clubId),
                    axios.get("http://localhost:3200/event"),
                ]);
    
                setTypeEvent(typeEventData);
    
                const eventsDuClub = eventData.filter(event => event.eventtypeid === (((clubId - 1) * 5) + 3) || event.eventtypeid === (((clubId - 1) * 5) + 4));
    
                const sortedEventsDuClub = eventsDuClub
                    .filter(event => new Date(event.dd) >= new Date())
                    .sort((a, b) => new Date(a.dd) - new Date(b.dd));
    
                setEvent(sortedEventsDuClub);
            } catch (error) {
                console.error("Erreur lors de la récupération des données :", error);
            }
        };
    
        fetchData();
    }, []);
    
    const getDateDisplay = (date) => {
        return dateFormat(date);
    }

    return (
        <div>
            <h1>MatchsView</h1>

            <h2>Types d'evenement :</h2>
            <ul>
                {typeEvent.map((type) => (
                    <li key={type.id}>
                        <p>Nom : {type.label}</p>
                    </li>
                ))}
            </ul>

            <h2>Evenement :</h2>
            <ul>
                {event.map((event) => (
                    <li key={event.id}>
                        <p>Nom : {event.label}</p>
                        <p>Description : {event.description}</p>
                        <p>Date de debut : {getDateDisplay(event.dd)}</p>
                        <p>Date de fin : {getDateDisplay(event.df)}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default MatchsView;
