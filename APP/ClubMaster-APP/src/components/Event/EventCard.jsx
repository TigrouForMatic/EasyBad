import React from 'react';
import PropTypes from 'prop-types';
import styles from '../../styles/EventCard.module.css';

const EventCard = ({ event, isInscrit, getDateDisplay, getTimeDisplay, onClick }) => (
  <div className={`${styles.card} ${isInscrit ? styles.inscrit : styles.pasInscrit}`} onClick={() => onClick(event)}>
    <div className={styles.header}>
      <h3 className={styles.title}>{event.label}</h3>
      {isInscrit ? (
        <span className={`${styles.badge} ${styles.inscritBadge}`}>Inscrit</span>
      ) : (
        <span className={`${styles.badge} ${styles.pasInscritBadge}`}>Pas Inscrit</span>
      )}
    </div>
    <p className={styles.date}>
      Le {getDateDisplay(event.dd)} de {getTimeDisplay(event.dd)} à {getTimeDisplay(event.df)}
    </p>
    <p className={styles.description}>{event.description}</p>
  </div>
);

EventCard.propTypes = {
  event: PropTypes.shape({
    id: PropTypes.number.isRequired,
    label: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    dd: PropTypes.string.isRequired,
    df: PropTypes.string.isRequired,
  }).isRequired,
  isInscrit: PropTypes.bool.isRequired,
  getDateDisplay: PropTypes.func.isRequired,
  getTimeDisplay: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default React.memo(EventCard);