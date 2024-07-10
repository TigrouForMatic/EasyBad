import React, { useState, useEffect } from 'react';
import styles from '../../styles/AuthForm.module.css';

function PersonalInfoForm({ login, onAuthenticate, handlePersonalInformationSet }) {
  const [personalInfo, setPersonalInfo] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    bornDate: '',
  });

  const [addressInfo, setAddressInfo] = useState({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: ''
  });

  const [consentGiven, setConsentGiven] = useState(false);
  const [error, setError] = useState('');
  const [loginData, setLoginData] = useState(null);

  useEffect(() => {
    const storedLogin = localStorage.getItem('login');
    if (storedLogin) {
      try {
        setLoginData(JSON.parse(storedLogin));
      } catch (error) {
        console.error('Erreur lors du parsing des données de login:', error);
      }
    }
  }, []);

  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target;
    setPersonalInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddressInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!consentGiven) {
      setError("Veuillez accepter la politique de confidentialité pour continuer.");
      return;
    }

    if (!loginData?.id) {
      setError('ID de connexion non trouvé. Veuillez vous reconnecter.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      };

      const addressResponse = await fetch('http://localhost:3200/api/address/', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          ...addressInfo,
          private: true,
          validate: true
        }),
      });

      if (!addressResponse.ok) {
        throw new Error('Erreur lors de l\'enregistrement de l\'adresse');
      }

      const { id: addressId } = await addressResponse.json();

      const personalInfoResponse = await fetch('http://localhost:3200/api/personPhysic', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          name: `${personalInfo.firstName} ${personalInfo.lastName}`,
          naissanceDate: personalInfo.bornDate,
          phoneNumber: personalInfo.phoneNumber,
          loginId: loginData.id,
          addressId,
          emailaddress: login
        }),
      });

      if (!personalInfoResponse.ok) {
        throw new Error('Erreur lors de l\'enregistrement des informations personnelles');
      }

      const personalInfoData = await personalInfoResponse.json();
      localStorage.setItem('personPhysic', JSON.stringify(personalInfoData));

      handlePersonalInformationSet();
    } catch (err) {
      console.error('Erreur:', err);
      setError('Une erreur est survenue. Veuillez réessayer.');
      setConsentGiven(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.authForm}>
      {error && <p className={styles.error}>{error}</p>}
      
      <h2>Informations personnelles</h2>
      <input
        type="text"
        name="firstName"
        placeholder="Prénom"
        value={personalInfo.firstName}
        onChange={handlePersonalInfoChange}
        required
      />
      <input
        type="text"
        name="lastName"
        placeholder="Nom"
        value={personalInfo.lastName}
        onChange={handlePersonalInfoChange}
        required
      />
      <input
        type="tel"
        name="phoneNumber"
        placeholder="Numéro de téléphone"
        value={personalInfo.phoneNumber}
        onChange={handlePersonalInfoChange}
      />
      <input
        type="date"
        name="bornDate"
        placeholder="Date de naissance"
        value={personalInfo.bornDate}
        onChange={handlePersonalInfoChange}
      />

      <h2>Adresse</h2>
      {Object.entries(addressInfo).map(([key, value]) => (
        <input
          key={key}
          type="text"
          name={key}
          placeholder={key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1').trim()}
          value={value}
          onChange={handleAddressChange}
        />
      ))}
      
      <label className={styles.checkboxLabel}>
        <input
          type="checkbox"
          checked={consentGiven}
          onChange={(e) => setConsentGiven(e.target.checked)}
        />
        J'accepte la politique de confidentialité et le traitement de mes données personnelles
      </label>
      <button type="submit" disabled={!consentGiven}>
        Enregistrer et continuer
      </button>
      <button type="button" onClick={onAuthenticate} className={styles.skipButton}>
        Passer pour le moment
      </button>
    </form>
  );
}

export default PersonalInfoForm;