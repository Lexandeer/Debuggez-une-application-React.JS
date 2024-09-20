import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';

const DataContext = createContext({});

export const api = {
  loadData: async () => {
    const json = await fetch('/events.json');
    return json.json();
  },
};

function useFindLastEvent(data) {
  const [lastEvent, setLastEvent] = useState(null);

  useEffect(() => {
    if (!data) return;

    const timeStamps = data.events.map(event => Date.parse(event.date));
    const lastTimeStamps = Math.max(...timeStamps);
    const lastDate = new Date(lastTimeStamps);
    const foundLastEvent = data.events.find(event => Date.parse(event.date) === lastDate.getTime());

    setLastEvent(foundLastEvent);
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

  const contextValue = useMemo(() => ({ data, error, lastEvent }), [data, error, lastEvent]);

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