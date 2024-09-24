import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';

const DataContext = createContext({});

export const api = {
  loadData: async () => {
    const json = await fetch('/events.json');
    return json.json();
  },
};

// J'ai défini useFindLastEvent pour encapsuler la logique de récupération du dernier événement. 
  // Cela permet d'utiliser d'autres hooks, comme useEffect, tout en rendant le code plus modulaire et réutilisable.
function useFindLastEvent(data) {
  const [lastEvent, setLastEvent] = useState(null);

  // useEffect s'assure que la logique de récupération de ce dernier événement ne s'exécute que lorsque les données sont disponibles. 
  useEffect(() => {
    if (!data) return;

    // timeStamps crée un tableau de timestamps à partir des dates des événements. 
      // Cela permet de comparer les dates sous forme numérique(MilliSecondes).
    const timeStamps = (data.events || []).map(event => Date.parse(event.date));

    // lastTimeStamps trouve le plus grand timestamp, qui correspond à la date la plus récente.
    const lastTimeStamps = Math.max(...timeStamps);

    // lastDate crée un objet Date à partir du plus grand timestamp.
    const lastDate = new Date(lastTimeStamps);

    // foundLastEvent recherche dans le tableau data.events l'événement dont la date correspond à lastDate.
    const foundLastEvent = (data.events || []).find(event => Date.parse(event.date) === lastDate.getTime());

    setLastEvent(foundLastEvent);
    // useEffect prend dans son tableau de dépendance data, 
      // pour indiquer à react d'executer la logique, chaque fois que la valeur de data change.
  }, [data]); 

  return lastEvent;
}

export const DataProvider = ({ children }) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const getData = async () => {
    try {
      const fetchedData = await api.loadData();
      setData(fetchedData);
    } catch (err) {
      setError(err);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const lastEvent = useFindLastEvent(data);
  // J'ai utilisé useMemo pour mémoriser contextValue, évitant ainsi la création d'un nouvel objet à chaque rendu, 
    // ce qui pourrait entraîner des re-rendus inutiles des composants qui consomment ce contexte.
  const contextValue = useMemo(() => ({ data, error, lastEvent }), [data, error, lastEvent]);
    // J'ai également mis à jour la valeur fournie au DataContext.Provider pour inclure lastEvent,
      // rendant ces données disponibles pour l'EventCard du Footer.
  return (
    <DataContext.Provider value={contextValue}>
      {children}
    </DataContext.Provider>
  );
};

DataProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useData = () => useContext(DataContext);