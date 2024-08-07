import React, { useState, useEffect, useMemo, useCallback } from "react";
import PropTypes from "prop-types";
import EventCard from "../components/Event/EventCard";
import styles from "../styles/HomeView.module.css";
import useStore from '../store/store';
import api from '../js/App/Api';
import { dateFormat, dateToTimeFormat } from "../js/date";

const useEventData = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userClubs, currentUser, setItems } = useStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const arrayClubId = userClubs.map(club => club.id);

        const typeEventData = await api.get("/eventType", { params: { arrayClubId: JSON.stringify(arrayClubId)} });
        setItems('typesEvent', typeEventData);

        const arrayEventTypeId = typeEventData.map(type => type.id);
        const eventData = await api.get("/event", { params: { arrayEventTypeId: JSON.stringify(arrayEventTypeId) } });
        setItems('events', eventData);

        const arrayEventId = eventData.map(evnt => evnt.id);
        const inscriptionData = await api.get("/inscription", { params: { arrayEventId: JSON.stringify(arrayEventId), PersonPhysicId : currentUser.id } });
        setItems('inscriptions', inscriptionData);
        
        const addressData = await api.get("/address");
        setItems('addresses', addressData);

        setIsLoading(false);
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
        setError(error);
        setIsLoading(false);
      }
    };
    fetchData();
  }, [userClubs, currentUser, setItems]);

  return { isLoading, error };
};

const MainEventCard = ({ event, getDateDisplay, getTimeDisplay, addresses }) => {
  const address = addresses.find(a => a.id === event.addressid);
  
  return (
    <div className={styles.mainEventCard}>
      <h2>{event.label}</h2>
      <p className={styles.mainEventDate}>
        Le {getDateDisplay(event.dd)} de {getTimeDisplay(event.dd)} à {getTimeDisplay(event.df)}
      </p>
      <p className={styles.mainEventDescription}>{event.description}</p>
      {address && (
        <p className={styles.mainEventAddress}>
          Adresse : {address.street}, {address.postalcode} {address.city}
        </p>
      )}
    </div>
  );
};

const EventList = ({ events, getDateDisplay, getTimeDisplay, inscriptions }) => (
  <div className={styles.eventList}>
    {events.map((event) => (
      <EventCard 
        key={event.id} 
        event={event} 
        isInscrit={inscriptions.some(ins => ins.eventid === event.id)}
        getDateDisplay={getDateDisplay} 
        getTimeDisplay={getTimeDisplay} 
      />
    ))}
  </div>
);

EventList.propTypes = {
  events: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      label: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      dd: PropTypes.string.isRequired,
      df: PropTypes.string.isRequired,
    })
  ).isRequired,
  getDateDisplay: PropTypes.func.isRequired,
  getTimeDisplay: PropTypes.func.isRequired,
  inscriptions: PropTypes.array.isRequired,
};

function HomeView() {
  const { isLoading, error } = useEventData();
  const { events, typesEvent, addresses, inscriptions } = useStore();

  const filteredAndSortedEvents = useMemo(() => {
    const now = new Date();
    return events
      .filter(
        (e) =>
          typesEvent.some((type) => e.eventtypeid === type.id) &&
          new Date(e.dd) >= now
      )
      .sort((a, b) => new Date(a.dd) - new Date(b.dd));
  }, [events, typesEvent]);

  const getDateDisplay = useCallback((date) => dateFormat(date), []);
  const getTimeDisplay = useCallback((date) => dateToTimeFormat(date), []);

  if (isLoading) return <div className={styles.loading}>Chargement...</div>;
  if (error) return <div className={styles.error}>Une erreur est survenue : {error.message}</div>;

  const nextEvent = filteredAndSortedEvents[0];

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Événements à venir</h1>
      {nextEvent && (
        <MainEventCard 
          event={nextEvent} 
          getDateDisplay={getDateDisplay} 
          getTimeDisplay={getTimeDisplay}
          addresses={addresses}
        />
      )}
      <EventList 
        events={filteredAndSortedEvents.slice(1)} 
        getDateDisplay={getDateDisplay} 
        getTimeDisplay={getTimeDisplay}
        inscriptions={inscriptions}
      />
    </div>
  );
}

export default HomeView;